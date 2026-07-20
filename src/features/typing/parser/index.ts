import { Word, Character } from "../types"

/**
 * Generates a stable deterministic ID for a character based on its position.
 * This is preferred over random UUIDs for easier debugging and stable React rendering
 * across SSR boundaries if needed.
 */
const generateCharacterId = (wordIndex: number, charIndex: number): string => {
  return `w${wordIndex}_c${charIndex}`
}

/**
 * Generates a stable deterministic ID for a word.
 */
const generateWordId = (wordIndex: number): string => {
  return `w${wordIndex}`
}

/**
 * Parses a raw string of text into the deeply nested data model required by the typing engine.
 * Each word is separated by a space. The space itself is attached to the word as the final character,
 * matching standard typing engine behavior (except for the final word).
 *
 * @param text The raw string to parse.
 * @returns An array of Word objects containing Character objects.
 */
export function parseTextToModel(text: string): Word[] {
  if (!text || text.trim().length === 0) {
    return []
  }

  // Split by exactly one space to preserve natural word boundaries
  const rawWords = text.split(" ")
  const words: Word[] = []

  for (let wIndex = 0; wIndex < rawWords.length; wIndex++) {
    const rawWord = rawWords[wIndex]
    // If it's not the last word, append a space character to the end of it as a target
    const isLastWord = wIndex === rawWords.length - 1
    const charactersToMap = isLastWord ? rawWord : `${rawWord} `

    const characters: Character[] = []

    for (let cIndex = 0; cIndex < charactersToMap.length; cIndex++) {
      const charValue = charactersToMap[cIndex]
      characters.push({
        id: generateCharacterId(wIndex, cIndex),
        value: charValue,
        // The very first character of the very first word starts as 'current'
        state: wIndex === 0 && cIndex === 0 ? "current" : "idle",
        wordIndex: wIndex,
        charIndex: cIndex,
      })
    }

    words.push({
      id: generateWordId(wIndex),
      wordIndex: wIndex,
      characters,
    })
  }

  return words
}
