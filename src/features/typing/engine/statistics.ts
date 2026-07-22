import { TypingStatistics } from "../types";
import { EngineEvent } from "../types/events";
import { calculator } from "./calculator";

/**
 * Pure state reducer for typing statistics.
 * Consumes events emitted by the typing engine and updates metrics in O(1) time.
 */
export const statistics = {
  /**
   * Processes a single EngineEvent and returns the updated TypingStatistics.
   */
  processEvent(stats: TypingStatistics, event: EngineEvent): TypingStatistics {
    const newStats = { ...stats };

    switch (event.type) {
      case "CHARACTER_CORRECT":
        newStats.correct++;
        newStats.totalKeystrokes++;
        break;
      
      case "CHARACTER_INCORRECT":
        newStats.totalKeystrokes++;
        // The typing engine sends expected: "" for extra characters typed beyond word bounds
        if (event.payload.expected === "") {
          newStats.extra++;
        } else {
          newStats.incorrect++;
        }
        break;

      case "WORD_COMPLETED":
        newStats.wordsCompleted++;
        break;

      case "WORD_INCOMPLETED":
        if (newStats.wordsCompleted > 0) newStats.wordsCompleted--;
        break;

      case "BACKSPACE":
        newStats.backspaces++;
        // Backspacing removes the penalty/reward for the erased character to maintain accurate O(1) counts.
        if (event.payload && "erasedState" in event.payload) {
          const state = event.payload.erasedState;
          if (state === "correct" && newStats.correct > 0) newStats.correct--;
          else if (state === "incorrect" && newStats.incorrect > 0) newStats.incorrect--;
          else if (state === "extra" && newStats.extra > 0) newStats.extra--;
          else if (state === "missed" && newStats.missed > 0) newStats.missed--;
        }
        break;
    }

    // Always recalculate derived metrics (WPM, Accuracy) to ensure they are synchronized with raw counts.
    // In a real session, elapsed time will be updated via a separate tick() loop, 
    // but the derived stats will recalculate based on the current time snapshot.
    newStats.wpm = calculator.calculateWpm(newStats.correct, newStats.elapsedTime);
    
    newStats.rawWpm = calculator.calculateRawWpm(newStats.totalKeystrokes, newStats.elapsedTime);
    
    newStats.cpm = calculator.calculateCpm(newStats.correct, newStats.elapsedTime);
    
    newStats.accuracy = calculator.calculateAccuracy(
      newStats.correct,
      newStats.incorrect,
      newStats.extra,
      newStats.missed
    );

    return newStats;
  }
};
