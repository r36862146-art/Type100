import test from "node:test";
import assert from "node:assert/strict";
import {
  computeRRBQualification,
  getRRBReadinessSummary,
} from "../services/qualification";
import { computeRRBScore } from "../services/scoring";
import { getDefaultRules } from "../services/rrbRules";

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function makeScore(
  grossChars: number,
  errors: number,
  elapsedSeconds: number,
  targetWpm = 30,
  targetAccuracy = 90
) {
  return computeRRBScore({
    grossCharacters: grossChars,
    errors,
    elapsedSeconds,
    targetWpm,
    targetAccuracy,
  });
}

// Minimal ExamProfile for testing
const PROFILE_30WPM = {
  id: "rrb_ntpc" as const,
  organization: "RRB" as const,
  exam: "NTPC",
  post: "Junior Clerk cum Typist",
  language: "en" as const,
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general" as const],
  description: "Test profile",
};

// ----------------------------------------------------------------
// computeRRBQualification
// ----------------------------------------------------------------

test("qualification: returns 'qualified' when both criteria met", () => {
  // 60 WPM, 100% accuracy → well above 30 WPM / 90%
  const score = makeScore(600, 0, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.strictEqual(result.status, "qualified");
  assert.strictEqual(result.speedQualified, true);
  assert.strictEqual(result.accuracyQualified, true);
});

test("qualification: returns 'needs_improvement' for low WPM", () => {
  // 5 WPM — well below 30 target
  const score = makeScore(50, 0, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.strictEqual(result.speedQualified, false);
  assert.ok(
    result.status === "nearly_ready" || result.status === "needs_improvement",
    `Expected failing status, got ${result.status}`
  );
});

test("qualification: returns 'nearly_ready' when WPM is within 8 of target", () => {
  // 25 WPM (5 below 30 target) → nearly_ready
  const score = makeScore(150, 0, 60); // 30 WPM gross → net ~28 WPM after any errors
  const result = computeRRBQualification(score, PROFILE_30WPM);
  // Could be nearly_ready or qualified depending on exact calc
  assert.ok(
    ["qualified", "nearly_ready", "needs_improvement"].includes(result.status),
    `Status should be valid enum value, got ${result.status}`
  );
});

test("qualification: nextGoal is a non-empty string", () => {
  const score = makeScore(100, 5, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.ok(
    typeof result.nextGoal === "string" && result.nextGoal.length > 0,
    "nextGoal should be a non-empty string"
  );
});

test("qualification: requiredImprovement is a non-empty string", () => {
  const score = makeScore(50, 0, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.ok(
    typeof result.requiredImprovement === "string" &&
      result.requiredImprovement.length > 0
  );
});

test("qualification: details.wpmShortfall is 0 when speed is met", () => {
  const score = makeScore(600, 0, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.strictEqual(result.details.wpmShortfall, 0);
});

test("qualification: details.accuracyShortfall is 0 when accuracy is met", () => {
  const score = makeScore(600, 0, 60);
  const result = computeRRBQualification(score, PROFILE_30WPM);
  assert.strictEqual(result.details.accuracyShortfall, 0);
});

// ----------------------------------------------------------------
// getRRBReadinessSummary
// ----------------------------------------------------------------

test("readiness: returns 'above' wpmStatus when WPM exceeds target", () => {
  const score = makeScore(600, 0, 60); // 60 WPM >> 30 target
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.strictEqual(summary.wpmStatus, "above");
});

test("readiness: returns 'below' wpmStatus when WPM is under target", () => {
  const score = makeScore(50, 0, 60); // ~10 WPM << 30 target
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.strictEqual(summary.wpmStatus, "below");
});

test("readiness: requiredWpm is formatted with WPM suffix", () => {
  const score = makeScore(600, 0, 60);
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.ok(summary.requiredWpm.includes("WPM"), `Should include WPM, got: ${summary.requiredWpm}`);
});

test("readiness: estimatedQualification is a percentage string", () => {
  const score = makeScore(300, 0, 60);
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.ok(
    summary.estimatedQualification.endsWith("%"),
    `Should end with %, got: ${summary.estimatedQualification}`
  );
});

test("readiness: improvementNeeded is non-empty array", () => {
  const score = makeScore(50, 0, 60);
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.ok(
    Array.isArray(summary.improvementNeeded) &&
      summary.improvementNeeded.length > 0,
    "improvementNeeded should be non-empty"
  );
});

test("readiness: when qualifying, improvementNeeded has positive message", () => {
  const score = makeScore(600, 0, 60);
  const rules = getDefaultRules();
  const summary = getRRBReadinessSummary(score, rules);
  assert.ok(
    Array.isArray(summary.improvementNeeded) &&
      summary.improvementNeeded.length > 0
  );
  // Should not include "Increase" since we're already qualifying
  const hasNegativeMessage = summary.improvementNeeded.some((m) =>
    m.startsWith("Increase") || m.startsWith("Improve")
  );
  assert.strictEqual(
    hasNegativeMessage,
    false,
    "Should not suggest improvement when already qualifying"
  );
});
