"""Cadence API server — FastAPI.

Endpoints:
- GET  /api/healthz  — health check
- POST /api/analyze  — audio -> Deepgram (verbatim + word timings) ->
                       metrics.py (counts, pauses) -> Gemini (judgement)

Three stages, separated by what each is actually good at:

1. TRANSCRIBE (asr.py -> Deepgram Nova-3). An acoustic model, so word
   timings come from frame-level decoding rather than an autoregressive
   guess. filler_words=true keeps the disfluencies. This replaced a Gemini
   audio call that returned no timings at all, which made PRD F5's pause map
   structurally impossible.

2. COUNT (metrics.py). Everything countable is counted in Python: word
   count, pace, filler rate, vague-word density, repetition, MATTR, and the
   pause map. Never ask a model to count. It is not reproducible, and the
   trend lines in PRD section 8 are worthless if the same audio yields a
   different number each run.

3. JUDGE (Gemini, text only). Word upgrades, where the point landed,
   signposting, the one instruction. Gemini receives the transcript and the
   computed pause statistics as TEXT and never receives audio, so raw voice
   stops leaving for a second vendor (PRD section 11).
"""

import json
import logging
import os
import re

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from google import genai
from google.genai import types

import asr
import metrics

# Load .env from the repo root regardless of where uvicorn was launched from.
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cadence-api")

app = FastAPI(title="Cadence API")

MAX_AUDIO_BYTES = 25 * 1024 * 1024  # 25 MB
DEFAULT_MODEL = "gemini-3.6-flash"

ALLOWED_TYPES = {
    "audio/m4a", "audio/x-m4a", "audio/mp4", "audio/mpeg", "audio/mp3",
    "audio/wav", "audio/x-wav", "audio/webm", "audio/ogg", "audio/aac",
    "audio/flac",
}

SYSTEM_PROMPT = """You are a precise speech analysis engine for a daily speaking practice app called Cadence.

You are given a VERBATIM transcript of a roughly 60-second spoken answer, plus timing statistics already computed from the audio. Return a single JSON object. No markdown, no commentary, no extra keys.

Required structure:
{
  "instruction": "One specific, actionable sentence. Cite something the speaker actually said. Format: 'Your [observation] — try [action] tomorrow.'",
  "wordUpgrades": [
    {
      "original": "the vague or weak word used",
      "originalSentence": "the exact sentence containing the word",
      "suggestion": "a more precise alternative",
      "improvedSentence": "that sentence rewritten with the suggestion"
    }
  ],
  "structure": {
    "pointPlacement": {
      "sentence": "the sentence containing the main claim or conclusion",
      "position": 3,
      "total": 8
    },
    "signposting": ["phrases used to guide the listener, e.g. 'first', 'the key thing is'"],
    "sentenceComplexity": "simple",
    "ending": "clean"
  },
  "repairs": [
    {
      "abandoned": "the abandoned or corrected material, verbatim",
      "repair": "what the speaker said instead",
      "type": "substitution"
    }
  ]
}

Rules:
- The transcript is VERBATIM and deliberately so. The "um"s, false starts and repeated words are the data, not noise. Never quote it back cleaned up.
- wordUpgrades: 0-3 only. Suggest words a well-read professional could say in a meeting without anyone noticing. Reject archaic, academic or pretentious alternatives. If none qualify, return [].
- pointPlacement: count sentences (1-indexed). If unclear, position = total.
- sentenceComplexity: "simple" (clear, direct), "moderate" (some complexity), "complex" (deeply nested).
- ending: "clean" (strong close), "fade" (trails off), "abrupt" (cuts mid-thought).
- instruction: the most critical field. Specific. Quotes actual phrasing. If the pause statistics show word-searching, that is usually the most useful thing to point at.
- repairs: find self-corrections and false starts. type is "substitution" (replaced a word with a different one), "repetition" (repeated while stalling), or "abandoned" (started over with no repair). A substitution where the speaker reached a MORE PRECISE word on the second attempt is a success worth naming. If none, return [].

Do not report word counts, pace, filler rates, diversity scores or pause counts. Those are computed and will be merged into your output.

Return ONLY valid JSON."""


def get_gemini() -> genai.Client:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")
    return genai.Client(api_key=api_key)


def _pause_brief(pauses: dict) -> str:
    """Render the computed pause map as text for the analyst model."""
    c = pauses["counts"]
    lines = [
        f"Silences over {pauses['thresholdMs']:.0f}ms: {c['total']} "
        f"({c['preContentWord']} before a content word, "
        f"{c['clauseBoundary']} at a clause boundary, "
        f"{c['preFilledPause']} before a filled pause).",
        f"Longest silence: {pauses['longestMs']:.0f}ms.",
    ]
    notable = sorted(
        (g for g in pauses["gaps"] if g["kind"] in ("pre-content-word", "pre-filled-pause")
         and g["gap_ms"] >= pauses["thresholdMs"]),
        key=lambda g: -g["gap_ms"],
    )[:5]
    if notable:
        lines.append("Longest word-searching pauses:")
        for g in notable:
            lines.append(f'  {g["gap_ms"]:.0f}ms at {g["at_s"]:.1f}s, before "{g["before"]}"')
    return "\n".join(lines)


