# Cadence

Daily speaking practice. Record a 60-second answer to one prompt, get feedback on the words you reached for and the order you put them in.

Every other tool in this category coaches delivery — pace, filler count, eye contact. Cadence deliberately doesn't. It measures the two things that actually make capable people sound less capable than they are: **word choice** and **structure**.

## The thesis

Most people who feel their speaking undersells them don't have a small vocabulary. They have a **retrieval** problem. The precise word exists in their head; it just doesn't arrive in time. So they circumlocute — orbit the word they can't land on — and the answer runs long and lands late.

That failure is measurable. A long pause immediately before a content word is someone reaching for a word they can't retrieve. Cadence finds those pauses and tracks whether they shrink.

## How it works

```
phone ──audio──► Deepgram ──► metrics.py ──► Gemini ──► results
                 hear          count          judge
```

1. **Hear** — Deepgram Nova-3 returns a verbatim transcript (the "um"s survive) plus per-word timings.
2. **Count** — everything countable is computed in Python: pace, filler rate, vague-word density, repetition, lexical diversity (MATTR), and the pause map. Never asked of a model, because a model gives a different answer each run and the trend lines have to be reproducible.
3. **Judge** — Gemini reads the transcript as text and handles what can't be counted: a better word you could have used, where your point actually landed, whether the answer ended or trailed off. It never receives audio.

Progress is always measured against your own history. No population benchmarks.

## Running it

```bash
pnpm install && uv sync
cp .env.example .env        # add DEEPGRAM_API_KEY and GEMINI_API_KEY
```

```bash
# API
uv run uvicorn main:app --port 8080 --app-dir artifacts/api-server --reload

# App (LAN IP, not localhost — on a device, localhost is the phone)
cd artifacts/mobile && EXPO_PUBLIC_API_URL=http://<LAN-IP>:8080 pnpm dev
```

## Layout

```
artifacts/mobile/       Expo app (expo-router, expo-audio)
artifacts/api-server/   FastAPI — main.py, asr.py, metrics.py
artifacts/mockup-sandbox/  Vite sandbox for brand boards
brand/                  Logo, marks, tokens, brand book
docs/                   Product brief, onboarding spec, ASR research, architecture
```

`CLAUDE.md` is the working reference. `PRD.md` is the product spec — note it describes a **target** architecture (Postgres, Celery, R2) that doesn't exist yet.

## Status

Working prototype. The daily loop runs end to end on a device with real transcription and analysis.

Not built yet: accounts, a server-side database, durable audio storage. Everything lives on the phone, so replacing it loses your history.

The open question is whether the retrieval-latency signal holds up on real hesitant speech. That needs hand-transcribed recordings to check the transcriber against — nobody has benchmarked whether any ASR preserves false starts and repetitions, only filled pauses. See `docs/asr-research.md`.
