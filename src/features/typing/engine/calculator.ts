/**
 * Pure mathematical functions for calculating typing statistics.
 * These are completely stateless and robust against edge cases like division-by-zero.
 */
export const calculator = {
  /**
   * Calculates Net Words Per Minute (WPM).
   * Industry standard formula: (Correct Keystrokes / 5) / (Time in Minutes)
   */
  calculateWpm(correctChars: number, elapsedTimeMs: number): number {
    if (elapsedTimeMs <= 0 || correctChars <= 0) return 0;
    const minutes = elapsedTimeMs / 60000;
    const wpm = (correctChars / 5) / minutes;
    return Math.max(0, Math.round(wpm));
  },

  /**
   * Calculates Raw Words Per Minute (including mistakes).
   * Industry standard formula: (Total Keystrokes / 5) / (Time in Minutes)
   */
  calculateRawWpm(totalKeystrokes: number, elapsedTimeMs: number): number {
    if (elapsedTimeMs <= 0 || totalKeystrokes <= 0) return 0;
    const minutes = elapsedTimeMs / 60000;
    const rawWpm = (totalKeystrokes / 5) / minutes;
    return Math.max(0, Math.round(rawWpm));
  },

  /**
   * Calculates Characters Per Minute (CPM).
   */
  calculateCpm(correctChars: number, elapsedTimeMs: number): number {
    if (elapsedTimeMs <= 0 || correctChars <= 0) return 0;
    const minutes = elapsedTimeMs / 60000;
    const cpm = correctChars / minutes;
    return Math.max(0, Math.round(cpm));
  },

  /**
   * Calculates Accuracy percentage (0-100).
   */
  calculateAccuracy(correctChars: number, incorrectChars: number, extraChars: number, missedChars: number): number {
    const totalAttempted = correctChars + incorrectChars + extraChars + missedChars;
    if (totalAttempted === 0) return 100; // Start with 100% accuracy
    
    const accuracy = (correctChars / totalAttempted) * 100;
    return Number(Math.max(0, Math.min(100, accuracy)).toFixed(2));
  },

  /**
   * Calculates overall progression through the test (0-100).
   */
  calculateProgress(completedItems: number, totalItems: number): number {
    if (totalItems <= 0) return 0;
    const progress = (completedItems / totalItems) * 100;
    return Number(Math.max(0, Math.min(100, progress)).toFixed(2));
  }
};
