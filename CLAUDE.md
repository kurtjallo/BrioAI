# Brio AI

A daily speaking-practice mobile app: record a 60-second answer to a daily prompt, get AI feedback on word choice and structure — deliberately **not** filler-word coaching.

## Document roles

- **Product scope and production-MVP architecture:** `PRD.md`. Section 9 is authoritative.
- **This file:** current repository state, engineering constraints, and agent
  behaviour. It does not override product scope.
- **Architecture diagram:** the mermaid and text in PRD §9 are authoritative.
  `docs/architecture.png` is derived and must be regenerated when §9 changes.

## Prototype today vs production MVP

**Current repository:**

- Expo app → synchronous `POST /api/analyze` → Deepgram → deterministic
  `metrics.py` → Gemini text-only judge
- Sessions and words in AsyncStorage; selected audio copied to
  `documentDirectory/recordings/`
- `SessionContext.todaysSession` currently treats one analyzed session as “done
  for today” and blocks another from the Today screen
- No Clerk, PostgreSQL, R2, Redis/Celery, `/api/v1`, durable upload outbox,
  product analytics, backend tracing, or production deployment configuration

**Approved target in PRD §9 — not built yet:**

- Render: separate FastAPI web and Celery worker services, managed PostgreSQL,
  and persistent Redis as broker only
- Private R2 audio uploaded from the iPhone through short-lived signed URLs
- Clerk verifies invite-only identity; a separate Brio AI invitation/account
  record gates provisioning and every authenticated API request
- `/api/v1`; OpenAPI-generated mobile client
- OpenAI production text analyst; Gemini development/test only and never given
  customer content
- TanStack Query for server state; Expo SQLite + Drizzle + SQLCipher for the
  durable local outbox; SecureStore for tokens/keys; AsyncStorage only for
  small non-sensitive preferences
- Up to three new session IDs per account/local day; the first server-verified
  upload marks activity, and analysis completion is not required for the day

Do not describe target services as existing, and do not implement future
architecture opportunistically outside the approved migration phase.

## Layout

```
mobile/                    Expo app (@cadence/mobile)
  app/                     expo-router screens: (tabs)/{index,practice,history,trends}.tsx,
                           recording.tsx, results/[sessionId].tsx, onboarding.tsx, settings.tsx
                           practice.tsx and trends.tsx are prototype-only; PRD defers
                           vocabulary drills and performance charts beyond MVP
  components/              Illustrations.tsx (blobs/squiggles + CadenceLogo), RecordButton,
                           WaveformVisualizer, SessionCard, WordUpgradeCard, ClinicalNote,
                           ErrorBoundary, ErrorFallback
  constants/colors.ts      Design-system palette (light + dark) — the source of truth
  contexts/                Session, Onboarding, Theme, Word providers
  services/                Anything that touches the outside world: api.ts (network),
                           storage.ts (sessions + words in AsyncStorage), preferences.ts
                           (onboarding flag, speaking context, reminder time),
                           notifications.ts (OS scheduling), recordings.ts (durable audio)
  data/                    Content shipped with the app: prompts.ts, words.ts,
                           sample-sessions.ts (onboarding's first session + the 15-session
                           sample history behind Settings → Load sample data)
                           sample-data controls must not ship in the production beta
  lib/                     Pure functions, no I/O: dates.ts (local day keys),
                           streak.ts, spaced-repetition.ts. The only tested code —
                           *.test.ts here run under `pnpm test`.
  hooks/useColors.ts       Theme-aware palette accessor — use this, never import colors
  types/index.ts           Domain types (Session, Analysis, WordEntry) — imported as `@/types`
  scripts/build.js         Static web build; web-preview/serve.js serves it (pnpm build / serve).
                           Both are Replit-era and `pnpm build` fails outside Replit — unresolved.
api/                       FastAPI — main.py (routing), asr.py (provider), metrics.py
brand/kit/                 Logo SVG/PNG, favicons, social, print, tokens, brand book PDF
brand/marks/               Raw generated logo SVGs (mark-4-asterisk.svg is the chosen mark)
docs/                      product-brief.md, onboarding-spec.md, design-direction.md,
                           asr-research.md, design-references/, architecture.png
```

Target-only directories such as `mobile/db/`, generated `/api/v1` client code,
Alembic migrations, and worker modules do not exist yet. Add them only in the
corresponding implementation phase; do not bend current files into pretending
the migration is complete.

