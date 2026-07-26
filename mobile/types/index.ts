export interface WordUpgrade {
  original: string;
  originalSentence: string;
  suggestion: string;
  improvedSentence: string;
}

export interface StructureAnalysis {
  pointPlacement: {
    sentence: string;
    position: number;
    total: number;
  };
  signposting: string[];
  sentenceComplexity: 'simple' | 'moderate' | 'complex';
  ending: 'clean' | 'fade' | 'abrupt';
}

export interface VocabularyAnalysis {
  lexicalDiversity: number;
  vagueWordDensity: number;
  vagueWords: string[];
  repetitions: { word: string; count: number }[];
}

export interface DeliveryAnalysis {
  fillerRate: number;
  wordCount: number;
  estimatedPace: number;
}

export interface Analysis {
  instruction: string;
  wordUpgrades: WordUpgrade[];
  structure: StructureAnalysis;
  vocabulary: VocabularyAnalysis;
  delivery: DeliveryAnalysis;
}

export interface Session {
  id: string;
  date: string; // ISO string
  prompt: string;
  audioUri: string;
  transcript: string;
  analysis: Analysis;
  duration: number; // seconds
}

export interface WordEntry {
  id: string;
  word: string;
  definition: string;
  example: string;
  source: 'daily' | 'upgrade';
  addedDate: string;
  nextReview: string;
  interval: number; // days
  repetitions: number;
  easeFactor: number; // SM-2
}
