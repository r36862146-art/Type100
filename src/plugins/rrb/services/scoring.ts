// ============================================================
// RRB SCORING ENGINE — Phase 8.3
// RRB-specific gross/net WPM, error deduction, and weak-area
// analysis. Pure functions only. No side effects.
//
// Formula: same as SSC/official government standard:
//   Net WPM = (gross chars - error penalty chars) / 5 / elapsed min
//   Error penalty: 1 error removes 1 word equivalent (5 chars)
// ============================================================

import type { RRBPracticeMode } from "./rrbRules";

// ----------------------------------------------------------------
// Constants — no magic numbers
// ----------------------------------------------------------------

/** Industry-standard characters per word */
const CHARS_PER_WORD = 5;

/** RRB error penalty: each error removes 1 word equivalent (5 chars) */
const RRB_ERROR_PENALTY_WORDS_PER_ERROR = 1;

export { CHARS_PER_WORD };

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface RRBScoreInput {
  /** Total characters typed (correct + incorrect) */
  grossCharacters: number;

  /** Number of incorrect characters (including extra chars) */
  errors: number;

  /** Actual elapsed time in seconds */
  elapsedSeconds: number;

  /** Target WPM from rules */
  targetWpm: number;

  /** Target accuracy from rules */
  targetAccuracy: number;
}

export interface RRBScoreResult {
  /** Total gross characters typed */
  grossCharacters: number;

  /** Gross WPM (no error deduction) */
  grossWPM: number;

  /** Net WPM (error-deducted; RRB official formula) */
  netWPM: number;

  /** Correct characters (gross - errors) */
  correctCharacters: number;

  /** Number of errors */
  errors: number;

  /** Accuracy percentage (0-100) */
  accuracy: number;

  /** Minutes actually elapsed */
  minutesElapsed: number;

  /** Whether the score meets both WPM and accuracy qualifying criteria */
  qualifies: boolean;

  /** Words deducted due to errors */
  errorPenaltyWords: number;

  /** Target WPM used for qualification check */
  targetWpm: number;

  /** Target accuracy used for qualification check */
  targetAccuracy: number;

  /** WPM gap vs target (positive = above, negative = below) */
  wpmGap: number;

  /** Accuracy gap vs target (positive = above, negative = below) */
  accuracyGap: number;
}

export interface RRBErrorBreakdown {
  /** Errors involving digit characters (0-9) */
  numberErrors: number;

  /** Errors involving uppercase letters */
  capitalErrors: number;

  /** Errors involving punctuation characters */
  punctuationErrors: number;

  /** Errors involving space characters */
  spacingErrors: number;

  /** All other character-type errors */
  otherErrors: number;

  /** Total errors counted */
  totalErrors: number;
}

// ----------------------------------------------------------------
// Scoring functions
// ----------------------------------------------------------------

/**
 * Computes gross WPM from raw keystroke data.
 * Gross WPM = total characters / CHARS_PER_WORD / elapsed minutes
 */
export function computeGrossWPM(
  grossChars: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(grossChars / CHARS_PER_WORD / minutes);
}

/**
 * Computes net WPM using the RRB/standard government exam formula.
 * Net WPM = (gross chars - penalty chars) / CHARS_PER_WORD / elapsed minutes
 * Penalty = errors * 1 word * CHARS_PER_WORD
 */
export function computeNetWPM(
  grossChars: number,
  errors: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  const minutes = elapsedSeconds / 60;
  const penaltyChars =
    errors * RRB_ERROR_PENALTY_WORDS_PER_ERROR * CHARS_PER_WORD;
  const adjustedChars = Math.max(0, grossChars - penaltyChars);
  return Math.round(adjustedChars / CHARS_PER_WORD / minutes);
}

/**
 * Computes accuracy as a percentage (0-100).
 * Accuracy = (correctCharacters / grossCharacters) * 100
 */
export function computeAccuracy(
  grossChars: number,
  errors: number
): number {
  if (grossChars <= 0) return 0;
  const correct = Math.max(0, grossChars - errors);
  return Math.min(
    100,
    Math.round((correct / grossChars) * 100 * 10) / 10
  );
}

/**
 * Master RRB scoring function. Computes the full RRBScoreResult.
 */