**File-naming rules.** Components are `PascalCase.tsx`; every other module is `kebab-case.ts`.
Inside `app/` the filename *is* the route — `[sessionId].tsx` is expo-router's dynamic segment
(`/results/:sessionId`, read via `useLocalSearchParams`), `(tabs)` is a group that does **not**
appear in the URL, `_layout.tsx` is a layout, `+not-found.tsx` is the 404. **The punctuation is
load-bearing, the words inside it are not.** Dropping the brackets — `results/[sessionId].tsx` →
`results/session.tsx` — turns a dynamic route into a literal one and silently breaks opening a
specific result. Renaming *within* the brackets is fine and encouraged when it adds meaning:
`[id]` → `[sessionId]` was exactly that, and it means changing the `useLocalSearchParams` key
plus every `pathname`/`params` call site to match (template-literal pushes like
`` router.push(`/results/${id}`) `` are URL paths and need no change). Everywhere else, prefer the honest name:
`services/` for I/O, `data/` for shipped content, `lib/` for pure functions. There is no
`utils/`; it was a junk drawer holding all four kinds at once.

Flat by design — four top-level dirs, no container. This used to be `artifacts/*`, a Replit
scaffold word meaning "app the agent generated"; it said nothing about this project. The
scaffold also left `lib/*` globs pointing at directories that never existed, a catalog of
mostly-unused deps, and a Metro blockList for an `openai` package that was never a dependency.
All removed. `mobile/` is the only pnpm package; Python deps live in the **root**
`pyproject.toml`, managed with `uv`.

## Running locally (macOS)

Setup once: `pnpm install` and `uv sync` from the repo root.

**API server** (port 8080) — run from the repo root so `uv` finds the root `pyproject.toml`:
```
uv run uvicorn main:app --host 0.0.0.0 --port 8080 --app-dir api --reload
```
Needs `DEEPGRAM_API_KEY` and `GEMINI_API_KEY` in a gitignored `.env` at the repo root (see `.env.example`), loaded via python-dotenv. Without them `/api/analyze` returns 502 (ASR) or 500 (analyst) with the reason in the log; `/api/healthz` still works and reports both active models.

Those are prototype endpoints and credentials. Production replaces the
synchronous upload with `/api/v1` session creation, signed R2 upload,
confirmation, polling, and Celery processing. Do not write instructions as if
those routes or OpenAI/Clerk/Render credentials already exist.

**Mobile app** — point it at the API with `EXPO_PUBLIC_API_URL`, a **full origin including the scheme**:
```
cd mobile && EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:8080 pnpm dev
```
On a physical device `localhost` means the phone, not your Mac, so use the LAN IP (`ipconfig getifaddr en0`). The simulator can use `http://localhost:8080`. `EXPO_PUBLIC_DOMAIN` still works for hosted deploys. With neither set, `getBaseUrl()` throws a message naming the fix rather than silently fetching `https://undefined`.

**Brand reference:** there is no longer a runnable sandbox. The four brand boards it rendered
are committed as `brand/kit/cadence-brand-book.pdf` (5 pages: mark + rules, colour, type +
voice, in-use + accessibility + print), with the five logo concepts as vectors in
`brand/marks/`. The sandbox was a decision-making tool for a decision that is now closed, and
it carried 46 hardcoded hex values that could silently drift from `constants/colors.ts`.
**Don't rebuild it** — edit the palette in `colors.ts` and regenerate the PDF if the brand moves.

**Typecheck:** `pnpm typecheck` from the root. It currently fails in
`app/onboarding.tsx` and `app/recording.tsx` because both still reference
`/results/[id]` after the route changed to `/results/[sessionId]`. `mobile/` is the only
package with a typecheck script. There is still no typecheck, lint or import check for the
Python backend.

**Dependency check:** `npx expo-doctor` from `mobile/` — currently 18/18. It validates peer
deps that plain import-scanning misses, which is what makes it safe to prune `package.json`.

**Tests:** there is currently no automated test script or test file in the repository.
The pure functions in `mobile/lib/` and `api/metrics.py` are the first unit-test targets.
The Python backend also has no lint or typecheck.
PRD §9.10 additionally requires API contract, auth/RLS, outbox/idempotency,
state-machine, deletion, recovery, and real-device tests; none exists yet.

## Stack

### Prototype — current repository

- Mobile: Expo / expo-router / React Native, React Context, react-native-svg,
  reanimated 4 (+ react-native-worklets), AsyncStorage for sessions and words
- `@tanstack/react-query` is mounted in `app/_layout.tsx` but does not own session
  data yet; do not assume cloud caching or sync exists
