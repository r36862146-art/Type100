// ============================================================
// PROGRESS SERVICE — Phase 8.1
// localStorage-backed progress tracking per exam.
// Future cloud-sync ready via the StorageStrategy interface.
// ============================================================

import type { ExamId, ExamProgress, ExamAttempt, ResultsSnapshot } from "../types";
import { EXAM_PROGRESS_STORAGE_KEY_PREFIX } from "../constants";

// ----------------------------------------------------------------
// Storage Strategy interface (future cloud-sync hook)
// ----------------------------------------------------------------

interface StorageStrategy {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/** Default implementation: browser localStorage */
const localStorageStrategy: StorageStrategy = {
  get: (key) => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
      }
    } catch {
      // Storage full or unavailable — fail silently
    }
  },
  remove: (key) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  },
};

// ----------------------------------------------------------------
// Internal helpers
// ----------------------------------------------------------------

function storageKey(examId: ExamId): string {
  return `${EXAM_PROGRESS_STORAGE_KEY_PREFIX}${examId}`;
}

function emptyProgress(examId: ExamId): ExamProgress {
  return {
    examId,
    attempts: 0,
    averageWPM: 0,
    bestWPM: 0,
    averageAccuracy: 0,
    completedPassages: 0,
    lastPracticed: null,
    history: [],
  };
}

function recalculate(progress: ExamProgress): ExamProgress {
  const history = progress.history;
  if (history.length === 0) {
    return { ...progress, averageWPM: 0, averageAccuracy: 0, bestWPM: 0 };
  }

  const totalWPM = history.reduce((sum, a) => sum + a.wpm, 0);
  const totalAccuracy = history.reduce((sum, a) => sum + a.accuracy, 0);
  const bestWPM = Math.max(...history.map((a) => a.wpm));

  return {
    ...progress,
    averageWPM: Math.round(totalWPM / history.length),
    averageAccuracy: parseFloat((totalAccuracy / history.length).toFixed(1)),
    bestWPM,
  };
}

// ----------------------------------------------------------------
// Public API
// ----------------------------------------------------------------

/** Load progress for a given exam from storage */
export function getProgress(
  examId: ExamId,
  storage: StorageStrategy = localStorageStrategy
): ExamProgress {
  const oldKey = `type100_exam_progress_${examId}`;
  const newKey = storageKey(examId);
  const oldData = storage.get(oldKey);
  if (oldData && !storage.get(newKey)) {
    storage.set(newKey, oldData);
    storage.remove(oldKey);
  }

  const raw = storage.get(newKey);
  if (!raw) return emptyProgress(examId);

  try {
    return JSON.parse(raw) as ExamProgress;
  } catch {
    return emptyProgress(examId);
  }
}

/**
 * Records a new attempt for an exam.
 * Automatically recalculates averages and best WPM.
 */
export function recordAttempt(
  examId: ExamId,
  snapshot: ResultsSnapshot,
  qualified: boolean,
  storage: StorageStrategy = localStorageStrategy
): ExamProgress {
  const current = getProgress(examId, storage);

  const attempt: ExamAttempt = {
    timestamp: new Date().toISOString(),
    wpm: snapshot.wpm,
    accuracy: snapshot.accuracy,
    durationSeconds: Math.round(snapshot.elapsedTime / 1000),
    qualified,
  };

  const updated: ExamProgress = {
    ...current,
    attempts: current.attempts + 1,
    lastPracticed: attempt.timestamp,
    history: [...current.history, attempt],
  };

  const recalculated = recalculate(updated);
  storage.set(storageKey(examId), JSON.stringify(recalculated));
  return recalculated;
}

/**
 * Retrieves the best WPM for a given exam.
 */
export function getBestWpm(
  examId: ExamId,
  storage: StorageStrategy = localStorageStrategy
): number {
  return getProgress(examId, storage).bestWPM;
}

/**
 * Retrieves the average WPM for a given exam.
 */
export function getAverageWpm(
  examId: ExamId,
  storage: StorageStrategy = localStorageStrategy
): number {
  return getProgress(examId, storage).averageWPM;
}

/**
 * Clears all progress data for a given exam.
 */
export function clearProgress(
  examId: ExamId,
  storage: StorageStrategy = localStorageStrategy
): void {
  storage.remove(storageKey(examId));
}

/**
 * Clears progress for all registered exams.
 */
export function clearAllProgress(
  examIds: ExamId[],
  storage: StorageStrategy = localStorageStrategy
): void {
  for (const id of examIds) {
    clearProgress(id, storage);
  }
}

// Export types needed by consumers and tests
export type { StorageStrategy, ResultsSnapshot };
