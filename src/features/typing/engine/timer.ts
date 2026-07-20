import { TypingStatistics, TypingConfig } from "../types";

/**
 * Pure timer logic to calculate time-based state progressions.
 */
export const timer = {
  /**
   * Processes a time tick and updates time-related metrics.
   * Does NOT use setInterval directly; it expects to be called by an external driver.
   * Returns a new TypingStatistics object with updated times.
   */
  tick(
    currentStats: TypingStatistics, 
    deltaTimeMs: number, 
    config: TypingConfig
  ): TypingStatistics {
    const newElapsedTime = currentStats.elapsedTime + deltaTimeMs;
    let newRemainingTime = currentStats.remainingTime;

    // Handle countdown mode
    if (config.mode === "time" && config.timeLimit) {
      newRemainingTime = Math.max(0, (config.timeLimit * 1000) - newElapsedTime);
    }

    return {
      ...currentStats,
      elapsedTime: newElapsedTime,
      remainingTime: newRemainingTime
    };
  }
};
