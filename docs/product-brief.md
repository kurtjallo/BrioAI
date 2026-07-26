# Product Brief

**Working title:** unnamed
**Date:** July 2026

---

## What this is

A daily speaking practice. You record yourself for one minute answering a prompt, and you get back an honest read on the two things that actually make people sound less capable than they are: the words they reach for, and the order they put them in.

One minute of speaking. Under five minutes door to door. Every day.

---

## The problem

A lot of people think more clearly than they speak.

They know the material. They've reasoned it through. And what comes out is vague, repetitive, and badly ordered — the point buried three sentences deep, the same six adjectives recycled, sentences that start over halfway through. Afterwards they replay the conversation and compose the version they wish they'd said.

Two things are broken here, and they're separable:

**Vocabulary.** Not how many words someone knows — how many they can *reach* mid-sentence. Most people's spoken register is far narrower than their written one. Under time pressure they fall back on a small set of vague placeholders: thing, stuff, good, bad, basically. The precise word exists in their head. It just doesn't arrive in time.

**Articulation.** The ordering problem. The point lands late or never. No signposting, so the listener can't tell where the answer is going. Sentences nest three clauses deep. The ending fades out instead of closing.

Both are visible in a transcript. Both improve with deliberate daily practice. Neither is what existing tools focus on.

---

## Why now, and why this angle

The category is crowded — Yoodli, Poised, Orai, Speeko, Wellspoken, VirtualSpeech, ELSA, Oratori, Articulated, and more. Roughly a dozen products, several funded, no breakout winner.

Every one of them leads with **delivery** metrics: pace, filler words, tone, eye contact, confidence. Word choice shows up as a minor feature in two products. Structure and organisation show up in none as a tracked, trending metric.

That's the opening. It's an opening of emphasis rather than of category — nobody is prevented from adding structure scoring, and a funded competitor could ship it in a sprint. This wins on execution and taste or it doesn't win. Worth saying out loud rather than pretending otherwise.

A second thing everyone gets wrong: benchmarking against population averages. Speaking rate varies enormously by person, accent, and background. "You speak at 145 words per minute, the average is 150" describes nobody. Every number in this product compares the user to their own history instead.

---

## Who it's for

**Primary.** Late twenties to forties. Knowledge worker. Fluent English, reads widely, writes well. Consistently feels their spoken self undersells them.

Where it hurts: standups, being put on the spot in a meeting, explaining their own work to someone senior, conversations where they trail off and let someone else pick up the thread.

**Secondary.** Fluent non-native English speakers with the same written-to-spoken gap. Don't design for them specifically, but don't break for them either.

**Not for.** People with clinical speech or language difficulties. People whose main barrier is anxiety rather than expression — that's a different intervention and this product won't help. Beginners in English.

---

## Principles

1. **Compare the person to themselves.** No population benchmarks, ever.
2. **One instruction per session.** Every metric is available. Only one thing is pushed.
3. **Production over recognition.** Vocabulary work means saying the word out loud. Never tapping a multiple choice.
4. **Natural over impressive.** A suggested word must pass unnoticed in a real conversation. Nobody should sound like they swallowed a thesaurus.
5. **Every observation traces to something they actually said.** No inference about intent. No scores without evidence.
6. **Under five minutes.** The moment a session runs long, the habit dies.

---

## The daily loop

This is the product. Everything else supports it.

| Step | Time | What happens |
|---|---|---|
| Notification | — | One push, at a time the user picks |
| Open → prompt | 5s | Today's prompt is already on screen. No menu, no mode select. |
| Record | **60s** | One take. Hard stop at sixty seconds. |
| Processing | 10–20s | Progress state |
| Results | 45s | Metrics, then one instruction |
| Word of the day | 30s | One word, spoken in a sentence, checked |
| Review | 45s | Up to three due words, spoken aloud |

**Typical: three minutes. Ceiling: five.**

**Rules that protect the budget.** Sixty seconds is a hard stop, not a suggestion — no "go long" mode. Word of the day and review are skippable with one tap, and skipping doesn't break the streak; only the recording counts as completing the day. Review is capped at three cards no matter how many are due.

**The minimum viable day is: open, record, close.** Someone who never does anything past the results screen is a successful user.

If median session time in production goes over four minutes, that's a bug, not a tradeoff.

---

## The prompts

One prompt per day, no repeats within two months.

Weighted heavily toward **explanation and opinion**, because that's where vocabulary and structure break down. Storytelling is easy — people have told their stories before. Explaining something unrehearsed is where the fumbling lives.

