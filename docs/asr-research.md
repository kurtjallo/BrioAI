# ASR & speech-stack research

Generated July 2026 by an 11-agent research workflow: 5 researchers (hosted APIs, open source, forced-alignment+VAD, on-device iOS, adjacent stack), each adversarially fact-checked, then synthesised. Everything below is a **July 2026 snapshot** — vendors change disfluency handling silently between model versions.

## Recommendation

**Speechmatics Enhanced (batch) as the single production ASR — one call, no alignment stage in the request path — plus MFA as an offline calibration oracle and prosody promoted to P0.**

Concretely, the stack:

1. **ASR: Speechmatics Enhanced batch API.** Leave `remove_disfluencies` at its default (`false`) so disfluencies survive AND arrive `disfluency`-tagged. Read `start_time`/`end_time` (float seconds) and `confidence` (0–1) per word, and read punctuation as separate typed elements with `attaches_to` and the `is_eos` boolean.
2. **No forced-alignment stage in production.** Instead: **Montreal Forced Aligner 3.4** (MIT code, CC-BY-4.0 acoustic models) run once, offline, on your laptop via the official `mmcauliffe/montreal-forced-aligner` Docker image, over 20 hand-verbatim-transcribed recordings. It is a measuring instrument for M0/M1, not a pipeline component. It only becomes a Celery-worker sidecar (CPU-only, which suits Railway) if the bake-off proves Speechmatics' onsets are loose.
3. **VAD: `silero-vad`, as a QA assertion, not a metric.** Compare its transcript-independent silence budget against your aligned gap budget; alert on disagreement. Set `speech_pad_ms=0` and `time_resolution=3` or it silently corrupts every measurement.
4. **Prosody: `praat-parselmouth`, moved from P1 to P0.** F0 contour and per-word duration z-scores are required inputs to the F5 pause classifier and to F7 ending strength — those are acoustic definitions currently scheduled to be scored from text.
5. **Gemini stays, but as the analyst, not the transcriber.** Feed it the timed verbatim transcript plus computed gap statistics as text. This also removes raw voice audio from a third party entirely, which materially simplifies §11.
6. **Deepgram Nova-3 pre-integrated as the second adapter** behind the interface F4 already mandates (`filler_words=true`, `mip_opt_out=true`).
7. **Change the recorder before any of this.** Switch expo-audio on iOS to `LINEARPCM` / `.wav` / 16 kHz / mono / 16-bit. Every downstream tool wants exactly that, and it eliminates the AAC priming-delay question entirely. (Note PRD §9.1 already claims "consistent WAV PCM across platforms" while the recorder emits m4a — reconcile that.)
8. **No on-device ASR in v1.** Revisit only for the P1 instant-feedback card and F9 word-of-the-day verification.

