// ============================================================
// QUALIFICATION ENGINE — Phase 8.1
// Pure function: takes a ResultsSnapshot and an ExamProfile,
// returns a QualificationResult. No side effects. Fully testable.
// ============================================================

import type {
  ResultsSnapshot,
  ExamProfile,
  QualificationResult,
  QualificationStatus,
} from "../types";
import { QUALIFICATION_THRESHOLDS } from "../constants";

/**
 * Determines whether a candidate qualifies for a specific exam.
 *
 * @param snapshot - The ResultsSnapshot from a completed typing session.
 * @param profile  - The ExamProfile defining the qualifying criteria.
 * @returns        A QualificationResult with status, details, and guidance.
 */
export function computeQualification(
  snapshot: ResultsSnapshot,
  profile: ExamProfile
): QualificationResult {
  const { wpm, accuracy } = snapshot;
  const { qualifyingSpeed, qualifyingAccuracy } = profile;

  const speedQualified = wpm >= qualifyingSpeed;
  const accuracyQualified = accuracy >= qualifyingAccuracy;

  const wpmShortfall = Math.max(0, qualifyingSpeed - wpm);
  const accuracyShortfall = Math.max(0, qualifyingAccuracy - accuracy);

  // -----------------------------------------------
  // Determine status
  // -----------------------------------------------
  let status: QualificationStatus;

  if (speedQualified && accuracyQualified) {
    status = "qualified";
  } else if (
    wpmShortfall <= QUALIFICATION_THRESHOLDS.NEARLY_READY_WPM_DELTA &&
    accuracyShortfall <= QUALIFICATION_THRESHOLDS.NEARLY_READY_ACCURACY_DELTA
  ) {
    status = "nearly_ready";
  } else {
    status = "needs_improvement";
  }

  // -----------------------------------------------
  // Produce human-readable next goal and guidance
  // -----------------------------------------------
  let nextGoal: string;
  let requiredImprovement: string;

  if (status === "qualified") {
    nextGoal = "Maintain consistency across multiple sessions.";
    requiredImprovement = "No improvement needed — you meet all qualifying criteria.";
  } else if (status === "nearly_ready") {
    const parts: string[] = [];
    if (wpmShortfall > 0) parts.push(`+${wpmShortfall.toFixed(1)} WPM`);
    if (accuracyShortfall > 0) parts.push(`+${accuracyShortfall.toFixed(1)}% accuracy`);
    nextGoal = `Reach ${parts.join(" and ")} to qualify.`;
    requiredImprovement = `You're very close! Focus on ${
      wpmShortfall > 0 && accuracyShortfall > 0
        ? "speed and accuracy"
        : wpmShortfall > 0
        ? "increasing speed"
        : "improving accuracy"
    } in your next sessions.`;
  } else {
    nextGoal = `Reach ${qualifyingSpeed} WPM at ${qualifyingAccuracy}% accuracy.`;
    const gaps: string[] = [];
    if (wpmShortfall > 0)
      gaps.push(`${wpmShortfall.toFixed(1)} WPM more speed`);
    if (accuracyShortfall > 0)
      gaps.push(`${accuracyShortfall.toFixed(1)}% more accuracy`);
    requiredImprovement = `You need ${gaps.join(" and ")} to meet the qualifying standard.`;
  }

  return {
    status,
    speedQualified,
    accuracyQualified,
    details: {
      wpmShortfall,
      accuracyShortfall,
    },
    nextGoal,
    requiredImprovement,
  };
}
