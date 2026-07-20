export type PracticeMode = "practice" | "learning" | "custom" | "exam" | "words" | "paragraphs" | "quotes" | "numbers" | "punctuation";
export type PracticeLanguage = "en" | "hi";

export type PracticeDifficulty = "easy" | "medium" | "hard";
export type PracticeCategory = "general" | "technology" | "education" | "government_exams" | "daily_life";

export interface PracticeConfig {
  mode: PracticeMode;
  language: PracticeLanguage;
  length?: number; // E.g. number of words, or time limit
  customText?: string;
  includePunctuation?: boolean;
  includeNumbers?: boolean;
  
  // Existing options for words/paragraphs
  difficulty?: PracticeDifficulty;
  category?: PracticeCategory;
  paragraphLength?: "short" | "medium" | "long";

  // New options for quotes, numbers, punctuation
  quoteCategory?: "motivational" | "technology" | "history" | "science" | "education";
  numberType?: "integers" | "decimals" | "currency" | "phone_numbers" | "mixed";
  punctuationType?: "basic" | "advanced" | "mixed";

  // New option for learning mode
  learningTopic?: string;
  
  // Fields for Exam Mode
  examId?: string;
  examType?: "practice" | "mock";
  examSetId?: string;
}

export interface PracticeContent {
  id: string; // unique ID for caching/reference
  text: string;
  language: PracticeLanguage;
  metadata?: {
    author?: string;
    category?: string;
    source?: string;
  };
}

export interface WordsDataset {
  easy: string[];
  medium: string[];
  hard: string[];
}

export interface ParagraphItem {
  text: string;
  length: "short" | "medium" | "long";
}

export type ParagraphsDataset = Record<string, ParagraphItem[]>;

export interface QuoteItem {
  text: string;
  author: string;
  source: string;
}

export type QuotesDataset = Record<string, QuoteItem[]>;

export interface LearningContentItem {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  suitableTimers: number[];
  estimatedWords: number;
  estimatedReadingTime: number; // in seconds
  title: string;
  text: string;
  keywords: string[];
}

export interface LearningDataset {
  topic: string;
  items: LearningContentItem[];
}

export interface PracticeContentItem {
  id: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  suitableTimers: number[];
  estimatedWords: number;
  estimatedReadingTime: number;
  title: string;
  text: string;
  keywords: string[];
}

export interface PracticeDataset {
  topic: string;
  items: PracticeContentItem[];
}

export interface ExamContentItem {
  id: string;
  examId: string;
  examType: "practice" | "mock";
  examSetId: string;
  duration: number;
  targetSpeed: number;
  title: string;
  text: string;
}

export interface ExamDataset {
  examId: string;
  items: ExamContentItem[];
}

export interface PracticeProvider {
  /** Returns the mode string this provider supports (e.g. "words") */
  getModeId(): PracticeMode;
  /** Generates practice content based on the config */
  generate(config: PracticeConfig): Promise<PracticeContent>;
}
