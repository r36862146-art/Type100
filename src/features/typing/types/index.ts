/**
 * Represents the current status of the typing session.
 * - `idle`: The user has not started typing yet.
 * - `running`: The user is actively typing and the timer/metrics are running.
 * - `finished`: The test is complete and results are locked.
 */
export type SessionStatus = "idle" | "running" | "finished"

/**
 * Represents the exact state of an individual character in the engine.
 * - `idle`: Not yet typed or reached.
 * - `current`: The cursor is currently waiting on this character.
 * - `correct`: The user typed this character correctly.
 * - `incorrect`: The user typed an incorrect character in this position.
 * - `extra`: The user typed extra characters beyond the expected word length.
 * - `missed`: The user skipped this character (e.g., pressed space early).
 */
export type CharacterState = "idle" | "current" | "correct" | "incorrect" | "extra" | "missed"

/**
 * The atomic unit of the typing engine. Represents a single keystroke target.
 */
export interface Character {
  /** Unique deterministic ID (e.g., \`word_0_char_2\`) for stable React rendering */
  id: string
  /** The actual string value of the character (e.g., 'a', 'B', ',', ' ') */
  value: string
  /** The current validation state of this character */
  state: CharacterState
  /** The index of the word this character belongs to */
  wordIndex: number
  /** The index of this character within its parent word */
  charIndex: number
}

/**
 * Represents a group of contiguous characters (a word).
 */
export interface Word {
  /** Unique ID for stable rendering */
  id: string
  /** The characters that make up this word */
  characters: Character[]
  /** The index of this word in the overall text */
  wordIndex: number
}

/**
 * Tracks the current exact position of the user's cursor.
 */
export interface CursorState {
  /** The index of the word the cursor is currently on */
  wordIndex: number
  /** The index of the character within the current word the cursor is on */
  charIndex: number
}

/**
 * Configuration options for a typing session.
 */
export interface TypingConfig {
  /** The mode of practice (e.g., 'time', 'words', 'quote', 'custom') */
  mode: "time" | "words" | "quote" | "custom"
  /** The primary language or layout configuration (e.g., 'english', 'hindi_mangal') */
  language: string
  /** Optional time limit in seconds (for 'time' mode) */
  timeLimit?: number
  /** Optional word limit (for 'words' mode) */
  wordLimit?: number
  /** Whether to allow correcting mistakes across word boundaries via Backspace */
  allowCrossWordBackspace: boolean
  /** Whether to strictly enforce accuracy constraints (fail on X mistakes) */
  strictMode: boolean
}

/**
 * Real-time and final statistics for a typing session.
 */
export interface TypingStatistics {
  /** Total elapsed time in milliseconds */
  elapsedTime: number
  /** Total correct keystrokes */
  correct: number
  /** Total incorrect keystrokes */
  incorrect: number
  /** Total extra keystrokes typed */
  extra: number
  /** Total characters missed/skipped */
  missed: number
  /** Net Words Per Minute */
  wpm: number
  /** Raw Words Per Minute (including mistakes) */
  rawWpm: number
  /** Characters Per Minute */
  cpm: number
  /** Accuracy percentage (0-100) */
  accuracy: number
  /** Overall progress percentage (0-100) */
  progress: number
  /** Number of words fully completed */
  wordsCompleted: number
  /** Time remaining in milliseconds (if applicable) */
  remainingTime: number
  /** Monotonically increasing counter of all physical character keystrokes */
  totalKeystrokes: number
  /** Number of times backspace was pressed */
  backspaces: number
}

/**
 * The global state container for a single typing run.
 */
export interface TypingSession {
  /** The original raw text of the session used for flawless resets */
  rawText: string
  /** Current status of the run */
  status: SessionStatus
  /** The parsed target text grouped into Words */
  words: Word[]
  /** The current configuration rules for this session */
  config: TypingConfig
  /** Real-time statistics */
  stats: TypingStatistics
  /** Current position of the user's cursor */
  cursor: CursorState
}

export * from "./events"
