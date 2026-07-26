import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { WordEntry } from '@/types';
import { getWords, saveWords } from '@/utils/storage';
import { getTodaysWord, WORD_BANK } from '@/utils/words';
import { calculateNextReview, isDue, qualityFromResponseTime } from '@/utils/spaced-repetition';

interface WordContextType {
  userWords: WordEntry[];
  todaysWord: WordEntry | null;
  dueForReview: WordEntry[];
  markPracticed: (wordId: string, responseTimeMs: number) => Promise<void>;
  addWordFromUpgrade: (word: string, definition: string, example: string) => Promise<void>;
}

const WordContext = createContext<WordContextType>({
  userWords: [],
  todaysWord: null,
  dueForReview: [],
  markPracticed: async () => {},
  addWordFromUpgrade: async () => {},
});

export function WordProvider({ children }: { children: React.ReactNode }) {
  const [userWords, setUserWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    getWords().then(stored => {
      setUserWords(stored);
    });
  }, []);

  // Today's word of the day — prefer a due word, else pick from bank by day
  const todaysWord: WordEntry | null = (() => {
    const bankWord = getTodaysWord();
    const existing = userWords.find(w => w.id === bankWord.id);
    if (existing) return existing;
    // Return as a "new" word not yet in user list
    return {
      ...bankWord,
      source: 'daily' as const,
      addedDate: new Date().toISOString(),
      nextReview: new Date().toISOString(),
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
    };
  })();

  // Up to 3 words due for review (repetitions > 0 so already practiced once)
  const dueForReview = userWords
    .filter(w => w.repetitions > 0 && isDue(w.nextReview))
    .slice(0, 3);

  const markPracticed = useCallback(
    async (wordId: string, responseTimeMs: number) => {
      const quality = qualityFromResponseTime(responseTimeMs);
      const updatedWords = [...userWords];
      const idx = updatedWords.findIndex(w => w.id === wordId);

      if (idx >= 0) {
        const w = updatedWords[idx];
        const result = calculateNextReview(w.interval, w.repetitions, w.easeFactor, quality);
        updatedWords[idx] = {
          ...w,
          nextReview: result.nextReview.toISOString(),
          interval: result.interval,
          repetitions: result.repetitions,
          easeFactor: result.easeFactor,
        };
      } else {
        // First time practicing this word — add to user list
        const bankWord = WORD_BANK.find(w => w.id === wordId);
        if (bankWord) {
          const result = calculateNextReview(1, 0, 2.5, quality);
          updatedWords.push({
            ...bankWord,
            source: 'daily',
            addedDate: new Date().toISOString(),
            nextReview: result.nextReview.toISOString(),
            interval: result.interval,
            repetitions: result.repetitions,
            easeFactor: result.easeFactor,
          });
        }
      }

      await saveWords(updatedWords);
      setUserWords(updatedWords);
    },
    [userWords],
  );

  const addWordFromUpgrade = useCallback(
    async (word: string, definition: string, example: string) => {
      const id = `upgrade_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const newWord: WordEntry = {
        id,
        word,
        definition,
        example,
        source: 'upgrade',
        addedDate: new Date().toISOString(),
        nextReview: new Date().toISOString(),
        interval: 1,
        repetitions: 0,
        easeFactor: 2.5,
      };
      const updated = [...userWords, newWord];
      await saveWords(updated);
      setUserWords(updated);
    },
    [userWords],
  );

  return (
    <WordContext.Provider value={{ userWords, todaysWord, dueForReview, markPracticed, addWordFromUpgrade }}>
      {children}
    </WordContext.Provider>
  );
}

export const useWords = () => useContext(WordContext);
