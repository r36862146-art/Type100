import { TypingConfig, TypingStatistics } from "../types"

/**
 * Standard industry defaults for typing time modes (in seconds).
 */
export const DEFAULT_TIME_LIMITS = [15, 30, 60, 120] as const

/**
 * Standard industry defaults for typing word modes.
 */
export const DEFAULT_WORD_LIMITS = [10, 25, 50, 100] as const

/**
 * Baseline configuration for a brand new typing session.
 */
export const DEFAULT_TYPING_CONFIG: TypingConfig = {
  mode: "time",
  language: "english",
  timeLimit: 30,
  allowCrossWordBackspace: true,
  strictMode: false,
}

/**
 * Empty/zeroed statistics for a fresh session.
 */
export const INITIAL_TYPING_STATISTICS: TypingStatistics = {
  elapsedTime: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  accuracy: 100,
  progress: 0,
  wordsCompleted: 0,
  remainingTime: 0,
  totalKeystrokes: 0,
  backspaces: 0,
}
