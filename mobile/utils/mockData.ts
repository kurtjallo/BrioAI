import { Analysis, Session } from '@/types';
import { PROMPTS } from './prompts';

/**
 * Realistic sample content for previewing every screen state.
 * The transcripts are deliberately disfluent spoken English, not prose.
 */

// ~140 words, real disfluencies: "um", a false start, a restarted sentence, vague words.
const MAIN_TRANSCRIPT =
  'So the, um, the main thing about our onboarding project is that it was taking way too long. ' +
  'New hires were waiting, um, sometimes two weeks before they could do anything real. ' +
  'And the process was — well, honestly, the process was bad. ' +
  'We had stuff spread across five different documents and nobody knew which one was current. ' +
  'So what we did first — sorry, what I did first — was just sit with three new starters and watch where they got stuck. ' +
  'That was kind of eye-opening. Most of the waiting was on access requests, things like accounts and permissions, ' +
  'which nobody actually owned. So we made one checklist, gave it a single owner, and got the wait down to about three days. ' +
  'The, um, the thing I would say is: watch people before you redesign anything.';

const ZERO_UPGRADE_TRANSCRIPT =
  'The best team I ever worked on was small, just five of us, and, um, we shipped a reporting tool in about four months. ' +
  'What made it work was that everyone knew who decided what. There was no ambiguity. ' +
  'When we disagreed — and we disagreed a lot — we would time-box the argument to twenty minutes and then the owner decided. ' +
  'I remember one week where we cut half the feature list, which felt brutal at the time, but it meant the core product actually worked. ' +
  'Um, the other thing was that we demoed every Friday, even when the demo was embarrassing. ' +
  'Especially when it was embarrassing, honestly. That habit kept us honest about progress. ' +
  'If I could recreate one thing from that team, it would be the Friday demos.';

const MAIN_ANALYSIS: Analysis = {
  instruction: 'Your point arrived in sentence seven — try leading with it.',
  wordUpgrades: [
    {
      original: 'bad',
      originalSentence: 'And the process was — well, honestly, the process was bad.',
      suggestion: 'inefficient',
      improvedSentence: 'And honestly, the process was inefficient.',
    },
    {
      original: 'stuff',
      originalSentence: 'We had stuff spread across five different documents.',
      suggestion: 'information',
      improvedSentence: 'We had information spread across five different documents.',
    },
    {
      original: 'got the wait down',
      originalSentence: 'We made one checklist, gave it a single owner, and got the wait down to about three days.',
      suggestion: 'cut the wait',
      improvedSentence: 'We made one checklist, gave it a single owner, and cut the wait to three days.',
    },
  ],
  structure: {
    pointPlacement: {
      sentence: 'Most of the waiting was on access requests, things like accounts and permissions, which nobody actually owned.',
      position: 7,
      total: 10,
    },
    signposting: ['what we did first', 'the thing I would say is'],
    sentenceComplexity: 'moderate',
    ending: 'clean',
  },
  vocabulary: {
    lexicalDiversity: 0.58,
    vagueWordDensity: 0.05,
    vagueWords: ['stuff', 'things', 'kind of'],
    repetitions: [
      { word: 'process', count: 3 },
      { word: 'waiting', count: 2 },
    ],
  },
  delivery: {
    fillerRate: 3.4,
    wordCount: 142,
    estimatedPace: 148,
  },
};

const ZERO_UPGRADE_ANALYSIS: Analysis = {
  instruction: 'Strong word choice throughout — next time try naming your conclusion in the first sentence.',
  wordUpgrades: [],
  structure: {
    pointPlacement: {
      sentence: 'What made it work was that everyone knew who decided what.',
      position: 3,
      total: 9,
    },
    signposting: ['the other thing was'],
    sentenceComplexity: 'moderate',
    ending: 'clean',
  },
  vocabulary: {
    lexicalDiversity: 0.66,
    vagueWordDensity: 0.02,
    vagueWords: ['thing'],
    repetitions: [{ word: 'embarrassing', count: 2 }],
  },
  delivery: {
    fillerRate: 1.9,
    wordCount: 138,
    estimatedPace: 141,
  },
};

const FILLER_TRANSCRIPTS = [
  'Um, so compound interest is basically interest on interest. If you, uh, put a hundred dollars in and earn ten percent, next year you earn interest on a hundred and ten, not just the original hundred. People underestimate it because the early years look boring — the curve is flat for ages and then, um, it really takes off. The mistake I made for years was waiting for a good time to start, which, uh, there never is one.',
  'A good meeting has a decision at the end of it. That is, um, that is basically my whole theory. Bad meetings are status updates that could have been an email, or, uh, debates where nobody owns the outcome. The best chair I ever saw would open with the question we were there to answer, literally write it at the top, and, um, close by reading out who was doing what.',
  'The skill I think is underrated is writing short. Anyone can write long — long is easy, you just, um, you just keep typing. Short means you actually decided what mattered. When I review documents at work the best ones are, uh, a page, and the writer clearly threw away three pages to get there. I try to do the same in speech but honestly it is much harder out loud.',
];

