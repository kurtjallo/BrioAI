Onboarding

1. The frame. Two lines: what this is, and why it isn't another filler-word counter. One button forward. No carousel, no illustrations of confident people presenting.

2. "Where does this bite you most?" Four options — meetings, presentations, interviews, everyday conversation. Single tap advances, no separate continue button. The answer selects the first prompt.

3. Record. The prompt in large text, a record button, nothing else. Request microphone permission when they tap record, never before.

4. Processing. Not a spinner. Rotate three short lines explaining what's being analysed — what we look for in word choice, what "where your point landed" means, why filler count is the least interesting part. First session only; plain progress afterwards.

5. First result. The results screen, minus anything comparative.

6. "When are you somewhere you can talk out loud?" Time picker, then the notification permission request. Keep that phrasing — it's making them think about where they can actually speak, not about reminder preferences.

7. Save. A placeholder screen for account creation. Since there's no auth, make it a single continue button. Just reserve the position in the flow.

Daily loop

Today. The prompt in large text, a record button, and nothing else. This is the home screen. No menu, no mode selector, no dashboard.

Recording. Live countdown, visible waveform, hard stop at sixty seconds. One retake allowed.

Processing. Plain progress, roughly fifteen seconds simulated.

Results. Detailed below — this is the most important screen in the app.

Word of the day. One word, a short definition, one example sentence, and a record button to say it in a sentence. Skippable with one tap.

Review. Up to three cards. Each shows a sentence with the word missing and a record button. Skippable.

Everything else

History. Reverse-chronological list of sessions. Tap to open a detail view with the transcript and playback.

Session detail. Full transcript, word-aligned to audio if feasible, otherwise plain text. Fillers and vague words highlighted inline. Play button.

Trends. One metric at a time with a picker to switch between them. Thirty and ninety day views. A baseline band behind the line. Never a dashboard of multiple charts.

Word list. Every word learned, where it came from, and whether it's stuck.

Settings. Notification time, and a placeholder for account and data deletion.

The results screen

Ordered by what should change behaviour, not by what's easiest to display.

The instruction. One sentence, large, at the top. "Your point arrived in sentence five — try leading with it." Not a summary, not encouragement.
Word upgrades. Two or three words they said with a better alternative, each shown inside the original sentence so the improvement is visible in context.
Structure. Where the point landed, with that sentence quoted. Signposts used or not. How the answer ended.
Vocabulary. Diversity against baseline, vague words that fired, words repeated.
Delivery. Pace curve, pause split, filler count. Present but small, at the bottom — this is the part every competitor leads with and we deliberately don't.
Transcript. Expandable, with fillers and vague words highlighted.
States every screen needs

Build all of these. They're where interfaces actually break.

Loading — real, since the mock functions are delayed
Empty — no history, no words due, fewer than seven sessions so no baseline
Error — recording failed, permission denied
Populated — the normal case

The empty states matter more than usual here. For the first week the user has no baseline and no archive, so the app is at its weakest exactly when they're deciding whether to keep it. Do not show greyed-out charts or "no data yet" placeholders — those read as broken. Show what exists and add one quiet line saying comparisons unlock after a week.

Mock data

Write realistic sample content. Placeholder text will make the design look fine when it isn't.

The transcript should be a genuine sixty seconds of spoken English with real disfluencies — "um", false starts, a sentence that restarts, a couple of vague words. Around 130–150 words. Not clean written prose.

Word upgrades should be plausible: someone said "the process was bad", suggestion is "inefficient". Not exotic vocabulary — words a normal person would say in a meeting.

Include a session with nothing to suggest. Sometimes there are no good upgrades, and the screen has to handle that gracefully rather than showing an empty section.

History should have around fifteen sessions with varying metrics so the trend charts have something real to draw, including some noise. A line that goes smoothly up and to the right will hide layout problems.

Permission denial needs its own mock state so I can see that screen without revoking permissions on my device.