- Audio: **expo-audio** (`useAudioRecorder`, `createAudioPlayer`) — migrated off expo-av; **do not reintroduce expo-av**
- Recording config lives in `constants/recording.ts`, not a preset. **iOS records uncompressed 16kHz mono PCM WAV; Android cannot** — MediaRecorder exposes no uncompressed container, so it falls back to 16kHz mono AAC and its acoustic metrics are measurably worse. Don't "fix" the asymmetry by putting iOS back on AAC.
- Backend: Python 3.12 FastAPI, `uv`-managed. Three modules: `main.py` (routing), `asr.py` (provider adapter), `metrics.py` (all counting). Seven deps: fastapi, uvicorn, deepgram-sdk, google-genai, wordfreq, python-dotenv, python-multipart.

### Production MVP — PRD §9 target, not in repository

- Mobile: Clerk + SecureStore; TanStack Query server state; Expo SQLite +
  Drizzle + SQLCipher outbox; FileSystem audio; AsyncStorage only for small
  non-sensitive preferences
- Backend: Render FastAPI + Celery + PostgreSQL + persistent Redis; Pydantic v2,
  SQLAlchemy 2, Psycopg 3, Alembic; private R2
- API: `/api/v1` REST with an OpenAPI-generated TypeScript client
- Providers: Deepgram audio transcription; deterministic Python/spaCy metrics;
  OpenAI text-only production analyst; Expo Push completion notification

### The pipeline is three stages and the split is deliberate. Don't collapse it.

1. **Transcribe** — `asr.py` → Deepgram Nova-3, `filler_words=true` (keeps the ums), `punctuate=true` (clause-boundary channel), `smart_format=false` (rewrites would break word↔timing correspondence), `mip_opt_out=true` (voice is biometric data). Returns verbatim text plus per-word start/end/confidence. Swap providers via `ASR_PROVIDER`; nothing above `asr.py` knows the vendor.
2. **Count** — `metrics.py`, in Python, never the model: wordCount, pace, fillerRate, vagueWordDensity, repetition, lexicalDiversity (MATTR window 25), and the pause map. **Don't move a countable metric into a prompt.** The old build did, and the diversity number changed between runs on the same transcript, which makes every trend line in PRD §8 noise.
3. **Judge** — the prototype uses Gemini, **text only, never audio**, for
instruction, word upgrades, structure, and self-repairs. Production uses
OpenAI after the PRD evaluation gate; Gemini becomes development/test-only and
must never receive customer content. Keeping audio away from the analyst is a
§11 win — raw voice goes to one vendor, not two.

**On the pause map** (`metrics.analyze_pauses`): every inter-word gap is stored, not just those over threshold, so the threshold can be re-swept without re-transcribing. The current 400ms implementation threshold is a *convention*, not a PRD requirement — Gao, Sun & Li (2025) found 200ms best for monologic tasks, and PRD F5 requires validation on Brio AI audio before fixing a production threshold. `before_zipf` is recorded because a raw pre-content-word count is **confounded**: everyone pauses longer before rarer words (de Jong 2016), so the real metric is the residual after conditioning on word difficulty. Fitting that against user history belongs to a future post-MVP trends job, not the current prototype. See `docs/asr-research.md`.

### Migration invariants

When replacing prototype pieces, preserve these contracts:

1. **Three stages:** Transcribe (`asr.py`) → Count (`metrics.py`) → Judge
   (text-only LLM). Never move countable metrics into a model prompt.
2. **Durable audio first:** copy the chosen take out of the OS cache before any
   upload or analysis; never store `recorder.uri` as a durable session path.
3. **Local calendar days:** use `lib/dates.ts`; never derive a local day with
   UTC `toISOString().split('T')[0]`.
4. **Judge normalization:** preserve `_normalise_structure`,
   `_normalise_word_upgrades`, and `_normalise_repairs` at the API boundary.
5. **Device-originated identity:** target sessions use UUIDv7 plus a stable
   idempotency key; replay cannot create another session or analysis.
6. **Atomic outbox:** chosen-take metadata and the upload operation enter
   encrypted SQLite in one transaction. Remove the upload row only after the
   server confirms the canonical session row, not after analysis finishes.
7. **State ownership:** the phone owns `local`/`uploading`; PostgreSQL owns
   `queued`/`transcribing`/`measuring`/`coaching`/`ready` and retry/delete states.
8. **Provider boundary:** Deepgram alone receives production audio; OpenAI alone
   receives production transcript/evidence text. No shadow customer traffic.

## Design language — "Ink & Paper"

Cream canvas `#FAF7F0`, white floating cards, ink navy `#1E2438` / text `#1B2033`, anchor blue `#3D52B4`. Playful accents: yellow `#F4C744`, orange `#EE7B42`, green `#57B57F`, purple `#8C67CB`, pink `#E56D93`, soft blue `#8CB8F3`. Radii 32 (cards) / 16 (small). Type: Fraunces for display headings only, Inter for body/UI.

