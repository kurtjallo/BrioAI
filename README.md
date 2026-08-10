# Brio AI

Daily speaking practice for clearer words and better-structured answers.

Record a 15–60-second response to one prompt. Brio AI returns transcript-grounded
feedback on word choice, point placement, signposting, and how the answer ends.
It deliberately does not turn filler words into the product.

> **Status:** The production MVP is in development. This repository currently
> contains a working local prototype; the approved production architecture
> below is the target and has not been implemented yet.

## Product

Brio AI is for people whose speaking undersells how well they think. It is
built around a specific thesis: the issue is often retrieving the precise word
under time pressure and ordering an answer so the main point arrives early,
not vocabulary size.

The daily loop stays under five minutes:

1. Receive one prompt selected for the day.
2. Record for 15–60 seconds, with one optional retake.
3. Save the chosen take before any upload.
4. Analyse the transcript in three separate stages.
5. Show one useful instruction first, followed by supporting evidence.

Progress is measured against the user's own history, never a population
benchmark.

## Analysis

The production pipeline preserves three separate stages as a product and
privacy boundary:

1. **Transcribe** — Deepgram receives audio and returns a verbatim transcript
   with word timing.
2. **Measure** — deterministic Python code calculates every countable metric,
   including pace, vague language, repetition, lexical diversity, and pauses.
3. **Coach** — OpenAI receives transcript text and computed evidence, never
   audio, and returns feedback that cannot be reduced to a reliable count.

Countable facts do not come from a language model. Production analyses must
retain their model, prompt, and metric versions so results remain explainable.

## Production architecture

The approved production MVP is an invite-only, iPhone-first beta for up to 50
external testers:

```text
iPhone ──sign-in──► Clerk
iPhone ──Clerk JWT──► FastAPI on Render ──► PostgreSQL
iPhone ──signed audio upload──► private R2
PostgreSQL outbox ──► Redis ──► Celery worker
private R2 ──audio──► Celery worker ──► Deepgram
Deepgram ──transcript──► Celery worker ──► metrics.py ──► OpenAI
Celery worker ──result──► PostgreSQL
iPhone ──polling──► FastAPI
Celery worker ──Expo Push──► iPhone
```

The target mobile app keeps pending audio in FileSystem and upload metadata in
an encrypted SQLite outbox. PostgreSQL owns server processing state. Redis
carries job messages but is not the source of truth. Production uploads and
analysis must be safe to retry without creating duplicate sessions.

See [PRD.md](PRD.md) §9 for the authoritative architecture and the
[derived architecture diagram](docs/architecture.png).

## Privacy and reliability

Production requirements:

- Voice is treated as sensitive biometric-adjacent data.
- Deepgram is the only external analysis provider that receives audio.
- OpenAI receives transcript text and evidence only.
- Production customer content is never sent to Gemini.
- Audio stays private and is retained until the user deletes the session or
  account.
- Monitoring excludes audio, transcripts, prompts, coaching, credentials, and
  signed upload links.
- The production beta must stay within a $100 monthly operating cap without
  silently dropping queued recordings.

## Current repository

The working prototype already supports recording, transcription,
deterministic metrics, text-only AI feedback, local history, and playback.
It uses a synchronous `POST /api/analyze` flow, Gemini as the development
analyst, and device-local storage.

Production identity, PostgreSQL, private R2 uploads, Celery processing, the
encrypted mobile outbox, and `/api/v1` are approved targets, not current
repository capabilities.

## Run the prototype

Requirements: Node.js with pnpm, Python 3.12 with uv, and either Xcode with an
iOS Simulator or Expo Go on an iPhone.

```bash
pnpm install
uv sync
cp .env.example .env
```

Add `DEEPGRAM_API_KEY` and `GEMINI_API_KEY` to the root `.env`, then start the
API:

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 8080 --app-dir api --reload
```

Confirm it is running at `http://localhost:8080/api/healthz`.

Start the mobile app:

```bash
cd mobile
EXPO_PUBLIC_API_URL=http://<LAN-IP>:8080 pnpm dev
```

Use `ipconfig getifaddr en0` to find the Mac's LAN IP for a physical iPhone;
`localhost` points to the phone. The iOS Simulator can use
`http://localhost:8080`. Follow the Expo terminal prompt to open the simulator
or connect the device.

## Quality checks

```bash
pnpm typecheck
cd mobile && npx expo-doctor
```

## Repository layout

```text
mobile/   Expo app and local mobile services
api/      FastAPI prototype, transcription adapter, and metrics
brand/    Logo assets, design tokens, and brand guidelines
docs/     Product, design, onboarding, and speech-research context
```

[PRD.md](PRD.md) is the product and production-architecture source of truth.
[CLAUDE.md](CLAUDE.md) records the current repository state and engineering
constraints.
