import test from "node:test";
import assert from "node:assert/strict";
import {
  computeAndamanQualification,
  getAndamanReadinessSummary,
} from "../services/qualification";
import { computeAndamanScore } from "../services/scoring";
import { getDefaultRules } from "../services/andamanRules";
import type { ExamProfile } from "@/features/exam/types";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function makeScore(
  grossChars: number,
  errors: number,
  elapsedSeconds: number,
  targetWpm = 35,
  targetAccuracy = 90
) {
  return computeAndamanScore({
    grossCharacters: grossChars,
    errors,
    elapsedSeconds,
    targetWpm,
    targetAccuracy,
  });
}

// Minimal ExamProfile for testing
const PROFILE_35WPM: ExamProfile = {
  id: "andaman_chsl",
  organization: "Andaman",
  exam: "CHSL",
  post: "LDC",
  language: "en",
  duration: 10,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general"],
  description: "Test profile",
};

// ----------------------------------------------------------------
// computeAndamanQualification
// ----------------------------------------------------------------

test("qualification: returns 'qualified' when both criteria met", () => {
  // 70 WPM, 100% accuracy -> well above 35 WPM / 90%
  const score = makeScore(700, 0, 60);
  const result = computeAndamanQualification(score, PROFILE_35WPM);
  assert.strictEqual(result.status, "qualified");
  assert.strictEqual(result.speedQualified, true);
  assert.strictEqual(result.accuracyQualified, true);
});

test("qualification: returns 'needs_improvement' for low WPM", () => {
  // 10 WPM - well below 35 target
  const score = makeScore(100, 0, 60);
  const result = computeAndamanQualification(score, PROFILE_35WPM);
  assert.strictEqual(result.speedQualified, false);
  assert.ok(
    result.status === "nearly_ready" || result.status === "needs_improvement"
  );
});

test("qualification: nextGoal is a non-empty string", () => {
  const score = makeScore(100, 5, 60);
  const result = computeAndamanQualification(score, PROFILE_35WPM);
  assert.ok(result.nextGoal.length > 0);
});

test("qualification: requiredImprovement is a non-empty string", () => {
  const score = makeScore(50, 0, 60);
  const result = computeAndamanQualification(score, PROFILE_35WPM);
  assert.ok(result.requiredImprovement.length > 0);
});

test("qualification: details.wpmShortfall is 0 when speed is met", () => {
  const score = makeScore(700, 0, 60);
  const result = computeAndamanQualification(score, PROFILE_35WPM);
  assert.strictEqual(result.details.wpmShortfall, 0);
});

// ----------------------------------------------------------------
// getAndamanReadinessSummary
// ----------------------------------------------------------------

test("readiness: returns 'above' wpmStatus when WPM exceeds target", () => {
  const score = makeScore(700, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.strictEqual(summary.wpmStatus, "above");
});

test("readiness: returns 'below' wpmStatus when WPM is under target", () => {
  const score = makeScore(50, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.strictEqual(summary.wpmStatus, "below");
});

test("readiness: returns 'met' when exactly on target", () => {
  // Target is 35 WPM. Need 175 net chars in 60s.
  const score = makeScore(175, 0, 60);
  const rules = getDefaultRules(); // targetWpm is 35
  const summary = getAndamanReadinessSummary(score, rules);
  assert.strictEqual(summary.wpmStatus, "met");
  assert.strictEqual(summary.accuracyStatus, "above"); // 100% vs 90%
});

test("readiness: requiredWpm is formatted with WPM suffix", () => {
  const score = makeScore(700, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.ok(summary.requiredWpm.includes("WPM"));
  assert.ok(summary.currentWpm.includes("WPM"));
});

test("readiness: estimatedQualification is a percentage string", () => {
  const score = makeScore(300, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.ok(summary.estimatedQualification.endsWith("%"));
});

test("readiness: improvementNeeded is non-empty array", () => {
  const score = makeScore(50, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.ok(summary.improvementNeeded.length > 0);
});

test("readiness: when qualifying, improvementNeeded has positive message", () => {
  const score = makeScore(700, 0, 60);
  const rules = getDefaultRules();
  const summary = getAndamanReadinessSummary(score, rules);
  assert.ok(summary.improvementNeeded.length > 0);
  // Should not say "Increase" or "Improve"
  const hasNegativeMessage = summary.improvementNeeded.some((m) =>
    m.startsWith("Increase") || m.startsWith("Improve")
  );
  assert.strictEqual(hasNegativeMessage, false);
});
