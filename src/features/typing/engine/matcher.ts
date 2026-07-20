import { CharacterState } from "../types";

/**
 * Core matching logic for comparing typed input against expected text.
 */
export const matcher = {
  /**
   * Compares an expected character with a typed character and returns the resulting CharacterState.
   * If expected is undefined (typing beyond the word), it evaluates to 'extra'.
   */
  matchCharacter(expected: string | undefined, typed: string): CharacterState {
    if (expected === undefined) {
      return "extra";
    }
    
    return expected === typed ? "correct" : "incorrect";
  }
};
