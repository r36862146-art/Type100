export interface ResultsSnapshot {
  /** Net Words Per Minute */
  wpm: number;
  /** Raw Words Per Minute (including mistakes) */
  rawWpm: number;
  /** Accuracy percentage (0-100) */
  accuracy: number;
  /** Characters Per Minute */
  cpm: number;
  /** Total elapsed time in milliseconds */
  elapsedTime: number;
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Total correct keystrokes */
  correctCharacters: number;
  /** Total incorrect keystrokes */
  incorrectCharacters: number;
  /** Total extra keystrokes typed */
  extraCharacters: number;
  /** Total characters missed/skipped */
  missedCharacters: number;
  /** Number of words fully completed */
  wordsCompleted: number;
  /** Total characters in the session */
  totalCharacters: number;
}
