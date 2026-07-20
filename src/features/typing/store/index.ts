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
  resetSession: () => void

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

  handleKeystroke: (key) => {
    set((state) => {
      const { nextState, events } = typingEngine.processKey(state, key);
      
      // Reduce the statistics sequentially based on the events emitted
      let newStats = nextState.stats;
      for (const event of events) {
        newStats = statistics.processEvent(newStats, event);
      }
      
      
      // Calculate overall progress based on completed words
      const totalWords = state.words.length;
      newStats.progress = calculator.calculateProgress(newStats.wordsCompleted, totalWords);
      
      return { ...nextState, stats: newStats };
    })
  },

  tick: (deltaTimeMs) => {
    set((state) => {
      if (state.status !== "running") return state;
      
      const newStatsWithTime = timer.tick(state.stats, deltaTimeMs, state.config);
      
      newStatsWithTime.wpm = calculator.calculateWpm(newStatsWithTime.correct, newStatsWithTime.elapsedTime);
      
      const totalKeystrokes = newStatsWithTime.correct + newStatsWithTime.incorrect + newStatsWithTime.extra;
      newStatsWithTime.rawWpm = calculator.calculateRawWpm(totalKeystrokes, newStatsWithTime.elapsedTime);
      
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
  const handleKeystroke = useTypingStore((state) => state.handleKeystroke);
  const tick = useTypingStore((state) => state.tick);
  
  return { initSession, resetSession, handleKeystroke, tick };
};
