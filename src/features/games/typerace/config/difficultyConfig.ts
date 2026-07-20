export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  aiSpeedMultiplier: number;
  wordLengthMin: number;
  wordLengthMax: number;
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    aiSpeedMultiplier: 0.8,
    wordLengthMin: 3,
    wordLengthMax: 5,
  },
  medium: {
    id: 'medium',
    aiSpeedMultiplier: 1.0,
    wordLengthMin: 5,
    wordLengthMax: 8,
  },
  hard: {
    id: 'hard',
    aiSpeedMultiplier: 1.2,
    wordLengthMin: 8,
    wordLengthMax: 12,
  }
};
