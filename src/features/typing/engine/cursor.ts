import { CursorState, Word } from "../types";

/**
 * Cursor manipulation logic decoupled from complex Word structures.
 */
export const cursorMath = {
  /**
   * Advances the cursor forward by one position.
   * Returns null if the cursor reaches the end of the text.
   */
  advance(
    wordLengths: number[],
    currentCursor: CursorState
  ): CursorState | null {
    const { wordIndex, charIndex } = currentCursor;
    const currentWordLength = wordLengths[wordIndex];

    if (charIndex < currentWordLength - 1) {
      return { wordIndex, charIndex: charIndex + 1 };
    }

    if (wordIndex < wordLengths.length - 1) {
      return { wordIndex: wordIndex + 1, charIndex: 0 };
    }

    return null;
  },

  /**
   * Moves the cursor backward by one position (for Backspace).
   */
  retreat(
    wordLengths: number[],
    currentCursor: CursorState,
    allowCrossWord: boolean
  ): CursorState {
    const { wordIndex, charIndex } = currentCursor;

    if (charIndex > 0) {
      return { wordIndex, charIndex: charIndex - 1 };
    }

    if (allowCrossWord && wordIndex > 0) {
      const previousWordLength = wordLengths[wordIndex - 1];
      return {
        wordIndex: wordIndex - 1,
        charIndex: previousWordLength - 1,
      };
    }

    return currentCursor;
  },

  /**
   * Jumps the cursor to the beginning of the next word.
   */
  jumpToNextWord(
    wordLengths: number[],
    currentCursor: CursorState
  ): CursorState | null {
    const { wordIndex } = currentCursor;

    if (wordIndex < wordLengths.length - 1) {
      return { wordIndex: wordIndex + 1, charIndex: 0 };
    }

    return null;
  },

  /**
   * Helper to extract word lengths from the standard Word[] array.
   */
  getWordLengths(words: Word[]): number[] {
    return words.map(w => w.characters.length);
  }
};
