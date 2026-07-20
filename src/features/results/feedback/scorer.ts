import { ResultsSnapshot } from "../types";

/**
 * Calculates a normalized score (0-100) based on weighted metrics.
 * Weights:
 * - Accuracy: 40%
 * - Consistency: 20%
 * - Speed: 20%
 * - Error Control: 10%
 * - Completion: 10%
 */
export function calculateScore(snapshot: ResultsSnapshot): number {
  // 1. Accuracy (0-100)
  const accuracyScore = Math.max(0, Math.min(100, snapshot.accuracy));

  // 2. Consistency (0-100)
  // Approximated by ratio of net WPM to raw WPM. Higher is more consistent (fewer corrections).
  const consistencyRatio = snapshot.rawWpm > 0 ? (snapshot.wpm / snapshot.rawWpm) : 1;
  const consistencyScore = Math.max(0, Math.min(100, consistencyRatio * 100));

  // 3. Speed (0-100)
  // Assuming 120 WPM is "100%" for scoring purposes, but we cap it at 100.
  const speedScore = Math.max(0, Math.min(100, (snapshot.wpm / 120) * 100));

  // 4. Error Control (0-100)
  // Penalizes extra and missed characters relative to total characters.
  const totalErrors = snapshot.extraCharacters + snapshot.missedCharacters + snapshot.incorrectCharacters;
  const errorRatio = snapshot.totalCharacters > 0 ? (totalErrors / snapshot.totalCharacters) : 0;
  // 0 errors = 100 score. 10% error rate or more = 0 score.
  const errorControlScore = Math.max(0, 100 - (errorRatio * 1000));

  // 5. Completion (0-100)
  const completionScore = Math.max(0, Math.min(100, snapshot.progress));

  const finalScore = 
    (accuracyScore * 0.40) +
    (consistencyScore * 0.20) +
    (speedScore * 0.20) +
    (errorControlScore * 0.10) +
    (completionScore * 0.10);

  return Math.round(finalScore);
}