export function computeRRBScore(input: RRBScoreInput): RRBScoreResult {
  const { grossCharacters, errors, elapsedSeconds, targetWpm, targetAccuracy } =
    input;

  const minutesElapsed = elapsedSeconds / 60;
  const correctCharacters = Math.max(0, grossCharacters - errors);
  const accuracy = computeAccuracy(grossCharacters, errors);

  const grossWPM = computeGrossWPM(grossCharacters, elapsedSeconds);
  const errorPenaltyWords =
    errors * RRB_ERROR_PENALTY_WORDS_PER_ERROR;
  const netWPM = computeNetWPM(grossCharacters, errors, elapsedSeconds);

  const speedQualified = netWPM >= targetWpm;
  const accuracyQualified = accuracy >= targetAccuracy;
  const qualifies = speedQualified && accuracyQualified;

  const wpmGap = netWPM - targetWpm;
  const accuracyGap = accuracy - targetAccuracy;

  return {
    grossCharacters,
    grossWPM,
    netWPM,
    correctCharacters,
    errors,
    accuracy,
    minutesElapsed,
    qualifies,
    errorPenaltyWords,
    targetWpm,
    targetAccuracy,
    wpmGap,
    accuracyGap,
  };
}

// ----------------------------------------------------------------
// Analysis functions
// ----------------------------------------------------------------

/**
 * Identifies the weakest performance areas from an RRBScoreResult.
 * Returns a human-readable list of areas needing improvement.
 */
export function getWeakAreas(score: RRBScoreResult): string[] {
  const areas: string[] = [];

  if (score.wpmGap < 0) {
    areas.push(
      `Typing Speed (${Math.abs(score.wpmGap)} WPM below target of ${score.targetWpm} WPM)`
    );
  }
  if (score.accuracyGap < 0) {
    areas.push(
      `Accuracy (${Math.abs(score.accuracyGap).toFixed(1)}% below target of ${score.targetAccuracy}%)`
    );
  }
  if (score.errorPenaltyWords > 10) {
    areas.push(
      `Error Rate (${score.errorPenaltyWords} word penalties — aim for < 10)`
    );
  }

  if (areas.length === 0) {
    areas.push("None — you are meeting all qualifying criteria!");
  }

  return areas;
}

/**
 * Returns recommended practice modes based on an RRBScoreResult.
 */
export function getRecommendedPractice(
  score: RRBScoreResult
): RRBPracticeMode[] {
  const modes: RRBPracticeMode[] = [];

  // Speed is the main deficit
  if (score.wpmGap < -10) {
    modes.push("practice_unlimited");
    modes.push("practice_timed");
  }

  // Accuracy is the main deficit
  if (score.accuracyGap < -3) {
    modes.push("weak_numbers");
    modes.push("weak_capitals");
    modes.push("weak_punctuation");
  }

  // Close to target — move to official simulation
  if (score.wpmGap >= -5 && score.accuracyGap >= -2) {
    modes.push("official_qualifying");
    modes.push("official_full");
  }

  // Already qualifying — full official practice
  if (score.qualifies) {
    modes.push("official_full");
  }

  // Deduplicate
  return Array.from(new Set(modes));
}

/**
 * Categorises errors character-by-character into an RRBErrorBreakdown.
 * Used for the CompletionScreen detailed error analysis.
 */
export function getErrorBreakdown(
  typed: string,
  target: string
): RRBErrorBreakdown {
  const compareLength = Math.min(typed.length, target.length);

  let numberErrors = 0;
  let capitalErrors = 0;
  let punctuationErrors = 0;
  let spacingErrors = 0;
  let otherErrors = 0;

  for (let i = 0; i < compareLength; i++) {
    if (typed[i] !== target[i]) {
      const ch = target[i];
      if (/\d/.test(ch)) {
        numberErrors++;
      } else if (/[A-Z]/.test(ch)) {
        capitalErrors++;
      } else if (/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(ch)) {
        punctuationErrors++;
      } else if (ch === " ") {
        spacingErrors++;
      } else {
        otherErrors++;
      }
    }
  }

  // Extra typed characters beyond target length are "other" errors
  const extraErrors = Math.max(0, typed.length - target.length);
  otherErrors += extraErrors;

  const totalErrors =
    numberErrors +
    capitalErrors +
    punctuationErrors +
    spacingErrors +
    otherErrors;

  return {
    numberErrors,
    capitalErrors,
    punctuationErrors,
    spacingErrors,
    otherErrors,
    totalErrors,
  };
}

/**
 * Returns the single weakest character category as a human-readable label.
 * Used for one-line summary on results card.
 */
export function getPrimaryWeakCategory(
  breakdown: RRBErrorBreakdown
): string {
  if (breakdown.totalErrors === 0) return "None — excellent accuracy!";

  const categories: Array<{ label: string; count: number }> = [
    { label: "Numbers", count: breakdown.numberErrors },
    { label: "Capital Letters", count: breakdown.capitalErrors },
    { label: "Punctuation", count: breakdown.punctuationErrors },
    { label: "Spacing", count: breakdown.spacingErrors },
    { label: "Other Characters", count: breakdown.otherErrors },
  ];

  const worst = categories.reduce((a, b) =>
    b.count > a.count ? b : a
  );

  return worst.count > 0 ? worst.label : "Mixed Errors";
}