Rejected and why: **torchaudio MMS_FA** — the fact-checker found the pretrained weights are **CC-BY-NC 4.0**, non-commercial, and MMS_FA is the only forced-alignment bundle torchaudio ships; torchaudio is also in declared maintenance mode with docs that still say `forced_align` was removed in 2.9 (it wasn't). **WhisperX** — ~110 ms mean word-boundary error on spontaneous speech, and it interpolates timings for out-of-dictionary tokens without flagging them. **CrisperWhisper** — best technical fit in the field, blocked by a non-commercial weights license. **Qwen3-ForcedAligner** — Apache 2.0 and genuinely good, but documented CUDA-only, and Railway has no GPUs while Fly deprecates theirs on 2026-07-31.

## Why

Cadence's binding constraint is not accuracy or cost, it is that one person has to keep this running while shipping a 4-week P0, and every decomposed architecture on the table currently has a licensing or hosting hole in it. The single fact that reorganises the whole decision is that **forced alignment cannot recover a word the transcriber never emitted** — so verbatim must be solved first regardless, and once you have solved it with an acoustic (CTC/transducer-family) ASR rather than an LLM-style speech model, a second alignment pass has to beat timings you already have, and nobody has measured whether it does on your audio. Speechmatics wins over Deepgram on two Cadence-specific grounds rather than general quality: verbatim is the *default* rather than a flag on a cleaned model, and it is the only vendor that hands you disfluencies *tagged* as `disfluency` plus punctuation carrying an `is_eos` boolean — which is two of the three inputs to your F5 "pre-content-word vs clause-boundary" classifier, pre-computed, instead of you regex-matching a filler list. The one piece of hard empirical evidence anyone has published on filler-detection rate also favours it: McGuire 2025 measured Speechmatics at 0.841 against Deepgram's 0.713 and Whisper's 0.025 (caveat: L2 speakers, which is your secondary user, not your primary). Privacy pushes the same way — documented 7-day auto-deletion with a delete-sooner API, ISO 27001:2022 and SOC 2 Type II, versus ElevenLabs' zero-retention being enterprise-gated, which is the wrong default for biometric voice data on a solo-dev plan. Keeping alignment out of the request path is what makes this maintainable: MFA is the most accurate aligner measured (~20–22 ms mean word-boundary error on Buckeye spontaneous speech, roughly 5× better than WhisperX) but it is a conda/Kaldi container, and running it twenty times on your laptop costs an afternoon while running it in production costs you forever. Finally, the thing that will actually determine whether the retrieval-latency signal is real is not the ASR at all — it is that a raw "pause before content word" count is confounded, because de Jong (2016) showed both L1 and L2 speakers pause more before lower-frequency words, so the construct you want is the *residual* after conditioning on word frequency and surprisal, and your within-subject design lets you fit that curve on the user's own history.

## Runner-up

**Deepgram Nova-3** (`filler_words=true`, `mip_opt_out=true`). It wins outright under either of two conditions, both resolvable this week. First, if Speechmatics will not confirm in writing that they do not train on customer audio — their docs document retention thoroughly and are completely silent on training, which is an unacceptable gap for biometric voice data going through App Store review. Deepgram's posture is the cleanest self-serve offer in the field: training is voluntary opt-*in*, and per-request `mip_opt_out=true` means data "is retained only for the duration necessary to process the request" with no enterprise contract required. Second, if the M0 bake-off against MFA ground truth shows Speechmatics' word onsets are materially looser than Deepgram's. The cost of being wrong here is small — both are conventional acoustic models with per-word start/end/confidence in float seconds, so the adapter interface F4 already requires makes this a config change, and you should integrate both anyway.

Distant third, worth naming because it is the lowest-risk path if you distrust all of the above: **keep Gemini for the transcript and buy Rev AI Forced Alignment at $0.003/min**. This closes exactly the stated gap without touching a pipeline you have already tuned — but only if you first prove Gemini is genuinely verbatim on hesitant speech, which nobody has ever benchmarked. If Gemini is silently deleting false starts, alignment gives you precise timings for a corrupted token stream, which is worse than having no timings because the failure is invisible.

## Options compared

### Speechmatics Enhanced (batch)

| | |
|---|---|
| verbatim | yes |
| word timestamps | unknown |
| operational burden | low |
| price | "from $0.129/hr" Pro tier; per-model batch rate unpublished. 3,000 free min/month likely covers your whole early user base. |

THE PICK. Verbatim is the default (`remove_disfluencies: false`) across 40 hesitation vocalizations, and uniquely they arrive TAGGED as `disfluency` rather than as raw tokens you must pattern-match. Punctuation comes as separate typed elements with `attaches_to` and `is_eos` — a free clause-boundary channel for the F5 pause classifier. Per-word start_time/end_time as float seconds plus confidence 0-1. Retention documented at 7 days with a delete-sooner API; ISO 27001:2022, SOC 2 Type II, GDPR, HIPAA. Timestamp methodology is marked 'unknown' honestly: it is a conventional acoustic model so timings come from frame-level decoding rather than autoregressive estimation, but Speechmatics states this nowhere and publishes no ms figure — nobody in the industry does. TWO OPEN ITEMS BEFORE YOU SHIP: their docs contain no statement about training on customer audio, and the Enhanced batch rate is unpublished. Both are one email.

### Deepgram Nova-3

| | |
|---|---|
| verbatim | yes-with-flag |
| word timestamps | unknown |
| operational burden | none |
| price | $0.46/hr ($0.0077/min PAYG) — the fact-checker corrected an earlier $0.26/hr figure as stale by 1.8x. ~$0.23/user/month. |

RUNNER-UP, and integrate it as the second adapter regardless. `filler_words=true` covers exactly seven tokens (uh, um, mhmm, mm-mm, uh-uh, uh-huh, nuh-uh), English only — nothing documented about false starts or repetitions, which are three of your four verbatim requirements. Best privacy lever in the field for a solo dev: training is opt-IN only, and per-request `mip_opt_out=true` gives process-duration-only retention with no enterprise contract. Lowest operational burden here — one POST, mature Python SDK. Note Deepgram's current flagship is now Flux (voice agents), but `filler_words` is documented only on Nova/Nova-2/Nova-3, so Flux would be a downgrade for you; Nova-3 remains correct.

### ElevenLabs Scribe v2

| | |
|---|---|
| verbatim | yes |
| word timestamps | unknown |
| operational burden | low |
| price | $0.22/hr, identical across all plans |

Best verbatim story on paper, disqualified on privacy posture. It is the only vendor whose docs explicitly name FALSE STARTS as model output (`no_verbatim`, default false, 'removes filler words, false starts and non-speech sounds') — strong evidence of verbatim-trained references. Character-level timestamps in addition to word-level are a genuine differentiator for onset precision. But zero-retention is `enable_logging=false` and the docs state verbatim 'Zero retention mode may only be used by enterprise customers' — logged-by-default retention of biometric voice on a self-serve plan is the wrong shape for App Store review. Also note `no_verbatim` is gated to scribe_v2 only, so scribe_v1 carries no verbatim guarantee if v2 ever goes away. Put it in the bake-off; do not default to it.

### AssemblyAI Universal-3.5 Pro / Universal-2

| | |
|---|---|
| verbatim | partial |
| word timestamps | model-estimated |
| operational burden | low |
| price | $0.21/hr (U3.5 Pro), $0.15/hr (U2) |

Reads best, carries the biggest hidden risk. The `disfluencies` boolean governs only a 9-token filler list. Broader verbatim behaviour on Universal-3.5 Pro is steered by a natural-language `prompt` — which is exactly the ungoverned, no-error-signal property that disqualifies Gemini as a transcriber, and that critique applies here too. Universal-3 Pro is an autoregressive speech language model, the architecture class where timings are model-estimated rather than acoustically decoded. A third-party review puts word-timestamp accuracy at '~400ms' — uncorroborated in AssemblyAI's own docs, but if even approximately right it sits exactly at your detection threshold. IMPLEMENTATION TRAP the research missed: AssemblyAI returns start/end in MILLISECONDS while Deepgram, Speechmatics and ElevenLabs all return float seconds. A benchmark harness will silently produce a 1000x error on this arm. Also use `speech_models` (plural); `speech_model` is deprecated.

### Gemini (verbatim text) + Rev AI Forced Alignment

| | |
|---|---|
| verbatim | unknown |
| word timestamps | forced-alignment |
| operational burden | low |
| price | $0.18/hr for alignment ($0.003/min), on top of existing Gemini spend |

Lowest-risk path to closing the stated gap, gated on one unproven assumption. Rev is the only vendor that sells forced alignment as a separately-priced product where alignment is the STATED mechanism rather than something I had to infer. It closes exactly your gap without rewriting the analysis prompt you have already tuned. But: Gemini's verbatim fidelity on hesitant speech has never been benchmarked by anyone, and forced alignment can only time words that are IN the transcript you hand it. If Gemini is already silently repairing false starts, you get precise timings for a corrupted token stream — a failure with no error signal. Validate Gemini's verbatim fidelity FIRST; if it fails, this path cannot be saved. Also unverified: Rev's self-serve retention and training terms, which matters for biometric audio.

### CrisperWhisper 2.0 (self-hosted)

| | |
|---|---|
| verbatim | yes |
| word timestamps | model-estimated |
| operational burden | high |
| price | Weights free for non-commercial; commercial license price UNPUBLISHED — contact Nyra |

The best technical fit in the entire survey, blocked by licensing and hosting. Built by nyra health for clinical aphasia assessment — disfluency timing as a cognitive biomarker, which is nearly your exact problem. Explicit verbatim/intended modes, disfluency F1 87.8, and the v1 paper shows Whisper's insertion/omission error rate dropping from 11.77 to 2.26 on AMI (i.e. vanilla Whisper drops ~12% of spoken words on spontaneous speech). THREE BLOCKERS. Licensing: inference code is MIT but weights are under the Nyra Health Non-Commercial Research License — 'any commercial use requires a commercial license', price unpublished. Accuracy is lower than headline: 41 ms mean boundary error on CONVERSATIONAL speech, not the 29.6 ms TIMIT read-speech figure — MFA's 21.75 ms on Buckeye is roughly 2x better on the audio type you actually record. Hosting: it wants a GPU, and after 2026-07-31 neither Railway nor Fly has one. Also note a real calibration trap if you ever do adopt it: v1 splits pause duration into the adjacent words with a 160 ms cap per side, so a true 400 ms gap can surface as ~80 ms measured — naive thresholding under-detects badly. (Whether 2.0 retains that heuristic is undocumented.) Worth one email to Nyra; not worth architecting around before you have the price.

### Montreal Forced Aligner 3.4

| | |
|---|---|
| verbatim | no |
| word timestamps | forced-alignment |
| operational burden | medium |
| price | Free (MIT code, CC-BY-4.0 acoustic models) |

Not a transcriber — it aligns a transcript you supply, which is why 'verbatim: no' rather than a judgment on quality. Use it as an INSTRUMENT, not a stage. Most accurate word boundaries measured anywhere: 19.93 ms (TIMIT) / 21.75 ms (Buckeye spontaneous), versus MMS 43-50 ms, NeMo 78-89 ms, WhisperX 110 ms. Two corrections worth knowing: the widely-quoted ~12-14 ms figure is PHONE boundary error, not word; and the paper is by MFA's own maintainers, so discount accordingly. Structurally right for pause measurement specifically — it models silence as an explicit `sil` phone so a pause gets its own interval rather than being smeared into adjacent word durations, and `--use_cutoff_model` generates pronunciations for truncated false starts. CPU-only, so it fits Railway if you ever do productionise it. One caveat on its Buckeye number: utterances containing cutoff words were filtered out of that benchmark, so 21.75 ms is not evidence it handles false starts well.

### Apple SpeechAnalyzer / SpeechTranscriber (on-device, iOS 26+)

| | |
|---|---|
| verbatim | unknown |
| word timestamps | unknown |
| operational burden | high |
| price | Free (shared system asset, no app size cost) |

Real, better than expected, and still not for v1. Word timing genuinely works: `attributeOptions: [.audioTimeRange]` yields a CMTimeRange per run on finalized results (volatile results give one range for the whole string), plus `.transcriptionConfidence` covers your nice-to-have — and finnvoor's `yap` CLI ships `--word-timestamps` on top of it, so this is shipping, not aspirational. But verbatim behaviour is COMPLETELY unmeasured — there is no verbatim switch (the sole TranscriptionOption is `etiquetteReplacements`, i.e. profanity), every published WER is on LibriSpeech read speech which contains no disfluencies, and the only evidence fillers survive is circumstantial (a macOS dictation app that ships a filler-removal layer). Apple publishes no timestamp precision figure; Apple staff hedge with 'word-level(-ish)'. Hardware gate is iOS 26 + iPhone 12 or later, ~70-75% coverage, so you need a fallback path regardless. Expo integration: the fact-checker corrected the claim that nothing exposes iOS timings — jamsch/expo-speech-recognition advertises word confidence AND timing on iOS 17+ unconditionally (though it wraps only SFSpeechRecognizer, and rejects m4a input), and @react-native-ai/apple does use SpeechAnalyzer with an undocumented segment schema. Spend 30 minutes testing those before committing 2-4 days of Swift.

## What the plan is missing

### Frequency-conditioned pause residual — the single biggest correctness gap in the whole thesis

**Effort:** days

**Why it matters.** de Jong (2016, IRAL 54:2, 52 L2 + 18 L1 Dutch speakers) found that BOTH L1 and L2 speakers pause more before lower-frequency words. That means a raw 'pause before content word' count conflates a universal, healthy word-difficulty effect with the pathology Cadence exists to detect. A user who talks about specialist topics scores as having a retrieval problem; a user talking in platitudes scores as fluent. The construct you actually want — 'the precise word exists but does not arrive in time', per PRD §1.1 — is the RESIDUAL: pauses longer or more frequent than that word's difficulty predicts. The same paper also validates your mid-clause vs end-clause split: L2 speakers paused more than L1 speakers WITHIN utterances but not between them, so mid-clause pauses index lexical retrieval while end-clause pauses index conceptual planning. Your within-subject design (Principle 1) is a gift here — fit the frequency curve on the user's own history rather than a population norm.

**How.** `wordfreq`'s `zipf_frequency(word, 'en')`, pinned to a specific version. It is in declared sunset (snapshot through ~2021, will not be updated because generative AI contaminated web corpora) — which for psycholinguistic norming is a feature, since you want a stable pre-contamination reference and your users' vocabulary predates 2021. Licensing nuance: Apache for the code, CC-BY-SA 4.0 for the data with per-source attribution. Fit P(pause | Zipf, syntactic position, surprisal) in the nightly Celery baseline job (F11) and report the residual as the headline retrieval metric.

### The 400 ms pause threshold is a convention, not a finding — and it is probably too high

**Effort:** hours

**Why it matters.** PRD F5 hard-codes >400ms. Gao, Sun & Li (2025, Language Testing 42(3), thresholds swept 100-1000 ms) found that for MONOLOGIC tasks — precisely Cadence's format — a 200 ms threshold best predicted BOTH L2 proficiency and perceived fluency; 350 ms was optimal only for dialogic perceived fluency. Published cut-offs across the field span 100-1000 ms. Getting this wrong does not produce an error, it produces a metric that measures the wrong thing forever. Worse, 400 ms of silence means something completely different for a 200 wpm speaker than a 120 wpm speaker, so an unnormalised threshold will drift with how energetic the user feels that day and pollute every F11 trend line.

**How.** In M1, sweep the threshold from 150 to 600 ms over your 20 hand-verified recordings and pick it on data. Normalise by each speaker's own articulation rate (syllables per phonation time) via the de Jong & Wempe syllable-nuclei method — intensity peaks flanked by dips, filtered to voiced regions, ~100 lines of praat-parselmouth. Add an upper cap too: a 3-second silence is abandonment, a different event class, not a bigger version of the same one.

### Prosody is P0, not P1 — the F5 pause classification is unanswerable without it

**Effort:** days

**Why it matters.** PRD F5 requires classifying each gap as 'pre-content-word vs clause-boundary', and F7 defines ending strength as 'clean close / fade / abrupt stop'. Both are acoustic definitions currently scheduled to be scored from a spaCy parse and an LLM. A syntactic parse tells you where a clause COULD end; only prosody tells you whether the speaker TREATED it as an ending — and that distinction is the entire difference between a planning pause (fine) and a retrieval stall (your product). The three canonical acoustic correlates of an intonational phrase boundary are pause, pre-boundary lengthening and pitch reset. Biron et al. (PLOS ONE 2021) got F=0.65 / Cohen's kappa 0.79 on the Santa Barbara Corpus using speech-rate discontinuity alone (last word 356±28 ms vs mid-phrase 201±7 ms) plus 300-400 ms silences, deliberately WITHOUT using pitch — and MFA for alignment. 'Uptalk' is an F0 terminal rise and 'trailing off' is an intensity decay; neither is visible in text.

**How.** `praat-parselmouth` (pip-installable, GPLv3 — fine behind your FastAPI boundary), already named in PRD P1. `Sound.to_pitch()` for F0 reset and terminal rise; Intensity contour for trailing off; per-word duration z-scores from your ASR timings for pre-boundary lengthening. Set pitch floor/ceiling per speaker from a first pass — Praat's 75-600 Hz default spans both sexes and will hand you octave errors that read as pitch resets. Speechmatics' `is_eos` gives you a free third, independent signal to cross-check against.

### LM surprisal as a covariate on every measured pause

**Effort:** hours

**Why it matters.** Frequency is context-free; surprisal is context-conditioned, and they disagree often. A long pause before a HIGH-surprisal word is a genuine retrieval event. A long pause before a highly predictable word is not about lexical access at all — it is breath, planning, or performance. This single covariate should cut the false-positive rate on your headline metric substantially, for almost no work. Dammalapati, Rajkumar & Agarwal (NAACL SRW 2019) found lexical surprisal and dependency-locality integration costs informative for predicting Switchboard fillers and repairs, with disfluencies occurring ahead of upcoming difficulty (their result was 'encouraging' rather than strong — the Uniform Information Density hypothesis was not significantly predictive).

**How.** Run any small causal LM over the transcript once and take per-token log-probabilities, or use logprobs from an API call you are already making. Store surprisal alongside Zipf on each word row and feed both into the residual model from item 1.

### Structural disfluency parsing: reparandum / interregnum / repair, not filler counts

**Effort:** days

**Why it matters.** This is a stronger justification for the verbatim requirement than filler counting, and it is the only place your data can show the OUTCOME you are selling. The Switchboard scheme decomposes every disfluency into reparandum (abandoned material), interregnum (the editing phrase, e.g. 'uh', 'I mean'), and repair. A substitution repair where the repair word has LOWER Zipf frequency than the reparandum is the direct signature of a successful late retrieval — the user reached a more precise word on the second attempt, which is literally G1. A repetition repair is stalling while retrieval completes. An abandoned false start with no repair is the failure case. A bare filled pause tells you almost nothing by comparison. Counting all four as 'filler rate per 100 words' throws the diagnosis away and keeps only the symptom — and PRD §8 already correctly calls filler rate the category's vanity metric.

**How.** Off-the-shelf models are BIO taggers that flag disfluent spans without emitting the reparandum-to-repair correspondence, so use the LLM for the correspondence step. This is a legitimate LLM job — structured, evidence-citing, verifiable against the transcript — and a far better use of it than scoring 'ending strength', which is acoustic. Then measure the Zipf delta across each substitution repair. Note this only works on a verbatim transcript; it is undefined on a cleaned one.

### Audio hygiene: AAC priming delay, single canonical decode, no AGC

**Effort:** hours

**Why it matters.** Apple TN2258 documents that AAC encoders prepend priming samples — commonly 2112 (Apple convention) or 1024 (FFmpeg native), roughly 21-48 ms. That is over 10% of a 400 ms threshold. It mostly cancels when you take a DIFFERENCE between two boundaries, so it is survivable — but only if one decode produces one timeline. If your ASR path and your prosody path each decode the m4a independently and one honours the packet-table info while the other does not, they silently disagree and you will never find out. Separately, PRD F3 is unusually careful to disable AGC/noise suppression, which directly protects the intensity contour that 'trailing off' depends on — that discipline should extend to logging device model and sample rate on the recording row, because a user upgrading their phone mid-baseline shows up as a step change in every acoustic metric.

**How.** Switch expo-audio iOS to `outputFormat: IOSOutputFormat.LINEARPCM`, `extension: '.wav'`, `sampleRate: 16000`, `numberOfChannels: 1`, `linearPCMBitDepth: 16`. At 60 seconds the size difference is irrelevant and cost is not a constraint. Decode once in the worker, store the decoded 16 kHz mono WAV as the canonical artifact both ASR and parselmouth read. Verify with a click-track file of known onset times — a one-hour experiment that should happen before anything else in the pipeline is trusted. Add EBU R128 loudness normalisation for ANALYSIS only, storing the applied gain so intensity is comparable across sessions.

### A measurement-reliability layer — ICC gating before any metric gets a UI

**Effort:** days

**Why it matters.** The plan has no validity stage, and this is the omission most likely to kill the product quietly rather than loudly. Robin et al. (2025, Alzheimer's & Dementia) measured test-retest reliability of speech metrics across repeated sessions at ICC 0.22-0.92, with only 7 of 10 measures clearing 0.5, and found averaging across administrations gives the highest reliability. (Honest caveat the original research misattributed: that study is 50 Dutch-speaking adults, mean age 68, doing picture description twice daily for 5 days — transfer to English adult monologue is unproven.) Cadence collects ONE 60-second sample per day on a DIFFERENT prompt, which stacks three variance sources — true change, prompt difficulty, and measurement noise — and F11 currently attributes all of it to the first. PRD R6 already flags this for MTLD specifically; the fix is to generalise it.

**How.** In M1, compute the ICC of every candidate metric across your 20 recordings and ship only those above a floor. This is a one-day job that could delete half of F5/F6/F7 before a UI exists, which is exactly what M1 is for. Then derive F11's session gate per-metric from its measured ICC rather than using 7 for everything, and either model prompt difficulty as a random effect or stratify prompts and never compare across strata — §7 F2 already knows prompts differ in difficulty (it weights toward explanation and opinion) but does not adjust for it.

### Do not run stock spaCy on the verbatim transcript — keep two views of one recording

**Effort:** days

**Why it matters.** F5's pause classification and F7's clause-length and subordination-depth metrics both rest on a spaCy dependency parse, and F4 hands that parse an unpunctuated, disfluent verbatim transcript. spaCy's English pipelines are trained on punctuated written text; disfluent spontaneous speech is a further domain shift on top. (The commonly-cited '7 UAS / 10 LAS' penalty for stripping punctuation has no source behind it — the fact-checker could not find it in the spaCy discussion it was attributed to — but the qualitative degradation is real and acknowledged by spaCy maintainers.) This makes your articulation metrics rest on the weakest link in the pipeline, which is exactly what R3 worries about.

**How.** Two views, one index space. Keep the verbatim transcript as the timing spine, and build a cleaned + punctuation-restored copy for parsing with an index map back to verbatim tokens so timestamps still resolve. This is the standard pipeline order in the literature and it is why structural disfluency detection is upstream infrastructure rather than a metric. Note PRD F4 lists punctuation restoration as 'NOT needed' — true for the ASR contract, false for the parser contract. Prefer prosodically-derived sentence boundaries over restored punctuation where you can, which is one more independent reason prosody belongs in P0.

### Type your filled pauses and measure their duration — but do not ship the um/uh severity claim

**Effort:** hours

**Why it matters.** Clark & Fox Tree (2002, Cognition 84:73-111) argued 'uh' and 'um' are conventional words announcing an expected MINOR and MAJOR delay respectively — a free, speaker-supplied severity label on every retrieval event. That would be perfect for Cadence. But O'Connell & Kowal (2005) acoustically measured the pauses following each and found most were followed by no pause at all, with the two duration distributions almost entirely overlapping, attributing the discrepancy to Clark & Fox Tree relying on coders' perceptions rather than acoustic measurement. So the free severity gradient is contested. What is NOT contested is that filled-pause DURATION is measurable and is probably a stronger signal than filled-pause count — a drawn-out 'uhhhh' is a longer retrieval attempt than a clipped 'uh'.

**How.** Keep um and uh as distinct tokens (Speechmatics tags both, CrisperWhisper distinguishes them; verify your chosen vendor does not normalise both to one spelling — Deepgram explicitly normalises to consistent spellings 'regardless of spoken duration'). Measure the filled pause's own start-to-end duration from the word timings. Validate any um:uh ratio on your own data before it reaches a user.

### Precision-of-word-reached norms instead of MTLD alone — and compute circumlocution internally even though the feature is cut

**Effort:** weeks

**Why it matters.** MTLD and MATTR measure VARIETY, and R6 already flags them as noisy at 60 seconds. Variety is not what G1 promises: 'thing', 'stuff' and 'good' are three distinct types and inflate diversity. Precision is directly measurable via psycholinguistic norms. Separately, PRD §3 cuts circumlocution as a non-goal — but circumlocution is the primary observable symptom of the retrieval-latency thesis, so cutting the MEASUREMENT (as opposed to the user-facing feature) leaves you validating the thesis only through proxies.

**How.** Mean Zipf of content words (falling = more precise), proportion of content words below Zipf 3.5, Kuperman AoA (~30k lemmas), Brysbaert concreteness (40k) and prevalence (62k — 'what proportion of people know this word', which separates rare from obscure better than raw frequency). All free supplementary downloads; cite the papers. Do NOT use TAALED for MTLD/MATTR — the fact-checker found it is CC-BY-NC-SA 4.0, non-commercial with a viral ShareAlike term; the algorithms are short enough to reimplement from their published definitions. For circumlocution, compute internally only: sliding-window sentence embeddings flagging spans with anomalously HIGH consecutive-window similarity (the inverse of the thought-disorder literature's derailment measure) AND low propositional idea density AND high-frequency content words. Idea density via `ideadensity` (CPIDR, `speech_mode=True`, GPL-2.0, spaCy 3.7.5+ — watch for a version pin conflict with your parser). This conjunction is a synthesis from adjacent literatures, not a validated detector; it needs its own hand-labelled set before it drives anything user-facing.

## Do this week

1. DAY 1, FIRST: fix the recording format before you measure anything. Switch expo-audio iOS to LINEARPCM / .wav / 16 kHz / mono / 16-bit. Then write a click-track WAV with onsets at known times, push it through your exact decode path, and confirm zero constant offset. This is the one experiment that invalidates every other measurement if you skip it. While you are there, reconcile PRD §9.1 — it claims 'consistent WAV PCM across platforms' while the recorder emits m4a.
1. DAY 1: build the ground-truth set. Record 20 of your own 60-second answers to real F2-style prompts, deliberately including several where you hesitate and circumlocute — you need the hard cases, not the clean ones. Hand-transcribe all 20 verbatim, including every um, false start and repetition. This is M0's real deliverable and it is reusable forever.
1. DAY 2: run MFA 3.4 over those 20 recordings on your laptop via the official `mmcauliffe/montreal-forced-aligner` Docker image, using your hand transcripts. That gives you reference word onsets at roughly 20 ms accuracy — your scoring oracle. Do not install MFA into the Railway image; it is an instrument, not a stage. Add `--use_cutoff_model` so truncated false starts get pronunciations.
1. DAY 2-3: run the M0 bake-off against that oracle. Four arms: Speechmatics Enhanced (defaults, `remove_disfluencies` unset), Deepgram Nova-3 (`filler_words=true`, `mip_opt_out=true`), ElevenLabs Scribe v2 (`no_verbatim` unset), and your current Gemini call as the control. Score THREE things separately and do not collapse them: (a) filler detection rate against your hand transcript; (b) false-start / repetition / self-correction survival, which you must hand-audit because NO vendor's disfluency flag governs these and no vendor documents the behaviour; (c) mean absolute word-onset error versus MFA. Normalise units first — AssemblyAI returns milliseconds while the other three return float seconds.
1. DAY 2, in parallel (these are emails, they cost nothing and take days to come back): (1) Ask Speechmatics IN WRITING whether they train on customer audio — their docs document 7-day retention thoroughly and are completely silent on training, and this is blocking for biometric data. Ask for the Enhanced batch rate while you are there. (2) Ask Nyra Health what a CrisperWhisper 2.0 commercial license costs — it is the best technical fit in the field and price is the only thing in the way. (3) Ask Rev AI for their self-serve retention and training terms if you are keeping the hybrid path alive.
1. DAY 3: sweep the pause threshold from 150 to 600 ms over the 20-recording set and pick it on data rather than adopting 400 by convention — the monologic-task literature points at 200 ms. Normalise the chosen threshold by each speaker's articulation rate using the de Jong & Wempe syllable-nuclei method in parselmouth (~100 lines), and add an upper cap so abandonment becomes its own event class.
1. DAY 3-4: compute ICC for every candidate F5/F6/F7 metric across the 20 recordings and cut anything below ~0.5 before M2 builds a UI around it. This is the cheapest possible way to discover that half your metrics cannot support a per-session number, and M1's stated purpose is exactly to invalidate metrics before a UI exists.
1. DAY 4: restructure the pipeline seam. Move Gemini from transcriber to analyst — it receives the timed verbatim transcript as TEXT plus computed gap statistics, and never receives audio. This is a §11 win as much as a quality one: raw voice stops going to a second vendor. Wire both Speechmatics and Deepgram behind the adapter interface F4 already mandates so the pick stays reversible.
1. DAY 5, if you have appetite: spend 30 minutes testing whether jamsch/expo-speech-recognition or @react-native-ai/apple actually returns usable iOS word timings before you ever consider writing a Swift Expo Module. And run five of your hesitant recordings through `yap --word-timestamps` on macOS 26 to settle, once and for all, whether Apple's model preserves disfluencies. Nobody has published this. It is one afternoon and it determines whether on-device is ever viable for you.

## Open questions

- THE BIG ONE: no vendor in the entire survey publishes a numeric word-timestamp accuracy figure (mean absolute onset error in ms), and none states whether its timings come from forced alignment or model estimation. This is unclosable by desk research, it is the single number the whole product rests on, and it is why the MFA oracle in step 2 is not optional.
- Whether false starts, repetitions and self-corrections survive at ANY vendor. Every disfluency flag in the industry — Deepgram's `filler_words`, AssemblyAI's `disfluencies`, Speechmatics' `remove_disfluencies`, Rev's `remove_disfluencies` — governs only the um/uh token class. Whether the other three categories survive depends on whether the model was trained on verbatim or cleaned references, and that is essentially undocumented industry-wide. Only ElevenLabs' docs name false starts; only AssemblyAI's prompt example names repetitions. This is the thing you must hand-audit and no amount of reading will substitute.
- Whether Speechmatics trains on customer audio. Their retention (7 days batch, delete-sooner API) and certifications (ISO 27001:2022, SOC 2 Type II, GDPR, HIPAA) are all documented. Training is not mentioned anywhere. For biometric voice data on an App Store app this is a genuine blocker on the primary recommendation, and it is one email.
- Whether Apple SpeechAnalyzer preserves disfluencies. Zero published evidence in either direction. Every WER figure for Apple's model is on LibriSpeech read speech, which contains no disfluencies by construction; even the April 2026 dicta.to benchmark, which explicitly tested disfluent speech with fillers and restarts across 13,023 samples, does not report filler preservation. All existing evidence is circumstantial. Cheap to resolve, still unresolved.
- GPU hosting is unsettled after 2026-07-31. Railway has never offered GPUs and Fly.io deprecates theirs on July 31 — six days from today. Every GPU-dependent option (CrisperWhisper, Canary-Qwen, Qwen3-ForcedAligner with its documented CUDA-only path) currently has no named deployment target and would need Modal, RunPod, Baseten or a cloud VM decided fresh. This is a live reason to prefer a hosted ASR right now, and it may resolve differently in three months.
- CrisperWhisper 2.0's commercial license price. Unpublished, negotiated. It is the highest-value unknown for the self-hosted path because everything else about the model checks out.
- Whether the 200 ms monologic threshold finding transfers. Gao, Sun & Li (2025) is L2 proficiency assessment; Cadence's primary user is a fluent native adult. Same caveat, more sharply, on the McGuire (2025) filler-detection rankings I used to separate Speechmatics from Deepgram — that study is entirely L2 speakers (L2-ARCTIC, 22 speakers, ~26 minutes of lab-quality audio), which is Cadence's SECONDARY user on a different recording setup.
- Whether the reliability figures transfer. The ICC 0.22-0.92 range comes from 50 Dutch-speaking adults, mean age 68, doing picture description — not English adult monologue on a phone. The argument for building a reliability layer survives; the specific numbers should not be quoted as if measured on your population.
- Whether the de Jong (2016) frequency effect holds within-subject at the granularity Cadence needs. The direction of the effect and the L1/L2 within-vs-between-utterance contrast are confirmed from the Utrecht repository abstract, but the full text was not retrievable, so effect sizes, the paper's own pause threshold, and the frequency norm it used are all unverified. Verify the primary source before hard-coding a residual model.
- Whether expo-audio's m4a carries correct packet-table priming info and which Python decode path (ffmpeg, soundfile, librosa, pydub) honours it. Testable in an hour with a click track, and moot if you switch to PCM as recommended.
- Whether MFA containerises cleanly enough to ever become a production stage on Railway. It is CPU-only, which is the right shape, but I found no report of a working slim Docker deployment. Only relevant if the bake-off says you need it.
- How the whole stack behaves on Python 3.12 in one container. spaCy version pinning across `ideadensity` (3.7.5+), your parser, and whatever else you add is a plausible dependency conflict nobody has tested for this combination.
- Everything here is a July 2026 snapshot. Hosted vendors ship model updates on a months-long cadence, and disfluency handling is precisely the behaviour that changes silently between model versions. Whatever you pick needs a regression test on your own 20 recordings, re-run every time the vendor announces a new model — build that into M1, not later.
