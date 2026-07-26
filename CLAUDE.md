# Cadence

A daily speaking-practice mobile app: record a 60-second answer to a daily prompt, get AI feedback on word choice and structure — deliberately **not** filler-word coaching.

- **Product source of truth:** `PRD.md` (goals, features, data model, target architecture)
- **Architecture diagram:** `docs/architecture.png` (also inlined as mermaid in PRD §9)
- PRD §9 describes the *target* architecture (Railway, Postgres, Celery, R2). What exists today is one FastAPI endpoint plus AsyncStorage on device. Don't treat the PRD stack table as current state.

## Layout

```
artifacts/mobile/          Expo app (@workspace/mobile)
  app/                     expo-router screens: (tabs)/{index,practice,history,trends}.tsx,
                           recording.tsx, results/[id].tsx, onboarding.tsx, settings.tsx
  components/              Illustrations.tsx (blobs/squiggles + CadenceLogo), RecordButton,
                           WaveformVisualizer, MetricCard, SessionCard, WordUpgradeCard
  constants/colors.ts      Design-system palette (light + dark) — the source of truth
  contexts/                Session, Onboarding, Theme, Word providers
  utils/                   api.ts, storage.ts (AsyncStorage), prompts.ts, words.ts,
                           spaced-repetition.ts, notifications.ts
artifacts/api-server/main.py   FastAPI: GET /api/healthz, POST /api/analyze
artifacts/mockup-sandbox/      Vite + React sandbox (@workspace/mockup-sandbox) —
                               4 brand boards, 8 source files, 12 deps. The app does
                               NOT import it. 55 unused shadcn components and 46 deps
                               were removed; don't re-add a UI kit for static boards.
brand/kit/                 Logo SVG/PNG, favicons, social, print, tokens, brand book PDF
brand/marks/               Raw generated logo SVGs (mark-4-asterisk.svg is the chosen mark)
docs/                      product-brief.md, onboarding-spec.md, design-direction.md,
                           design-references/, architecture.png
```

pnpm workspace (`artifacts/*` only). Python deps live in the **root** `pyproject.toml`, managed with `uv`.

## Running locally (macOS)

Setup once: `pnpm install` and `uv sync` from the repo root.

**API server** (port 8080) — run from the repo root so `uv` finds the root `pyproject.toml`:
```
uv run uvicorn main:app --host 0.0.0.0 --port 8080 --app-dir artifacts/api-server --reload
```
Needs `DEEPGRAM_API_KEY` and `GEMINI_API_KEY` in a gitignored `.env` at the repo root (see `.env.example`), loaded via python-dotenv. Without them `/api/analyze` returns 502 (ASR) or 500 (analyst) with the reason in the log; `/api/healthz` still works and reports both active models.

**Mobile app** — point it at the API with `EXPO_PUBLIC_API_URL`, a **full origin including the scheme**:
```
cd artifacts/mobile && EXPO_PUBLIC_API_URL=http://<your-LAN-IP>:8080 pnpm dev
```
On a physical device `localhost` means the phone, not your Mac, so use the LAN IP (`ipconfig getifaddr en0`). The simulator can use `http://localhost:8080`. `EXPO_PUBLIC_DOMAIN` still works for hosted deploys. With neither set, `getBaseUrl()` throws a message naming the fix rather than silently fetching `https://undefined`.

**Mockup sandbox** (port 8082, brand boards only — the app does not import it):
```
pnpm --filter @workspace/mockup-sandbox run dev
```
`PORT` and `BASE_PATH` default to 8082 and `/`. 8082 avoids Metro's 8081.

**Typecheck:** `pnpm typecheck` from the root — green across both packages. (It used to fail in `mockup-sandbox` on `calendar.tsx`/`spinner.tsx`, where two copies of `@types/react` made `React.Ref` incompatible with itself; deleting the unused shadcn components removed the conflict.) There is still no typecheck, lint or import check for the Python backend.

## Stack

- Mobile: Expo / expo-router / React Native, react-native-svg, reanimated 4 (+ react-native-worklets), AsyncStorage
- Audio: **expo-audio** (`useAudioRecorder`, `createAudioPlayer`) — migrated off expo-av; **do not reintroduce expo-av**
- Recording config lives in `constants/recording.ts`, not a preset. **iOS records uncompressed 16kHz mono PCM WAV; Android cannot** — MediaRecorder exposes no uncompressed container, so it falls back to 16kHz mono AAC and its acoustic metrics are measurably worse. Don't "fix" the asymmetry by putting iOS back on AAC.
- Backend: Python 3.12 FastAPI, `uv`-managed. Three modules: `main.py` (routing), `asr.py` (provider adapter), `metrics.py` (all counting). Seven deps: fastapi, uvicorn, deepgram-sdk, google-genai, wordfreq, python-dotenv, python-multipart.

### The pipeline is three stages and the split is deliberate. Don't collapse it.