Dark mode is a separate blue-black palette in the same file, key-for-key symmetric and WCAG-tuned. Change colours in `constants/colors.ts`, never inline — and use `useColors()` rather than importing the palette directly.

Official logo is the **Sticker Asterisk**: a multi-petal asterisk in yellow `#F4C744`, blue `#3D52B4`, pink `#E56D93` with a navy `#1E2438` centre, on cream `#FAF7F0`. Chosen from a 5-concept logo board; it echoes the StickerAsterisk illustration used throughout the UI. Regenerate raster icons (`mobile/assets/images/icon.png`) from the SVG — **never edit the PNGs directly**.

**Two** copies of that vector exist, down from three — deleting the mockup-sandbox removed its
`Asterisk` in LogoBoard. What remains: `CadenceLogo` in `mobile/components/Illustrations.tsx`
(react-native-svg, what the app renders) and `brand/marks/mark-4-asterisk.svg` /
`brand/kit/logo/svg/` (the exported kit). These are different formats for different consumers,
so the duplication is defensible — but they are still hand-synced. **Still unresolved: nominate
`brand/kit/logo/svg/cadence-mark-full-color.svg` as canonical and treat `CadenceLogo` as a
derived transcription of it**, or the two will drift the way three did.

Design origin lives in `docs/design-direction.md`. `docs/onboarding-spec.md` is
historical and is superseded by PRD §6.2 where they conflict. The prototype has
a shortened local-only flow with no auth; production has the nine-step
Clerk/legal/onboarding flow in the PRD.

## Product stance and voice

- Analysis coaches vocabulary and articulation, **not filler words**. `fillerRate` is displayed as table stakes but never emphasised or turned into a score. Deliberate positioning — keep it.
- **No emojis in the UI.**
- Brand voice: warm, encouraging, editorial — like a writing coach, never clinical.
- PRD §11's referral line **ships** as `components/ClinicalNote.tsx`, mounted at the bottom of the results screen and of settings. One component, two mount points, so the wording cannot drift. Deliberately a hairline rule and muted 13px body text rather than a callout — the screen above it has just told someone their point landed late, and an alarm-styled banner there reads as a diagnosis.

## Gotchas

- In JSX, never leave a trailing `{/* comment */}` after a self-closing element on the same line. The whitespace becomes a text node and crashes native with "Text strings must be rendered within a `<Text>`".
- App icon and splash changes only appear in real builds, not Expo Go.
- Expo web: the first screenshot after load can be blank because of entrance animations — wait ~8s and retry.
- **Recordings are persisted — keep them that way.** expo-audio writes into the OS cache (`cachesDirectory` on iOS per `AudioRecorder.swift`, `context.cacheDir/Audio` on Android), which the OS reclaims and reinstall wipes. `services/recordings.ts` copies each take to `documentDirectory/recordings/<sessionId>.<ext>` **before** the analyze call, and `session.audioUri` stores that path. Never store `recorder.uri` on a Session. The expo-file-system v19 API is *synchronous* for local ops. Three invariants go with it: `deleteAllRecordings()` runs on clear-sessions and load-sample-data or the audio outlives its sessions at ~1.9MB/min; audio is **not** deleted when analysis fails, so a retry resends rather than re-records; `recordingExists()` seeds the playback error state so pre-fix sessions say "Recording unavailable" up front instead of after a dead tap.
- **Day keys are local, instants are UTC.** `session.date` stores a full UTC ISO instant (correct — instants are absolute), but every *calendar day* comparison goes through `lib/dates.ts`. Deriving a day key with `toISOString().split('T')[0]` is UTC and shipped a daily user-visible bug: west of UTC an evening session landed on tomorrow's key, so the next morning the app said "Done for today." and skipped the day; east of UTC the window inverted; streaks undercounted by one everywhere but offset zero. `pnpm test` sweeps seven timezones because a suite that runs only in UTC cannot catch this at all.
- **`ios.bundleIdentifier` / `android.package` are `com.cadenceapp.cadence`.** A bundle ID is permanent once submitted to the App Store, so do not change it casually after the first submission.
- **Never move the recorder back to a compressed format.** Measured on real audio, an AAC round trip leaves loud speech 0.2% off but quiet passages **14.6%** off, and it stops improving above 128kbps because the encoder discards sub-perceptual detail by design. Those quiet passages are breath and the fading tail of a sentence — F7's `ending: "fade"` and the intensity contour. A 60s PCM recording is ~1.9MB vs ~230KB; that is the price of the measurement.
- Run `npx expo-doctor` after touching dependencies. It catches missing native peer deps (it found `expo-asset`, absent despite being required by `expo-audio`) that only crash outside Expo Go.
- FastAPI error bodies use `{"detail": ...}`; `services/api.ts` parses both `detail` and `error`. Keep both paths.
- **`EXPO_PUBLIC_*` is inlined by Metro at build time**, not read at runtime. Changing `mobile/.env` needs a full Metro restart — a reload will not pick it up. The recording screen calls `assertApiConfigured()` **before** opening the microphone, because this used to surface only after a full 60-second take, on a misconfiguration no in-app retry could fix.
- **Never trust the judge's JSON shape.** It parses as valid JSON and still omits required keys — a reply of `{"instruction": "x"}` once produced `structure: {}`, and the client types `pointPlacement` as required and dereferences `.position`. `ErrorBoundary` is mounted only at the app root, so that took down the entire tree. `main.py`'s `_normalise_structure` / `_normalise_word_upgrades` / `_normalise_repairs` coerce every field before it leaves the API. Containing model output inside the judge stage is the point of the three-stage split.
- `pnpm-workspace.yaml` enforces a 1-day minimum npm release age as supply-chain defense. Don't disable it; use `minimumReleaseAgeExclude` for a specific urgent package.