Good: *"Explain something from your work to someone outside your field."* / *"What's an opinion you hold that most people around you don't?"* / *"Describe how something you use every day actually works."*

Bad: *"Tell me about your weekend."*

---

## What gets measured, and why

### Delivery — shown, not emphasised

These are table stakes. Every competitor has them, they're easy to compute, and leaving them out would look like an omission. But they're not the product and they don't get the headline.

| Metric | What it means |
|---|---|
| Filler rate | Fillers per hundred words. The category's vanity metric. Present, de-emphasised. |
| Pace | Words per minute as a curve across the minute, not a single average — where you sped up matters more than the mean. |
| Pauses | Gaps over 400ms, split into *searching* (before a content word — you were hunting) and *rhetorical* (after a clause — you were landing a point). **The ratio between them is the interesting number.** Same silence, opposite meanings. |
| Hedging | "Sort of", "I guess", "kind of". Undercuts everything around it. |

### Vocabulary — core

| Metric | What it means |
|---|---|
| Lexical diversity | How wide a range of words you drew on. Measured with length-robust methods, because the naive version drops mechanically as recordings get longer and would make sessions incomparable. |
| Vague-word density | How often you reached for thing, stuff, good, bad, basically. The clearest single signal of the problem this product exists to fix. |
| Repetition | Content words used three or more times. Excludes the topic itself — repeating what you're talking about isn't a flaw. |
| **Word upgrades** | Two or three words you actually said, with a more precise alternative, shown in your original sentence. |

**Word upgrades are the feature people will talk about.** They're also the one that can embarrass us. A suggestion that's wrong, or that's technically right but absurdly formal, costs more trust than five missed opportunities earn.

So there's a hard rule: suggestions are filtered by word frequency before they're shown. Anything too rare for ordinary speech gets dropped, and anything too far from the user's own register gets dropped. If that leaves one suggestion, we show one. If it leaves none, we show none — that's a correct outcome, not a failure.

### Articulation — core

| Metric | What it means |
|---|---|
| **Point placement** | Which sentence carried your main claim, as a position through the answer. Burying the point is the most common articulation failure and almost nobody notices they do it. |
| Signposting | Did you tell the listener where you were going? "Three reasons", "the key thing is", "first… second…". A minute of speech with no signposts is a finding. |
| Sentence complexity | Average sentence length and how deeply clauses nest. Three levels down is hard to follow no matter how correct it is. |
| Ending | Clean close, fade, or abrupt stop. Trailing off is extremely common and almost invisible to the speaker. |

**Every judgment cites its evidence.** Point placement doesn't return a score, it returns a sentence: *"Your point arrived here — 'so the real issue is the handoff between teams'."* A number with nothing behind it is unverifiable, and the first time it's wrong the user stops trusting all of it.

---

## Vocabulary building

Two sources feed one system.

**Word of the day.** One word, with a definition and an example. The user says a sentence using it, out loud, and we check they actually did. Built as a card you swipe past, this teaches recognition — and recognition doesn't transfer to speech. Production is the whole point.

Word selection prefers, in order: something already in your list that's due for review; something adjacent to what you actually talk about, drawn from your own transcript history; a general fallback for new users.

The curated bank only contains words that pass one test: *could a well-read person say this in a meeting without anyone noticing?* If not, it's out.

**Accepted word upgrades** — words surfaced from your own speech — join the same list.

**Review** works on spaced repetition, and every review is spoken. Difficulty is inferred from how long you took to produce the word, so the user never has to rate themselves.

**Kill criterion:** if words learned this way never show up unprompted in later spontaneous recordings, the feature doesn't work and gets cut. That measurement is the honest test and no competitor reports it.

---

## The results screen

Ordered by what should change behaviour, not by what's easiest to display.

1. **The instruction.** One sentence, large, at the top. *"Your point arrived in sentence five — try leading with it."* Not a summary. Not encouragement. One thing to do differently tomorrow.
2. **Word upgrades.** Each shown inside your original sentence, so the improvement is visible in context.
3. **Structure.** Where your point landed, quoted. Signposts you used or didn't. How you ended.
4. **Vocabulary.** Diversity against your own baseline. Vague words that fired. Words you repeated.
5. **Delivery.** Pace curve, pause split, filler count. Present, small, at the bottom.
6. **Transcript.** Full text, word-aligned to the audio, with fillers and vague words highlighted.

