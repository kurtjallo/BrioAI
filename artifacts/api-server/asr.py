"""ASR provider adapter.

PRD F4 requires transcription to be reached through an internal interface
rather than called directly from product code, so the provider stays
swappable. The M0 bake-off is not settled — Speechmatics and ElevenLabs
Scribe are live alternatives — so nothing above this module should know
which vendor answered.

The contract is deliberately narrow: audio in, verbatim text plus per-word
timings out. Anything a specific vendor offers beyond that (sentiment,
topics, summaries) is not part of it.
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field

logger = logging.getLogger("cadence-api.asr")

DEFAULT_MODEL = "nova-3"


@dataclass
class Word:
    word: str            # normalised token, lowercase, no punctuation
    start: float         # seconds from start of audio
    end: float
    confidence: float
    punctuated: str      # same token with punctuation and casing, for clause detection


@dataclass
class Transcript:
    text: str
    words: list[Word] = field(default_factory=list)
    provider: str = ""
    model: str = ""

    @property
    def has_timings(self) -> bool:
        return bool(self.words)


class ASRError(RuntimeError):
    pass


def transcribe(audio_bytes: bytes, mime_type: str) -> Transcript:
    """Transcribe with the configured provider. ASR_PROVIDER selects it."""
    provider = os.environ.get("ASR_PROVIDER", "deepgram").lower()
    if provider == "deepgram":
        return _deepgram(audio_bytes, mime_type)
    raise ASRError(f"Unknown ASR_PROVIDER: {provider!r}")


def _deepgram(audio_bytes: bytes, mime_type: str) -> Transcript:
    from deepgram import DeepgramClient

    api_key = os.environ.get("DEEPGRAM_API_KEY")
    if not api_key:
        raise ASRError("DEEPGRAM_API_KEY is not set")

    model = os.environ.get("DEEPGRAM_MODEL", DEFAULT_MODEL)
    client = DeepgramClient(api_key=api_key)

    response = client.listen.v1.media.transcribe_file(
        request=audio_bytes,
        model=model,
        language="en",
        # Keep "um" and "uh". Without this Deepgram strips them, which
        # deletes the primary signal before anything downstream sees it.
        filler_words=True,
        # Punctuation is the clause-boundary channel for the F5 pause
        # classifier. It is NOT for the parser, which gets its own view.
        punctuate=True,
        # smart_format rewrites numbers, dates and entities into display
        # form. That is a formatted transcript, not a verbatim one, and the
        # rewrites break the word-to-timing correspondence. Leave it off.
        smart_format=False,
        # Per-request opt-out of Deepgram's model improvement program:
        # audio is retained only for the duration of the request. Voice is
        # biometric data (PRD section 11), so this is not optional.
        mip_opt_out=True,
    )

    try:
        alt = response.results.channels[0].alternatives[0]
    except (AttributeError, IndexError) as exc:
        raise ASRError(f"Unexpected Deepgram response shape: {exc}") from exc

    words: list[Word] = []
    for w in getattr(alt, "words", None) or []:
        raw = getattr(w, "word", "") or ""
        words.append(
            Word(
                word=raw,
                start=float(getattr(w, "start", 0.0) or 0.0),
                end=float(getattr(w, "end", 0.0) or 0.0),
                confidence=float(getattr(w, "confidence", 0.0) or 0.0),
                punctuated=getattr(w, "punctuated_word", None) or raw,
            )
        )

    text = (getattr(alt, "transcript", "") or "").strip()

    # Prefer the punctuated word stream when reconstructing the transcript:
    # it is the same tokens the timings refer to, so text and timings cannot
    # drift apart.
    if words:
        text = " ".join(w.punctuated for w in words).strip() or text

    logger.info(
        "deepgram: model=%s words=%d timings=%s mime=%s",
        model, len(words), bool(words), mime_type,
    )

    return Transcript(text=text, words=words, provider="deepgram", model=model)
