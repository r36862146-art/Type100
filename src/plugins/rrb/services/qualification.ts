// ============================================================
// RRB QUALIFICATION SERVICE — Phase 8.3
// RRB-flavored wrappers around the shared Phase 8.1 engines.
// Pure functions. No side effects.
// ============================================================

import type { ExamProfile, ReadinessReport } from "@/features/exam/types";
import { computeReadiness } from "@/features/exam/services/readinessEngine";
import { computeQualification } from "@/features/exam/services/qualificationEngine";
import type { RRBScoreResult } from "./scoring";
import type { RRBRules } from "./rrbRules";

// Re-export shared types for convenience
export type { ReadinessReport };
export type {
  QualificationResult,
  QualificationStatus,
} from "@/features/exam/types";

// ----------------------------------------------------------------
// RRB Readiness — wraps the Phase 8.1 readiness engine
// ----------------------------------------------------------------

/**
 * Computes an RRB-specific readiness report from a completed session score.
 * Bridges RRBScoreResult into the shared readinessEngine signature.
 *
 * @param score   - The RRBScoreResult from a completed typing session.
 * @param profile - The ExamProfile for the target RRB post.
 * @returns       ReadinessReport with gaps, level, and improvement areas.
 */
export function computeRRBReadiness(
  score: RRBScoreResult,
  profile: ExamProfile
): ReadinessReport {
  // Map RRBScoreResult → minimal ResultsSnapshot shape for the shared engine
  const snapshot = {
    wpm: score.netWPM,
    accuracy: score.accuracy,
    // Provide required fields with safe defaults; engines only use wpm + accuracy
    duration: score.minutesElapsed * 60,
    wordsTyped: score.grossCharacters / 5,
    charsTyped: score.grossCharacters,
    errors: score.errors,
    timestamp: new Date().toISOString(),
  };

  return computeReadiness(snapshot as never, profile);
}

/**
 * Computes an RRB qualification result from a completed session score.
 *
 * @param score   - The RRBScoreResult from a completed typing session.
 * @param profile - The ExamProfile for the target RRB post.
 */
export function computeRRBQualification(
  score: RRBScoreResult,
  profile: ExamProfile
) {
  const snapshot = {
    wpm: score.netWPM,
    accuracy: score.accuracy,
    duration: score.minutesElapsed * 60,
    wordsTyped: score.grossCharacters / 5,
    charsTyped: score.grossCharacters,
    errors: score.errors,
    timestamp: new Date().toISOString(),
  };

  return computeQualification(snapshot as never, profile);
}

// ----------------------------------------------------------------
// RRB-specific readiness display helpers
// ----------------------------------------------------------------

/**
 * Returns an RRB-flavored readiness summary object for UI consumption.
 * All values are pre-formatted strings for direct rendering.
 */
export function getRRBReadinessSummary(
  score: RRBScoreResult,
  rules: RRBRules
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
  if (wpmDelta < 0) {
    improvementNeeded.push(
      `Increase typing speed by ${Math.abs(wpmDelta)} WPM`
    );
  }
  if (accDelta < 0) {
    improvementNeeded.push(
      `Improve accuracy by ${Math.abs(accDelta).toFixed(1)}%`
    );
  }

  // Simple linear qualification estimate
  const wpmScore = Math.min(
    100,
    Math.max(0, (score.netWPM / rules.targetWpm) * 100)
  );
  const accScore = Math.min(
    100,
    Math.max(0, (score.accuracy / rules.targetAccuracy) * 100)
  );
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