Comparisons against baseline only appear after seven sessions. Before that, absolute numbers with no commentary — a trend line drawn through three points is a lie.

---

## Other surfaces

**History.** Every session, playable, with its transcript. The archive is the retention mechanic: hearing yourself from thirty days ago is the moment the product justifies itself. Surface it early.

**Trends.** One metric at a time over thirty or ninety days, with the baseline band behind it. Never a dashboard of nine sparklines.

**Word list.** Every word learned, where it came from, and whether it's stuck.

---

## The stack

- **Mobile app:** Expo / React Native. The daily habit needs push notifications and reliable background audio, and iOS web apps have neither.
- **Backend:** FastAPI. Python, because every library the analysis needs — parsing, diversity measures, word frequency, spaced repetition, and later prosody — lives there.
- **Jobs:** Celery with Redis.
- **Database:** Postgres.
- **Audio storage:** Cloudflare R2. No egress charges, and replaying old recordings is the retention mechanic — it shouldn't cost anything.
- **Transcription:** Deepgram to start. Must return verbatim output with word-level timing; every provider strips filler words by default and they have to be explicitly requested.
- **Language model:** Claude, for word upgrades, structure assessment, and the instruction.
- **Also:** spaCy for parsing, and open-source libraries for diversity measures, word frequency, and spaced repetition scheduling.

Transcription, parsing, and the language model are all expected to change. They sit behind our own interfaces so swapping one is a configuration change.

Cost is roughly twenty cents per user per month. It is not a constraint at this scale, and vendors should be chosen on output quality, not price.

---

## What success looks like

**The number that decides everything: day-4 retention.** Of the people who record once, how many record again on day four. If that's bad, nothing else matters.

Supporting:

- Median session duration — must stay under four minutes
- Time to first recording — under ninety seconds from opening the app
- **Unprompted reuse** — do words learned here show up in later spontaneous recordings? This is the real outcome measure, and nothing in the category reports it.
- Diversity and point-placement trends — are people actually getting better?
- Word upgrade acceptance rate — a proxy for suggestion quality

**Explicitly not a goal:** reducing filler words. That's the metric everyone optimises and it isn't the problem being solved.

---

## Out of scope

**Not in v1:** video of any kind. Real-time feedback during recording. Live coaching in actual meetings. Pronunciation or accent work. Mock interviews or roleplay. Team or enterprise features. Payments. Social features, leaderboards, or sharing. Multiple practice modes. Any second language.

**Not ever, most likely:** anything that requires more than five minutes a day.

**Later, in this order:**
1. Prosody — pitch and volume contours, to detect uptalk and trailing off with acoustic evidence rather than inference
2. Instant feedback the moment recording stops
3. Themed vocabulary tracks
4. A monthly video checkpoint — daily audio, once a month on camera to watch back. Frequent low-stakes reps, occasional high-fidelity review. Keeps daily friction at zero.
5. Analysis of real meetings rather than prompts. Highest value on this list, blocked on recording-consent law, which varies by jurisdiction and needs actual legal advice.

**A note on video.** Audio metrics are defensible because they're counts — sentence length and vague-word density are facts. Visual "presence" isn't. What reads as confident posture is culturally specific and the research behind it is weak. If video ever ships, it shows observations — how often your gaze left the camera — not judgments like a confidence score.

---

## Risks worth stating

**Differentiation is thin.** Emphasis, not a moat. Yoodli already touches word choice.

**The transfer assumption is unproven.** Spaced production should make words retrievable. Whether that generalises to unrehearsed conversation is a hypothesis, and the unprompted-reuse metric is how we find out.

**Structure scoring might not hold up.** "Where is the main point" is a judgment a model will answer confidently whether or not it's right. Requiring citations makes it checkable — but it has to actually be checked, by hand, before shipping.

**Physical context is a real constraint.** Speaking aloud alone for a minute requires privacy. Unlike every successful mobile habit, this can't be done on a commute, in an open office, or in bed next to someone. That structurally limits how many moments in a day the habit can fire, and no amount of product quality fixes it. It applies to every competitor too, which may be part of why none of them has broken out.

**Distribution is harder than engineering.** A dozen competitors, several funded, fighting over the same search terms. Three of the "best speech app" comparison articles in the wild are published by competitors ranking themselves.

---

## Open questions

1. Are diversity measures stable enough on sixty seconds of speech to show per-session, or only weekly?
2. Does structure scoring survive manual spot-checking?
3. Is sixty seconds enough speech to assess structure at all?
4. What shape does the free tier take?
5. What's it called?