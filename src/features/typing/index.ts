/**
 * Type100 Typing Engine - Public API
 * This barrel file exposes the production-hardened interface for the typing engine.
 */

// 1. Core State & Store Hooks
export {
  useTypingStore,
  useTypingStatus,
  useTypingWords,
  useTypingCursor,
  useTypingStats,
  useTypingConfig,
  useTypingActions
} from "./store";

// 2. Headless Engine & Modules
export { typingEngine, statistics, timer, calculator } from "./engine";

// 3. Types & Events
export type {
  TypingSession,
  TypingConfig,
  TypingStatistics,
  SessionStatus,
  Word,
  Character,
  CharacterState,
  CursorState,
  EngineEvent,
  EngineResult
} from "./types";

// 4. Default Constants
export { DEFAULT_TYPING_CONFIG, INITIAL_TYPING_STATISTICS, DEFAULT_TIME_LIMITS, DEFAULT_WORD_LIMITS } from "./constants";
