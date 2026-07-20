// ============================================================
// READINESS ENGINE — Phase 8.1
// Pure function: takes a ResultsSnapshot and an ExamProfile,
// returns a ReadinessReport. No side effects. Fully testable.
// ============================================================

import type { ResultsSnapshot, ExamProfile, ReadinessReport, ReadinessLevel } from "../types";
import {
  READINESS_THRESHOLDS,
} from "../constants";

/**
 * Computes a candidate's readiness relative to a specific exam profile.
 *
 * @param snapshot - The ResultsSnapshot from a completed typing session.
 * @param profile  - The ExamProfile defining the qualifying criteria.
 * @returns        A ReadinessReport with gaps, status, and improvement areas.
 */
export function computeReadiness(
  snapshot: ResultsSnapshot,
  profile: ExamProfile
): ReadinessReport {
  const currentWPM = snapshot.wpm;
  const currentAccuracy = snapshot.accuracy;

  const requiredWPM = profile.qualifyingSpeed;
  const requiredAccuracy = profile.qualifyingAccuracy;

  const wpmGap = currentWPM - requiredWPM;
  const accuracyGap = currentAccuracy - requiredAccuracy;

  // -----------------------------------------------
  // Compute overall readiness level
  // -----------------------------------------------
  const wpmMet = wpmGap >= READINESS_THRESHOLDS.READY_WPM_PERCENT;
  const accuracyMet = accuracyGap >= READINESS_THRESHOLDS.READY_ACCURACY_PERCENT;

  const wpmAlmost =
    !wpmMet && wpmGap >= -READINESS_THRESHOLDS.ALMOST_READY_WPM_DELTA;
  const accuracyAlmost =
    !accuracyMet && accuracyGap >= -READINESS_THRESHOLDS.ALMOST_READY_ACCURACY_DELTA;

  let overallReadiness: ReadinessLevel;

  if (wpmMet && accuracyMet) {
    overallReadiness = "ready";
  } else if (
    (wpmMet || wpmAlmost) &&
    (accuracyMet || accuracyAlmost)
  ) {
    overallReadiness = "almost_ready";
  } else {
    overallReadiness = "needs_practice";
  }

  // -----------------------------------------------
  // Compute specific improvement areas
  // -----------------------------------------------
  const areasToImprove: string[] = [];

  if (!wpmMet) {
    areasToImprove.push(
      `Increase typing speed by ${Math.abs(wpmGap).toFixed(1)} WPM (current: ${currentWPM} WPM, required: ${requiredWPM} WPM)`
    );
  }

  if (!accuracyMet) {
    areasToImprove.push(
      `Improve accuracy by ${Math.abs(accuracyGap).toFixed(1)}% (current: ${currentAccuracy.toFixed(1)}%, required: ${requiredAccuracy}%)`
    );
  }

  if (areasToImprove.length === 0) {
    areasToImprove.push("Maintain your current speed and accuracy consistently.");
  }

  // -----------------------------------------------
  // Estimated qualification probability (0-100)
  // Simple linear interpolation capped at 0–100.
  // -----------------------------------------------
  const wpmScore = Math.min(100, Math.max(0, (currentWPM / requiredWPM) * 100));
  const accuracyScore = Math.min(
    100,
    Math.max(0, (currentAccuracy / requiredAccuracy) * 100)
  );
  const estimatedQualification = Math.round((wpmScore + accuracyScore) / 2);

  return {
    currentWPM,
    requiredWPM,
    wpmGap,
    currentAccuracy,
    requiredAccuracy,
    accuracyGap,
    overallReadiness,
    areasToImprove,
    estimatedQualification,
  };
}