---

# Working agreement

## Rules

- **Never commit, push, or open a PR. Only I do that.** Stage nothing on my behalf. Make the changes, tell me what changed and why, and give me the exact command to run. This applies to every git operation that writes history or touches a remote: `commit`, `push`, `merge`, `rebase`, `tag`, `reset --hard`, branch deletion. Read-only git (`status`, `log`, `diff`, `show`, `branch -v`) is always fine.
- For every front-end change, use the front-end skill.
- **Never include "Co-Authored-By: Claude" in any git commits, pushes, or PRs.** No Claude attribution anywhere in the repo.
- After I commit, update this CLAUDE.md to reflect the current state of the project (new files, components, decisions, etc.) — then leave that change uncommitted for me too.

## Engineering preferences

Use these to guide recommendations:

- DRY is important — flag repetition aggressively.
- Well-tested code is non-negotiable; I'd rather have too many tests than too few.
- Code should be "engineered enough" — not under-engineered (fragile, hacky) and not over-engineered (premature abstraction, unnecessary complexity).
- Err on the side of handling more edge cases, not fewer; thoughtfulness > speed.
- Bias toward explicit over clever.

## Collaboration principles

1. **Ask, don't assume.** If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements. When running unattended, pick the most reasonable interpretation, proceed, and record the assumption rather than blocking.
2. **Match the solution to the problem.** Simplest solution for simple problems, better solutions for harder problems. Do not over-engineer or add flexibility that isn't needed yet.
3. **Don't touch unrelated code** — but do surface bad code or design smells you discover, so we can address them as a separate issue.
4. **Flag uncertainty explicitly.** If unsure, see point 1. Where it makes sense, run a small, localised, low-risk experiment and bring the hypothesis and results back to discuss. Confidence without certainty causes more damage than admitting a gap.
5. **Suggest better ways.** Always open to ideas, especially ones with long-lasting impact over a tactical change.

## Code review protocol

When running a review, work through these sections **in order**, and **pause for feedback after each one** before moving on.

1. **Architecture review** — system design and component boundaries, dependency graph and coupling, data flow patterns and bottlenecks, scaling characteristics and single points of failure, security architecture (auth, data access, API boundaries).
2. **Code quality review** — code organization and module structure, DRY violations (be aggressive), error handling patterns and missing edge cases (call out explicitly), technical debt hotspots, areas over- or under-engineered relative to the preferences above.
3. **Test review** — coverage gaps (unit, integration, e2e), test quality and assertion strength, missing edge case coverage (be thorough), untested failure modes and error paths.
4. **Performance review** — N+1 queries and database access patterns, memory-usage concerns, caching opportunities, slow or high-complexity code paths.

### For each issue found

- Describe the problem concretely, with file and line references.
- Present 2-3 options, including "do nothing" where reasonable.
- For each option: implementation effort, risk, impact on other code, maintenance burden.
- Give an opinionated recommended option and why, mapped to the preferences above.
- Explicitly ask whether I agree or want a different direction before proceeding.

### AskUserQuestion formatting

- NUMBER issues (1, 2, 3…) and give LETTERS for options (A, B, C…).
- Every option must clearly label the issue NUMBER and option LETTER so there's no confusion.
- The recommended option is always the 1st option.

### Workflow

- Do not assume my priorities on timeline or scale.
