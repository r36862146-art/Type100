// ============================================================
// SSC INPUT VALIDATION — Phase 8.2
// Keystroke-level validation per SSC rules.
// Pure functions — no DOM, no React.
// ============================================================

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface SSCValidationResult {
  /** Total characters in the target text */
  totalTargetChars: number;

  /** Total characters typed by the candidate */
  totalTypedChars: number;

  /** Correct characters (matching target at position) */
  correctChars: number;

  /** Incorrect characters (typed but not matching) */
  incorrectChars: number;

  /** Extra characters typed beyond target length */
  extraChars: number;

  /** Missing characters (target chars not reached) */
  missingChars: number;

  /** Accuracy as a percentage (0-100) */
  accuracy: number;

  /** Whether every typed character matches the target */
  isPerfect: boolean;
}

// ----------------------------------------------------------------
// Core validation
// ----------------------------------------------------------------

/**
 * Validates typed input character-by-character against the target text.
 * Counts correct, incorrect, extra, and missing characters per SSC rules.
 *
 * SSC definition:
 * - Correct: typed[i] === target[i]
 * - Incorrect: typed[i] !== target[i] (and position exists in target)
 * - Extra: typed characters beyond target length
 * - Missing: target characters not reached by typed input
 */
export function validateInput(
  typed: string,
  target: string
): SSCValidationResult {
  const totalTargetChars = target.length;
  const totalTypedChars = typed.length;
  const compareLength = Math.min(totalTypedChars, totalTargetChars);

  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < compareLength; i++) {
    if (typed[i] === target[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  const extraChars = Math.max(0, totalTypedChars - totalTargetChars);
  const missingChars = Math.max(0, totalTargetChars - totalTypedChars);

  // Extra chars are also counted as errors in SSC scoring
  const totalErrors = incorrectChars + extraChars;
  const grossTyped = totalTypedChars;

  const accuracy =
    grossTyped > 0
      ? Math.min(100, Math.round((correctChars / Math.max(grossTyped, totalTargetChars)) * 100 * 10) / 10)
      : 0;

  const isPerfect = correctChars === totalTargetChars && extraChars === 0;

  return {
    totalTargetChars,
    totalTypedChars,
    correctChars,
    incorrectChars: totalErrors,
    extraChars,
    missingChars,
    accuracy,
    isPerfect,
  };
}

/**
 * Checks whether a single typed character at a given position matches the target.
 * Useful for real-time character-level highlighting in the simulator.
 */
export function isCharCorrect(
  typed: string,
  target: string,
  position: number
): boolean {
  if (position >= target.length) return false;
  if (position >= typed.length) return false;
  return typed[position] === target[position];
}

/**
 * Returns the per-character state for rendering.
 * "correct" | "incorrect" | "current" | "pending"
 */
export type CharState = "correct" | "incorrect" | "current" | "pending";

export function getCharStates(typed: string, target: string): CharState[] {
  return target.split("").map((_, i) => {
    if (i < typed.length) {
      return typed[i] === target[i] ? "correct" : "incorrect";
    }
    if (i === typed.length) return "current";
    return "pending";
  });
}