const INSTRUCTIONS = [
  'You said "basically" four times — pick one sentence tomorrow and cut it.',
  'Your ending trailed off — try closing with your first sentence restated.',
  'Good signposting. Now try pausing instead of saying "um" when you switch points.',
  'Your point landed early — nice. Work on cutting the last two sentences.',
  'Try answering the question in your first breath, then explaining.',
  'You repeated "really" five times — swap two of them for a pause.',
  'Strong middle, soft open — spend your first sentence on the conclusion.',
];

/** Small deterministic PRNG so the sample history is stable across seeds. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds ~15 sessions spread over the past three weeks with noisy, varied
 * metrics (including a couple of regressions) so trend charts draw
 * something real rather than a smooth upward line.
 */
export function buildSampleSessions(): Session[] {
  const rand = mulberry32(20260725);
  const sessions: Session[] = [];
  const now = new Date();

  // Day offsets, newest first, with gaps (missed days).
  const dayOffsets = [1, 2, 3, 5, 6, 7, 8, 10, 11, 13, 14, 16, 17, 19, 21];

  dayOffsets.forEach((offset, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - offset);
    date.setHours(8 + Math.floor(rand() * 12), Math.floor(rand() * 60), 0, 0);

    // Noisy trend: mild improvement over time (older = worse) with jitter and dips.
    const progress = 1 - offset / 21; // 0 old → 1 recent
    const jitter = () => (rand() - 0.5) * 2;
    const diversity = clamp(0.42 + progress * 0.12 + jitter() * 0.07, 0.3, 0.72);
    const vague = clamp(0.11 - progress * 0.04 + jitter() * 0.035, 0.01, 0.16);
    const filler = clamp(6.2 - progress * 2.2 + jitter() * 1.6, 0.8, 8.5);
    const wordCount = Math.round(110 + rand() * 60);
    const duration = Math.round(42 + rand() * 18);

    const transcript = FILLER_TRANSCRIPTS[i % FILLER_TRANSCRIPTS.length];
    const total = 7 + Math.floor(rand() * 5);
    const position = 1 + Math.floor(rand() * total);

    let analysis: Analysis;
    if (i === 0) {
      analysis = MAIN_ANALYSIS;
    } else if (i === 3) {
      analysis = ZERO_UPGRADE_ANALYSIS;
    } else {
      analysis = {
        instruction: INSTRUCTIONS[i % INSTRUCTIONS.length],
        wordUpgrades:
          rand() > 0.4
            ? [
                {
                  original: 'good',
                  originalSentence: 'I thought the result was pretty good overall.',
                  suggestion: 'convincing',
                  improvedSentence: 'I thought the result was convincing overall.',
                },
                {
                  original: 'a lot of',
                  originalSentence: 'There were a lot of problems with the first version.',
                  suggestion: 'several',
                  improvedSentence: 'There were several problems with the first version.',
                },
              ]
            : [
                {
                  original: 'big',
                  originalSentence: 'It was a big change for the team.',
                  suggestion: 'significant',
                  improvedSentence: 'It was a significant change for the team.',
                },
              ],
        structure: {
          pointPlacement: {
            sentence: 'The short version is that we should have started smaller.',
            position,
            total,
          },
          signposting: rand() > 0.5 ? ['the key point is'] : [],
          sentenceComplexity: rand() > 0.6 ? 'complex' : rand() > 0.3 ? 'moderate' : 'simple',
          ending: rand() > 0.6 ? 'clean' : rand() > 0.3 ? 'fade' : 'abrupt',
        },
        vocabulary: {
          lexicalDiversity: round2(diversity),
          vagueWordDensity: round2(vague),
          vagueWords: rand() > 0.5 ? ['stuff', 'really'] : ['basically', 'things', 'kind of'],
          repetitions: rand() > 0.5 ? [{ word: 'really', count: 3 }] : [{ word: 'basically', count: 4 }],
        },
        delivery: {
          fillerRate: Math.round(filler * 10) / 10,
          wordCount,
          estimatedPace: Math.round((wordCount / duration) * 60),
        },
      };
    }

    sessions.push({
      id: `sample_${offset}_${i}`,
      date: date.toISOString(),
      prompt: PROMPTS[(i * 7) % PROMPTS.length],
      audioUri: '',
      transcript: i === 3 ? ZERO_UPGRADE_TRANSCRIPT : transcript,
      analysis,
      duration,
    });
  });

  return sessions; // already newest-first
}

/** A single realistic first session — used for the simulated onboarding recording on web. */
export function buildFirstSession(prompt: string): Session {
  return {
    id: `first_${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    prompt,
    audioUri: '',
    transcript: MAIN_TRANSCRIPT,
    analysis: MAIN_ANALYSIS,
    duration: 58,
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function round2(v: number) {
  return Math.round(v * 100) / 100;
}
