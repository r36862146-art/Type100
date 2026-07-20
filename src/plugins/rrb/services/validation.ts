// ============================================================
// RRB INPUT VALIDATION — Phase 8.3
// Keystroke-level validation per RRB rules.
// Pure functions — no DOM, no React.
//
// Mirrors the SSC validation module pattern to keep
// the RRB module fully self-contained.
// ============================================================

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface RRBValidationResult {
  /** Total characters in the target text */
  totalTargetChars: number;

  /** Total characters typed by the candidate */
  totalTypedChars: number;

  /** Correct characters (matching target at position) */
  correctChars: number;

  /** Incorrect characters (typed but not matching, including extras) */
  incorrectChars: number;

  /** Extra characters typed beyond target length */
  extraChars: number;

  /** Missing characters (target chars not yet reached) */
  missingChars: number;

  /** Accuracy as a percentage (0-100) */
  accuracy: number;

  /** Whether every typed character matches the target perfectly */
  isPerfect: boolean;
}

/** Per-character rendering state */
export type CharState = "correct" | "incorrect" | "current" | "pending";

// ----------------------------------------------------------------
// Core validation
// ----------------------------------------------------------------

/**
 * Validates typed input character-by-character against the target text.
 *
 * RRB rules:
 * - Correct: typed[i] === target[i]
 * - Incorrect: typed[i] !== target[i] (position exists in target)
 * - Extra: typed characters beyond target length
 * - Missing: target characters not yet reached
 * - Extra chars count as errors (same as SSC standard)
 */
export function validateInput(
  typed: string,
  target: string
): RRBValidationResult {
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

  // Extra chars are also counted as errors
  const totalErrors = incorrectChars + extraChars;

  const accuracy =
    totalTypedChars > 0
      ? Math.min(
          100,
          Math.round(
            (correctChars / Math.max(totalTypedChars, totalTargetChars)) *
              100 *
              10
          ) / 10
        )
      : 0;

  const isPerfect =
    correctChars === totalTargetChars && extraChars === 0;

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
 * Returns whether a single typed character at a given position matches the target.
 * Useful for real-time character-level highlighting.
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
 * Returns per-character state array for rendering:
 * "correct" | "incorrect" | "current" | "pending"
 */
export function getCharStates(typed: string, target: string): CharState[] {
  return target.split("").map((_, i) => {
    if (i < typed.length) {
      return typed[i] === target[i] ? "correct" : "incorrect";
    }
    if (i === typed.length) return "current";
    return "pending";
  });
}

/**
 * Returns the progress percentage through the passage (0-100).
 */
export function computeProgress(typed: string, target: string): number {
  if (target.length === 0) return 0;
  return Math.min(
    100,
    Math.round((typed.length / target.length) * 100)
  );
}