1. **Transcribe** — `asr.py` → Deepgram Nova-3, `filler_words=true` (keeps the ums), `punctuate=true` (clause-boundary channel), `smart_format=false` (rewrites would break word↔timing correspondence), `mip_opt_out=true` (voice is biometric data). Returns verbatim text plus per-word start/end/confidence. Swap providers via `ASR_PROVIDER`; nothing above `asr.py` knows the vendor.
2. **Count** — `metrics.py`, in Python, never the model: wordCount, pace, fillerRate, vagueWordDensity, repetition, lexicalDiversity (MATTR window 25), and the pause map. **Don't move a countable metric into a prompt.** The old build did, and the diversity number changed between runs on the same transcript, which makes every trend line in PRD §8 noise.
3. **Judge** — Gemini, **text only, never audio**: instruction, word upgrades, structure, self-repairs. Keeping audio away from the analyst is also a §11 win — raw voice goes to one vendor, not two.

**On the pause map** (`metrics.analyze_pauses`): every inter-word gap is stored, not just those over threshold, so the threshold can be re-swept without re-transcribing. The PRD's 400ms is a *convention*, not a finding — Gao, Sun & Li (2025) found 200ms best for monologic tasks. `before_zipf` is recorded because a raw pre-content-word count is **confounded**: everyone pauses longer before rarer words (de Jong 2016), so the real metric is the residual after conditioning on word difficulty. Fit that in the nightly F11 job against the user's own history. See `docs/asr-research.md`.

## Design language — "Ink & Paper"

Cream canvas `#FAF7F0`, white floating cards, ink navy `#1E2438` / text `#1B2033`, anchor blue `#3D52B4`. Playful accents: yellow `#F4C744`, orange `#EE7B42`, green `#57B57F`, purple `#8C67CB`, pink `#E56D93`, soft blue `#8CB8F3`. Radii 32 (cards) / 16 (small). Type: Fraunces for display headings only, Inter for body/UI.

Dark mode is a separate blue-black palette in the same file, key-for-key symmetric and WCAG-tuned. Change colours in `constants/colors.ts`, never inline — and use `useColors()` rather than importing the palette directly.

Official logo is the **Sticker Asterisk**: a multi-petal asterisk in yellow `#F4C744`, blue `#3D52B4`, pink `#E56D93` with a navy `#1E2438` centre, on cream `#FAF7F0`. Chosen from a 5-concept logo board; it echoes the StickerAsterisk illustration used throughout the UI. Regenerate raster icons (`artifacts/mobile/assets/images/icon.png`) from the SVG — **never edit the PNGs directly**.

Three copies of that vector exist and the old notes disagreed about which is canonical: `CadenceLogo` in `components/Illustrations.tsx`, the `Asterisk` in the mockup-sandbox LogoBoard, and `brand/marks/mark-4-asterisk.svg` / `brand/kit/logo/svg/`. **Unresolved — pick one before editing the mark**, or the three will drift.

Design origin and screen-level specs live in `docs/design-direction.md` and `docs/onboarding-spec.md`. The onboarding spec covers the 7-step flow, the results-screen ordering, and the four states every screen needs.

## Product stance and voice

- Analysis coaches vocabulary and articulation, **not filler words**. `fillerRate` is displayed as table stakes but never emphasised or turned into a score. Deliberate positioning — keep it.
- **No emojis in the UI.**
- Brand voice: warm, encouraging, editorial — like a writing coach, never clinical.
- PRD §11 requires a line directing users with persistent word-finding difficulty to a qualified professional. It does not exist in the app yet.

## Gotchas

- In JSX, never leave a trailing `{/* comment */}` after a self-closing element on the same line. The whitespace becomes a text node and crashes native with "Text strings must be rendered within a `<Text>`".
- App icon and splash changes only appear in real builds, not Expo Go.
- Expo web: the first screenshot after load can be blank because of entrance animations — wait ~8s and retry.
- **Recordings are not persisted.** `session.audioUri` points into expo-audio's OS-managed cache, which the OS reclaims and reinstall wipes, so replay silently dies on old sessions. `expo-file-system` is now installed but **not yet wired** — the fix is a `copyAsync` into `documentDirectory` at save time.
- **`ios.bundleIdentifier` / `android.package` are `com.cadenceapp.cadence`.** A bundle ID is permanent once submitted to the App Store, so do not change it casually after the first submission.
- **Never move the recorder back to a compressed format.** Measured on real audio, an AAC round trip leaves loud speech 0.2% off but quiet passages **14.6%** off, and it stops improving above 128kbps because the encoder discards sub-perceptual detail by design. Those quiet passages are breath and the fading tail of a sentence — F7's `ending: "fade"` and the intensity contour. A 60s PCM recording is ~1.9MB vs ~230KB; that is the price of the measurement.
- Run `npx expo-doctor` after touching dependencies. It catches missing native peer deps (it found `expo-asset`, absent despite being required by `expo-audio`) that only crash outside Expo Go.
- FastAPI error bodies use `{"detail": ...}`; `utils/api.ts` parses both `detail` and `error`. Keep both paths.
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
