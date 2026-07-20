// ============================================================
// ANDAMAN QUALIFICATION SERVICE — Phase 8.4
// Wrappers around the Phase 8.1 readiness and qualification
// engines. No modification to existing engine code.
// ============================================================

import type { ExamProfile, ReadinessReport } from "@/features/exam/types";
import { computeReadiness } from "@/features/exam/services/readinessEngine";
import { computeQualification } from "@/features/exam/services/qualificationEngine";
import type { AndamanScoreResult } from "./scoring";
import type { AndamanRules } from "./andamanRules";

export type { ReadinessReport };
export type {
  QualificationResult,
  QualificationStatus,
} from "@/features/exam/types";

// ----------------------------------------------------------------
// Snapshot bridge
// Maps AndamanScoreResult → the shape expected by shared engines
// ----------------------------------------------------------------

function toSnapshot(score: AndamanScoreResult) {
  return {
    wpm: score.netWPM,
    accuracy: score.accuracy,
    duration: score.minutesElapsed * 60,
    wordsTyped: score.grossCharacters / 5,
    charsTyped: score.grossCharacters,
    errors: score.errors,
    timestamp: new Date().toISOString(),
  };
}

// ----------------------------------------------------------------
// Public functions
// ----------------------------------------------------------------

/**
 * Computes an Andaman-specific readiness report from a session score.
 */
export function computeAndamanReadiness(
  score: AndamanScoreResult,
  profile: ExamProfile
): ReadinessReport {
  return computeReadiness(toSnapshot(score) as never, profile);
}

/**
 * Computes an Andaman qualification result from a session score.
 */
export function computeAndamanQualification(
  score: AndamanScoreResult,
  profile: ExamProfile
) {
  return computeQualification(toSnapshot(score) as never, profile);
}

/**
 * Returns a human-friendly readiness summary for UI consumption.
 * All values are pre-formatted strings ready for direct rendering.
 */
export function getAndamanReadinessSummary(
  score: AndamanScoreResult,
  rules: AndamanRules
): {
  requiredWpm: string;
  currentWpm: string;
  requiredAccuracy: string;
  currentAccuracy: string;
  wpmStatus: "above" | "below" | "met";
  accuracyStatus: "above" | "below" | "met";
  estimatedQualification: string;
  improvementNeeded: string[];
} {
  const wpmDelta = score.netWPM - rules.targetWpm;
  const accDelta = score.accuracy - rules.targetAccuracy;

  const wpmStatus =
    wpmDelta > 0 ? "above" : wpmDelta === 0 ? "met" : "below";
  const accuracyStatus =
    accDelta > 0 ? "above" : accDelta === 0 ? "met" : "below";

  const improvementNeeded: string[] = [];
  if (wpmDelta < 0)
    improvementNeeded.push(
      `Increase typing speed by ${Math.abs(wpmDelta)} WPM`
    );
  if (accDelta < 0)
    improvementNeeded.push(
      `Improve accuracy by ${Math.abs(accDelta).toFixed(1)}%`
    );

  const wpmScore = Math.min(100, Math.max(0, (score.netWPM / rules.targetWpm) * 100));
  const accScore = Math.min(100, Math.max(0, (score.accuracy / rules.targetAccuracy) * 100));
  const estimatedPct = Math.round((wpmScore + accScore) / 2);

  return {
    requiredWpm: `${rules.targetWpm} WPM`,
    currentWpm: `${score.netWPM} WPM`,
    requiredAccuracy: `${rules.targetAccuracy}%`,
    currentAccuracy: `${score.accuracy}%`,
    wpmStatus,
    accuracyStatus,
    estimatedQualification: `${estimatedPct}%`,
    improvementNeeded:
      improvementNeeded.length > 0
        ? improvementNeeded
        : ["Maintain your current speed and accuracy consistently."],
  };
}
