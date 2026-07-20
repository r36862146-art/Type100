// ============================================================
// ANDAMAN INPUT VALIDATION — Phase 8.4
// Character-level validation per Andaman exam rules.
// Pure functions — no DOM, no React, no side effects.
// ============================================================

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface AndamanValidationResult {
  totalTargetChars: number;
  totalTypedChars: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missingChars: number;
  accuracy: number;
  isPerfect: boolean;
}

export type CharState = "correct" | "incorrect" | "current" | "pending";

// ----------------------------------------------------------------
// Core validation
// ----------------------------------------------------------------

/**
 * Validates typed input against target text character-by-character.
 * Extra characters beyond target length count as errors.
 */
export function validateInput(
  typed: string,
  target: string
): AndamanValidationResult {
  const totalTargetChars = target.length;
  const totalTypedChars = typed.length;
  const compareLength = Math.min(totalTypedChars, totalTargetChars);

  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < compareLength; i++) {
    if (typed[i] === target[i]) correctChars++;
    else incorrectChars++;
  }

  const extraChars = Math.max(0, totalTypedChars - totalTargetChars);
  const missingChars = Math.max(0, totalTargetChars - totalTypedChars);
  const totalErrors = incorrectChars + extraChars;

  const accuracy =
    totalTypedChars > 0
      ? Math.min(
          100,
          Math.round(
            (correctChars /
              Math.max(totalTypedChars, totalTargetChars)) *
              100 *
              10
          ) / 10
        )
      : 0;

  return {
    totalTargetChars,
    totalTypedChars,
    correctChars,
    incorrectChars: totalErrors,
    extraChars,
    missingChars,
    accuracy,
    isPerfect: correctChars === totalTargetChars && extraChars === 0,
  };
}

/** Returns true if the typed character at position matches the target */
export function isCharCorrect(
  typed: string,
  target: string,
  position: number
): boolean {
  if (position >= target.length || position >= typed.length) return false;
  return typed[position] === target[position];
}

/**
 * Returns per-character rendering state array.
 * Used by TypingSkillTest for char-by-char highlighting.
 */
export function getCharStates(typed: string, target: string): CharState[] {
  return target.split("").map((_, i) => {
    if (i < typed.length)
      return typed[i] === target[i] ? "correct" : "incorrect";
    if (i === typed.length) return "current";
    return "pending";
  });
}

/** Progress through the passage as a 0-100 integer */
export function computeProgress(typed: string, target: string): number {
  if (target.length === 0) return 0;
  return Math.min(100, Math.round((typed.length / target.length) * 100));
}
