// ============================================================
// SSC SCORING ENGINE — Phase 8.2
// SSC-specific gross/net WPM, error deduction, and KPH calculation.
// Pure functions only. No side effects.
// ============================================================

import type { QualifyingType } from "./sscRules";
import { CHARS_PER_WORD } from "./sscRules";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface SSCScoreInput {
  /** Total characters typed (correct + incorrect) */
  grossCharacters: number;

  /** Number of incorrect characters */
  errors: number;

  /** Actual elapsed time in seconds */
  elapsedSeconds: number;

  /** Qualifying type — governs which formula is used */
  qualifyingType: QualifyingType;
}

export interface SSCScoreResult {
  /** Total gross characters typed */
  grossCharacters: number;

  /** Gross WPM (all characters, no deduction) */
  grossWPM: number;

  /** Net WPM (error-deducted; SSC standard formula) */
  netWPM: number;

  /** Correct characters (gross - errors) */
  correctCharacters: number;

  /** Number of errors */
  errors: number;

  /** Accuracy percentage (0-100) */
  accuracy: number;

  /** Keystrokes per hour (for DEO qualifying type) */
  keystrokesPerHour: number;

  /** Minutes elapsed */
  minutesElapsed: number;

  /** Whether the score meets the qualifying standard */
  qualifies: boolean;

  /** SSC error penalty deducted from gross WPM */
  errorPenalty: number;
}

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

/**
 * SSC error penalty: each error reduces the gross word count by 1 word.
 * This is applied before computing net WPM.
 */
const SSC_ERROR_PENALTY_WORDS_PER_ERROR = 1;

// ----------------------------------------------------------------
// Scoring functions
// ----------------------------------------------------------------

/**
 * Computes gross WPM from raw keystroke data.
 * Gross WPM = total characters / CHARS_PER_WORD / elapsed minutes
 */
export function computeGrossWPM(grossChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(grossChars / CHARS_PER_WORD / minutes);
}

/**
 * Computes net WPM using the SSC formula.
 * Net WPM = (gross characters - error penalty) / CHARS_PER_WORD / elapsed minutes
 * Error penalty = errors * CHARS_PER_WORD (each error removes one word equivalent)
 */
export function computeNetWPM(
  grossChars: number,
  errors: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const penaltyChars = errors * SSC_ERROR_PENALTY_WORDS_PER_ERROR * CHARS_PER_WORD;
  const adjustedChars = Math.max(0, grossChars - penaltyChars);
  return Math.round(adjustedChars / CHARS_PER_WORD / minutes);
}

/**
 * Computes keystrokes per hour (for DEO posts).
 * KPH = total keystrokes / elapsed hours
 */
export function computeKPH(grossChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0;
  const hours = elapsedSeconds / 3600;
  return Math.round(grossChars / hours);
}

/**
 * Computes accuracy as a percentage.
 * Accuracy = (correctCharacters / grossCharacters) * 100, capped at 100.
 */
export function computeAccuracy(grossChars: number, errors: number): number {
  if (grossChars <= 0) return 0;
  const correct = Math.max(0, grossChars - errors);
  return Math.min(100, Math.round((correct / grossChars) * 100 * 10) / 10);
}

/**
 * Master scoring function: computes the full SSCScoreResult.
 */
export function computeSSCScore(
  input: SSCScoreInput,
  targetSpeed: number,
  targetKPH?: number
): SSCScoreResult {
  const { grossCharacters, errors, elapsedSeconds, qualifyingType } = input;

  const minutesElapsed = elapsedSeconds / 60;
  const correctCharacters = Math.max(0, grossCharacters - errors);
  const accuracy = computeAccuracy(grossCharacters, errors);

  const grossWPM = computeGrossWPM(grossCharacters, elapsedSeconds);
  const errorPenalty = errors * SSC_ERROR_PENALTY_WORDS_PER_ERROR;
  const netWPM = computeNetWPM(grossCharacters, errors, elapsedSeconds);
  const keystrokesPerHour = computeKPH(grossCharacters, elapsedSeconds);

  let qualifies: boolean;
  if (qualifyingType === "keystrokes_per_hour") {
    qualifies = keystrokesPerHour >= (targetKPH ?? 8000) && accuracy >= 90;
  } else {
    qualifies = netWPM >= targetSpeed && accuracy >= 90;
  }

  return {
    grossCharacters,
    grossWPM,
    netWPM,
    correctCharacters,
    errors,
    accuracy,
    keystrokesPerHour,
    minutesElapsed,
    qualifies,
    errorPenalty,
  };
}

/**
 * Determines the weakest area based on score components.
 */
export function getWeakestArea(score: SSCScoreResult, targetWPM: number): string {
  const wpmGap = targetWPM - score.netWPM;
  const accuracyGap = 90 - score.accuracy;

  if (wpmGap > 0 && accuracyGap > 0) {
    return wpmGap > accuracyGap * 3 ? "Typing Speed" : "Accuracy";
  }
  if (wpmGap > 0) return "Typing Speed";
  if (accuracyGap > 0) return "Accuracy";
  return "None — You are qualifying!";
}

/**
 * Determines the strongest area based on score components.
 */
export function getStrongestArea(score: SSCScoreResult, targetWPM: number): string {
  const wpmSurplus = score.netWPM - targetWPM;
  const accuracySurplus = score.accuracy - 90;

  if (wpmSurplus >= 0 && accuracySurplus >= 0) {
    return wpmSurplus >= accuracySurplus ? "Typing Speed" : "Accuracy";
  }
  if (wpmSurplus >= 0) return "Typing Speed";
  if (accuracySurplus >= 0) return "Accuracy";
  return "Both need improvement";
}
