export type Category = 'Daily Use' | 'Advanced' | 'Travel' | 'Business' | 'Academic';

export interface ExampleSentence {
  english: string;
  bangla: string;
}

export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrase';
  banglaMeaning: string;
  category: Category;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  visualIcon: string;
  themeColor: string;
  examples: [ExampleSentence, ExampleSentence];
  distractors: string[]; // 3 wrong Bangla meanings for quiz
}

export interface QuizState {
  questionWordId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
  isAnswered: boolean;
}

export type ViewMode = 'cards' | 'quiz' | 'bookmarks' | 'flashcards';
