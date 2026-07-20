// ============================================================
// ANDAMAN SCORING ENGINE — Phase 8.4
// Same government standard formula as SSC/RRB.
// Pure functions only — no side effects.
//
// Formula:
//   Net WPM = (gross chars − error penalty chars) / 5 / elapsed min
//   Error penalty = errors × 1 word × 5 chars
//   Accuracy = (correct chars / gross chars) × 100
// ============================================================

import type { AndamanPracticeMode } from "./andamanRules";

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------

const CHARS_PER_WORD = 5;
const ERROR_PENALTY_WORDS_PER_ERROR = 1;

export { CHARS_PER_WORD };

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface AndamanScoreInput {
  grossCharacters: number;
  errors: number;
  elapsedSeconds: number;
  targetWpm: number;
  targetAccuracy: number;
}

export interface AndamanScoreResult {
  grossCharacters: number;
  grossWPM: number;
  netWPM: number;
  correctCharacters: number;
  errors: number;
  accuracy: number;
  minutesElapsed: number;
  qualifies: boolean;
  errorPenaltyWords: number;
  targetWpm: number;
  targetAccuracy: number;
  wpmGap: number;
  accuracyGap: number;
}

export interface AndamanErrorBreakdown {
  numberErrors: number;
  capitalErrors: number;
  punctuationErrors: number;
  spacingErrors: number;
  longWordErrors: number;
  otherErrors: number;
  totalErrors: number;
}

// ----------------------------------------------------------------
// Scoring functions
// ----------------------------------------------------------------

/** Gross WPM = total chars typed / 5 / elapsed minutes */
export function computeGrossWPM(
  grossChars: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  return Math.round(grossChars / CHARS_PER_WORD / (elapsedSeconds / 60));
}

/**
 * Net WPM using the standard government formula.
 * Each error deducts 1 word (5 chars) from the gross character count.
 */
export function computeNetWPM(
  grossChars: number,
  errors: number,
  elapsedSeconds: number
): number {
  if (elapsedSeconds <= 0) return 0;
  const penaltyChars = errors * ERROR_PENALTY_WORDS_PER_ERROR * CHARS_PER_WORD;
  const adjusted = Math.max(0, grossChars - penaltyChars);
  return Math.round(adjusted / CHARS_PER_WORD / (elapsedSeconds / 60));
}

/** Accuracy = (correct chars / gross chars) × 100, clamped 0–100 */
export function computeAccuracy(
  grossChars: number,
  errors: number
): number {
  if (grossChars <= 0) return 0;
  const correct = Math.max(0, grossChars - errors);
  return Math.min(100, Math.round((correct / grossChars) * 100 * 10) / 10);
}

/** Master scorer — returns the full AndamanScoreResult */
export function computeAndamanScore(
  input: AndamanScoreInput
): AndamanScoreResult {
  const { grossCharacters, errors, elapsedSeconds, targetWpm, targetAccuracy } =
    input;

  const grossWPM = computeGrossWPM(grossCharacters, elapsedSeconds);
  const netWPM = computeNetWPM(grossCharacters, errors, elapsedSeconds);
  const accuracy = computeAccuracy(grossCharacters, errors);
  const correctCharacters = Math.max(0, grossCharacters - errors);
  const errorPenaltyWords = errors * ERROR_PENALTY_WORDS_PER_ERROR;
  const minutesElapsed = elapsedSeconds / 60;

  const qualifies = netWPM >= targetWpm && accuracy >= targetAccuracy;

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
    wpmGap: netWPM - targetWpm,
    accuracyGap: accuracy - targetAccuracy,
  };
}

// ----------------------------------------------------------------
// Analysis functions
// ----------------------------------------------------------------

/** Returns human-readable list of weak performance areas */
export function getWeakAreas(score: AndamanScoreResult): string[] {
  const areas: string[] = [];
  if (score.wpmGap < 0)
    areas.push(
      `Typing Speed (${Math.abs(score.wpmGap)} WPM below target of ${score.targetWpm} WPM)`
    );
  if (score.accuracyGap < 0)
    areas.push(
      `Accuracy (${Math.abs(score.accuracyGap).toFixed(1)}% below target of ${score.targetAccuracy}%)`
    );
  if (score.errorPenaltyWords > 10)
    areas.push(
      `Error Rate (${score.errorPenaltyWords} word penalties — aim for fewer than 10)`
    );
  if (areas.length === 0)
    areas.push("None — you are meeting all qualifying criteria!");
  return areas;
}

/** Returns recommended practice modes based on the score */
export function getRecommendedPractice(
  score: AndamanScoreResult
): AndamanPracticeMode[] {
  const modes = new Set<AndamanPracticeMode>();
  if (score.wpmGap < -10) {
    modes.add("practice_unlimited");
    modes.add("practice_timed");
  }
  if (score.accuracyGap < -3) {
    modes.add("weak_numbers");
    modes.add("weak_capitals");
    modes.add("weak_punctuation");
    modes.add("weak_long_words");
  }
  if (score.wpmGap >= -5 && score.accuracyGap >= -2) {
    modes.add("official_qualifying");
    modes.add("official_full");
  }
  if (score.qualifies) modes.add("official_full");
  return Array.from(modes);
}

/**
 * Breaks down errors by character type.
 * Extends the RRB breakdown with longWordErrors (words > 8 chars preceding the error).
 */
export function getErrorBreakdown(
  typed: string,
  target: string
): AndamanErrorBreakdown {
  const compareLength = Math.min(typed.length, target.length);
  let numberErrors = 0;
  let capitalErrors = 0;
  let punctuationErrors = 0;
  let spacingErrors = 0;
  let longWordErrors = 0;
  let otherErrors = 0;

  // Pre-compute long-word positions: character positions inside words > 8 chars
  const longWordPositions = new Set<number>();
  const words = target.split(" ");
  let pos = 0;
  for (const w of words) {
    if (w.length > 8) {
      for (let k = pos; k < pos + w.length; k++) longWordPositions.add(k);
    }
    pos += w.length + 1; // +1 for the space
  }

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
      } else if (longWordPositions.has(i)) {
        longWordErrors++;
      } else {
        otherErrors++;
      }
    }
  }

  const extraErrors = Math.max(0, typed.length - target.length);
  otherErrors += extraErrors;

  const totalErrors =
    numberErrors +
    capitalErrors +
    punctuationErrors +
    spacingErrors +
    longWordErrors +
    otherErrors;

  return {
    numberErrors,
    capitalErrors,
    punctuationErrors,
    spacingErrors,
    longWordErrors,
    otherErrors,
    totalErrors,
  };
}

/** Returns the single dominant error category label */
export function getPrimaryWeakCategory(
  breakdown: AndamanErrorBreakdown
): string {
  if (breakdown.totalErrors === 0) return "None — excellent accuracy!";
  const categories = [
    { label: "Numbers", count: breakdown.numberErrors },
    { label: "Capital Letters", count: breakdown.capitalErrors },
    { label: "Punctuation", count: breakdown.punctuationErrors },
    { label: "Spacing", count: breakdown.spacingErrors },
    { label: "Long Words", count: breakdown.longWordErrors },
    { label: "Other Characters", count: breakdown.otherErrors },
  ];
  const worst = categories.reduce((a, b) => (b.count > a.count ? b : a));
  return worst.count > 0 ? worst.label : "Mixed Errors";
}
