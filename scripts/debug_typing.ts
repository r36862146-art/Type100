import { typingEngine } from "../src/features/typing/engine/typingEngine";
import { parseTextToModel } from "../src/features/typing/parser";
import { DEFAULT_TYPING_CONFIG } from "../src/features/typing/constants";
import { TypingSession } from "../src/features/typing/types";

const text = "hi there";
const words = parseTextToModel(text);

let state: TypingSession = {
  rawText: text,
  status: "idle",
  words: words,
  config: { ...DEFAULT_TYPING_CONFIG, mode: "time", timeLimit: 15 },
  stats: {
    wpm: 0, rawWpm: 0, accuracy: 100, cpm: 0, elapsedTime: 0, remainingTime: 15,
    progress: 0, totalKeystrokes: 0, correct: 0, incorrect: 0, extra: 0, missed: 0,
    wordsCompleted: 0, backspaces: 0
  },
  cursor: { wordIndex: 0, charIndex: 0 }
};

function typeString(str: string) {
  for (let i = 0; i < str.length; i++) {
    const key = str[i];
    const { nextState, events } = typingEngine.processKey(state, key);
    let textExhausted = false;
    for (const e of events) {
      if (e.type === "TEXT_EXHAUSTED") textExhausted = true;
    }
    
    state = nextState;
    if (textExhausted) {
      const parsed = parseTextToModel(state.rawText);
      const startIndex = state.words.length;
      const appended = parsed.map(w => ({
        ...w, wordIndex: w.wordIndex + startIndex,
        characters: w.characters.map(c => ({
          ...c, wordIndex: c.wordIndex + startIndex,
          id: `w${c.wordIndex + startIndex}_c${c.charIndex}`
        }))
      }));
      state.words = [...state.words, ...appended];
      state.cursor = { wordIndex: startIndex, charIndex: 0 };
      state.status = "running";
      console.log("TEXT EXHAUSTED AND APPENDED. New cursor:", state.cursor);
    }
    console.log(`Typed '${key}': cursor is now ${state.cursor.wordIndex}, ${state.cursor.charIndex}, status: ${state.status}`);
  }
}

typeString("hi there ");
