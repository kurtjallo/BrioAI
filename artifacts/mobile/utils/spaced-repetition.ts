// SM-2 Spaced Repetition Algorithm
// quality: 0–5 (5 = perfect, 3 = correct with effort, <3 = failure)

export interface ReviewResult {
  nextReview: Date;
  interval: number;
  easeFactor: number;
  repetitions: number;
}

export function calculateNextReview(
  interval: number,
  repetitions: number,
  easeFactor: number,
  quality: number // 0–5
): ReviewResult {
  // Update ease factor
  let newEaseFactor = easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    // Failed — restart repetitions
    newInterval = 1;
    newRepetitions = 0;
  } else {
    newRepetitions = repetitions + 1;
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  nextReview.setHours(0, 0, 0, 0);

  return {
    nextReview,
    interval: newInterval,
    easeFactor: newEaseFactor,
    repetitions: newRepetitions,
  };
}

// Infer quality from response time (ms)
export function qualityFromResponseTime(ms: number): number {
  if (ms < 2000) return 5;
  if (ms < 4000) return 4;
  if (ms < 7000) return 3;
  if (ms < 12000) return 2;
  return 1;
}

// Check if a word is due for review
export function isDue(nextReview: string): boolean {
  return new Date(nextReview) <= new Date();
}
