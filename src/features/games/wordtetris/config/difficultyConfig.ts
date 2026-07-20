export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyConfig {
  id: DifficultyLevel;
  maxActiveWords: number;
  wordLengthMin: number;
  wordLengthMax: number;
  baseFallSpeed: number; // Pixels per second at level 1
  speedMultiplierPerLevel: number; // Speed increase per level
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    maxActiveWords: 4,
    wordLengthMin: 3,
    wordLengthMax: 5,
    baseFallSpeed: 30,
    speedMultiplierPerLevel: 1.05, // 5% faster each level
  },
  medium: {
    id: 'medium',
    maxActiveWords: 6,
    wordLengthMin: 5,
    wordLengthMax: 8,
    baseFallSpeed: 40,
    speedMultiplierPerLevel: 1.08,
  },
  hard: {
    id: 'hard',
    maxActiveWords: 9,
    wordLengthMin: 8,
    wordLengthMax: 12,
    baseFallSpeed: 50,
    speedMultiplierPerLevel: 1.1,
  },
  expert: {
    id: 'expert',
    maxActiveWords: 12,
    wordLengthMin: 12,
    wordLengthMax: 20,
    baseFallSpeed: 60,
    speedMultiplierPerLevel: 1.15,
  }
};