@app.get("/api/healthz")
def healthz():
    return {
        "status": "ok",
        "asr": os.environ.get("ASR_PROVIDER", "deepgram"),
        "asrModel": os.environ.get("DEEPGRAM_MODEL", asr.DEFAULT_MODEL),
        "analyst": os.environ.get("GEMINI_MODEL", DEFAULT_MODEL),
    }


@app.post("/api/analyze")
async def analyze(
    audio: UploadFile = File(...),
    prompt: str = Form(...),
    duration: str = Form("60"),
):
    if not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        duration_s = float(duration)
    except ValueError:
        duration_s = 60.0

    declared = (audio.content_type or "audio/m4a").lower()
    if declared not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported audio format")

    # Read in chunks and reject as soon as the cap is exceeded, rather than
    # buffering an arbitrarily large body first.
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await audio.read(1024 * 1024)  # 1 MB
        if not chunk:
            break
        total += len(chunk)
        if total > MAX_AUDIO_BYTES:
            raise HTTPException(status_code=413, detail="Audio file too large (max 25 MB)")
        chunks.append(chunk)

    audio_bytes = b"".join(chunks)
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="No audio file uploaded")

    logger.info("analyze: %d bytes, type=%s duration=%.1fs", len(audio_bytes), declared, duration_s)

    try:
        # ── 1. Transcribe ────────────────────────────────────────────────
        try:
            result = asr.transcribe(audio_bytes, declared)
        except asr.ASRError as exc:
            logger.error("ASR failed: %s", exc)
            raise HTTPException(status_code=502, detail="Transcription failed. Please try again.")

        transcript = result.text.strip()
        if not transcript:
            raise HTTPException(
                status_code=422,
                detail="Could not transcribe audio. Please speak clearly and try again.",
            )

        # ── 2. Count ─────────────────────────────────────────────────────
        computed = metrics.compute(transcript, duration_s, prompt)
        pauses = (
            metrics.analyze_pauses(result.words)
            if result.has_timings
            else {"thresholdMs": metrics.DEFAULT_PAUSE_THRESHOLD_MS, "gaps": [],
                  "counts": {"total": 0, "clauseBoundary": 0, "preContentWord": 0,
                             "preFilledPause": 0, "other": 0},
                  "longestMs": 0.0, "totalSilenceMs": 0.0,
                  "unavailable": "provider returned no word timings"}
        )

        # ── 3. Judge ─────────────────────────────────────────────────────
        client = get_gemini()
        model = os.environ.get("GEMINI_MODEL", DEFAULT_MODEL)
        user_content = (
            f'Prompt the speaker was answering: "{prompt}"\n'
            f"Recording length: {duration_s:.1f}s\n\n"
            f"Timing statistics computed from the audio:\n{_pause_brief(pauses)}\n\n"
            f"Verbatim transcript:\n{transcript}"
        )
        response = client.models.generate_content(
            model=model,
            contents=[user_content],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                temperature=0.2,
                max_output_tokens=8192,
            ),
        )

        raw_text = (response.text or "").strip()
        cleaned = re.sub(r"^```(?:json)?\n?", "", raw_text, flags=re.MULTILINE)
        cleaned = re.sub(r"\n?```$", "", cleaned, flags=re.MULTILINE).strip()

        try:
            judged = json.loads(cleaned)
        except json.JSONDecodeError:
            logger.error("Failed to parse analysis JSON: %s", raw_text[:500])
            raise HTTPException(
                status_code=500, detail="Analysis could not be parsed. Please try again."
            )

        analysis = {
            "instruction": judged.get("instruction", ""),
            "wordUpgrades": judged.get("wordUpgrades", []),
            "structure": judged.get("structure", {}),
            "repairs": judged.get("repairs", []),
            "vocabulary": computed["vocabulary"],
            "delivery": computed["delivery"],
            "pauses": pauses,
        }

        return {
            "transcript": transcript,
            "analysis": analysis,
            "words": [
                {"word": w.punctuated, "start": w.start, "end": w.end, "confidence": w.confidence}
                for w in result.words
            ],
            "provider": {"asr": result.provider, "asrModel": result.model, "analyst": model},
        }

    except HTTPException:
        raise
    except Exception:
        logger.exception("Analysis endpoint error")
        raise HTTPException(status_code=500, detail="Analysis failed. Please try again.")


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8080"))
    uvicorn.run(app, host="0.0.0.0", port=port)
