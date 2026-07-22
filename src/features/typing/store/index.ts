import { create } from "zustand"
import { TypingSession, TypingConfig } from "../types"
import { DEFAULT_TYPING_CONFIG, INITIAL_TYPING_STATISTICS } from "../constants"
import { parseTextToModel } from "../parser"
import { typingEngine, statistics, timer, calculator } from "../engine"

interface TypingStore extends TypingSession {
  /**
   * Initializes a new typing session with a fresh text payload.
   * @param text The raw string target for the typing test.
   * @param config Optional overriding configuration for the session.
   */
  initSession: (text: string, config?: Partial<TypingConfig>) => void

  /**
   * Hard resets the current session, wiping all statistics and returning to idle state,
   * but keeping the same underlying parsed text.
   */
  /**
   * Hard resets the current session, wiping all statistics and returning to idle state,
   * but keeping the same underlying parsed text.
   */
  resetSession: () => void

  /**
   * Manually finishes the current session (e.g. early exit).
   */
  finishSession: () => void

  /**
   * Processes a validated keystroke, updating the cursor, character states,
   * and orchestrating the state machine transitions.
   */
  handleKeystroke: (key: string) => void

  /**
   * Ticks the session timer, updating elapsed time and derived statistics.
   */
  tick: (deltaTimeMs: number) => void
}

const initialState = {
  rawText: "",
  status: "idle" as const,
  words: [],
  config: DEFAULT_TYPING_CONFIG,
  stats: INITIAL_TYPING_STATISTICS,
  cursor: { wordIndex: 0, charIndex: 0 },
}

/**
 * The global state orchestrator for the Type100 typing engine.
 */
export const useTypingStore = create<TypingStore>()((set) => ({
  ...initialState,

  initSession: (text, config) => {
    if (!text || text.trim() === "") {
      console.warn("Attempted to initialize typing session with empty text.");
      return;
    }
    const parsedWords = parseTextToModel(text);
    
    set((state) => ({
      rawText: text,
      status: "idle",
      words: parsedWords,
      config: { ...state.config, ...config },
      stats: {
        ...INITIAL_TYPING_STATISTICS,
        remainingTime: (config?.mode || state.config.mode) === "time" && (config?.timeLimit || state.config.timeLimit) 
          ? (config?.timeLimit || state.config.timeLimit)! * 1000 
          : 0
      },
      cursor: { wordIndex: 0, charIndex: 0 },
    }))
  },

  resetSession: () => {
    set((state) => {
      if (!state.rawText) return state; // Guard against empty state reset

      const resetWords = parseTextToModel(state.rawText);

      return {
        status: "idle",
        words: resetWords,
        stats: {
          ...INITIAL_TYPING_STATISTICS,
          remainingTime: state.config.mode === "time" && state.config.timeLimit 
            ? state.config.timeLimit * 1000 
            : 0
        },
        cursor: { wordIndex: 0, charIndex: 0 },
      }
    })
  },

  finishSession: () => {
    set((state) => {
      if (state.status !== "running") return state;
      return { status: "finished" };
    });
  },

  handleKeystroke: (key) => {
    set((state) => {
      const { nextState, events } = typingEngine.processKey(state, key);
      
      // Reduce the statistics sequentially based on the events emitted
      let newStats = nextState.stats;
      let textExhausted = false;
      for (const event of events) {
        newStats = statistics.processEvent(newStats, event);
        if (event.type === "TEXT_EXHAUSTED") textExhausted = true;
      }
      
      const finalState = { ...nextState, stats: newStats };

      if (textExhausted && state.config.mode === "time") {
        const parsedWords = parseTextToModel(state.rawText);
        const startIndex = state.words.length;
        
        // Append a space to the previous last word so the user can type a space between repetitions
        if (startIndex > 0) {
          const prevLastWordIndex = startIndex - 1;
          const prevLastWord = finalState.words[prevLastWordIndex];
          const newCharIndex = prevLastWord.characters.length;
          finalState.words[prevLastWordIndex] = {
            ...prevLastWord,
            characters: [
              ...prevLastWord.characters,
              {
                id: `w${prevLastWordIndex}_c${newCharIndex}`,
                value: " ",
                state: "idle",
                wordIndex: prevLastWordIndex,
                charIndex: newCharIndex,
              }
            ]
          };
        }

        const appendedWords = parsedWords.map(w => ({
          ...w,
          wordIndex: w.wordIndex + startIndex,
          characters: w.characters.map(c => ({
            ...c,
            wordIndex: c.wordIndex + startIndex,
            id: `w${c.wordIndex + startIndex}_c${c.charIndex}`
          }))
        }));

        finalState.words = [...finalState.words, ...appendedWords];
        // Move cursor to the newly added space character of the previous word
        finalState.cursor = { wordIndex: startIndex - 1, charIndex: finalState.words[startIndex - 1].characters.length - 1 };
        // Ensure status stays running
        finalState.status = "running";
      }
      
      // Calculate overall progress based on completed words
      const totalWords = finalState.words.length;
      finalState.stats.progress = calculator.calculateProgress(finalState.stats.wordsCompleted, totalWords);
      
      return finalState;
    })
  },

  tick: (deltaTimeMs) => {
    set((state) => {
      if (state.status !== "running") return state;
      
      const newStatsWithTime = timer.tick(state.stats, deltaTimeMs, state.config);
      
      newStatsWithTime.wpm = calculator.calculateWpm(newStatsWithTime.correct, newStatsWithTime.elapsedTime);
      
      newStatsWithTime.rawWpm = calculator.calculateRawWpm(newStatsWithTime.totalKeystrokes, newStatsWithTime.elapsedTime);
      
      newStatsWithTime.cpm = calculator.calculateCpm(newStatsWithTime.correct, newStatsWithTime.elapsedTime);
      
      let newStatus: TypingSession["status"] = state.status;
      if (state.config.mode === "time" && state.config.timeLimit && newStatsWithTime.remainingTime <= 0) {
        newStatus = "finished";
      }

      return { status: newStatus, stats: newStatsWithTime };
    });
  },
}));

// ==========================================
// STABLE SELECTORS
// ==========================================
// Exporting these prevents unnecessary re-renders in React components 
// that only need specific slices of the state.

export const useTypingStatus = () => useTypingStore((state) => state.status);
export const useTypingWords = () => useTypingStore((state) => state.words);
export const useTypingCursor = () => useTypingStore((state) => state.cursor);
export const useTypingStats = () => useTypingStore((state) => state.stats);
export const useTypingConfig = () => useTypingStore((state) => state.config);
export const useTypingActions = () => {
  const initSession = useTypingStore((state) => state.initSession);
  const resetSession = useTypingStore((state) => state.resetSession);
  const finishSession = useTypingStore((state) => state.finishSession);
  const handleKeystroke = useTypingStore((state) => state.handleKeystroke);
  const tick = useTypingStore((state) => state.tick);
  
  return { initSession, resetSession, finishSession, handleKeystroke, tick };
};
