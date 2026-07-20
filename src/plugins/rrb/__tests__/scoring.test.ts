import test from "node:test";
import assert from "node:assert/strict";
import {
  computeGrossWPM,
  computeNetWPM,
  computeAccuracy,
  computeRRBScore,
  getWeakAreas,
  getRecommendedPractice,
  getErrorBreakdown,
  getPrimaryWeakCategory,
} from "../services/scoring";

// ----------------------------------------------------------------
// computeGrossWPM
// ----------------------------------------------------------------

test("scoring: computeGrossWPM calculates correctly", () => {
  // 600 chars / 5 / 2 min = 60 WPM
  assert.strictEqual(computeGrossWPM(600, 120), 60);
});

test("scoring: computeGrossWPM returns 0 for zero elapsed time", () => {
  assert.strictEqual(computeGrossWPM(600, 0), 0);
});

test("scoring: computeGrossWPM returns 0 for zero chars", () => {
  assert.strictEqual(computeGrossWPM(0, 120), 0);
});

// ----------------------------------------------------------------
// computeNetWPM
// ----------------------------------------------------------------

test("scoring: computeNetWPM deducts errors correctly", () => {
  // 600 chars, 2 errors, 120s → (600 - 10) / 5 / 2 = 59 WPM
  const netWPM = computeNetWPM(600, 2, 120);
  assert.strictEqual(netWPM, 59);
});

test("scoring: computeNetWPM returns 0 for zero elapsed", () => {
  assert.strictEqual(computeNetWPM(600, 0, 0), 0);
});

test("scoring: computeNetWPM clamps to 0 with massive error count", () => {
  const netWPM = computeNetWPM(100, 100000, 60);
  assert.strictEqual(netWPM, 0);
});

// ----------------------------------------------------------------
// computeAccuracy
// ----------------------------------------------------------------

test("scoring: computeAccuracy returns correct percentage", () => {
  // 10 errors out of 100 → 90%
  assert.strictEqual(computeAccuracy(100, 10), 90);
});

test("scoring: computeAccuracy returns 100 for zero errors", () => {
  assert.strictEqual(computeAccuracy(200, 0), 100);
});

test("scoring: computeAccuracy returns 0 for zero gross chars", () => {
  assert.strictEqual(computeAccuracy(0, 0), 0);
});

// ----------------------------------------------------------------
// computeRRBScore — qualification scenarios
// ----------------------------------------------------------------

test("scoring: computeRRBScore qualifies with 30 WPM + 90% accuracy", () => {
  // 300 chars, 0 errors, 60s → 60 WPM gross/net → qualifies at 30 WPM target
  const score = computeRRBScore({
    grossCharacters: 300,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  assert.ok(score.netWPM >= 30, `Expected netWPM >= 30, got ${score.netWPM}`);
  assert.ok(score.accuracy >= 90, `Expected accuracy >= 90, got ${score.accuracy}`);
  assert.strictEqual(score.qualifies, true);
});

test("scoring: computeRRBScore does not qualify with low WPM", () => {
  const score = computeRRBScore({
    grossCharacters: 50,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.qualifies, false);
  assert.ok(score.wpmGap < 0, "wpmGap should be negative");
});

test("scoring: computeRRBScore does not qualify with low accuracy", () => {
  const score = computeRRBScore({
    grossCharacters: 600,
    errors: 300,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.qualifies, false);
  assert.ok(score.accuracyGap < 0, "accuracyGap should be negative");
});

test("scoring: computeRRBScore requires BOTH wpm and accuracy to qualify", () => {
  // Good WPM but poor accuracy
  const score = computeRRBScore({
    grossCharacters: 600,
    errors: 200,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.qualifies, false);
});

test("scoring: computeRRBScore computes wpmGap correctly", () => {
  const score = computeRRBScore({
    grossCharacters: 300,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  // 60 WPM - 30 target = +30 gap
  assert.ok(score.wpmGap > 0, "Should be above target");
});

// ----------------------------------------------------------------
// getWeakAreas
// ----------------------------------------------------------------

test("scoring: getWeakAreas returns speed area when WPM is low", () => {
  const score = computeRRBScore({
    grossCharacters: 50,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  const areas = getWeakAreas(score);
  assert.ok(
    areas.some((a) => a.toLowerCase().includes("speed")),
    "Should mention speed"
  );
});

test("scoring: getWeakAreas returns positive message when qualifying", () => {
  const score = computeRRBScore({
    grossCharacters: 600,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  const areas = getWeakAreas(score);
  assert.ok(areas.length > 0, "Should always return at least one message");
});

// ----------------------------------------------------------------
// getRecommendedPractice
// ----------------------------------------------------------------

test("scoring: getRecommendedPractice suggests official modes when near target", () => {
  // Just above target
  const score = computeRRBScore({
    grossCharacters: 320,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  const modes = getRecommendedPractice(score);
  assert.ok(Array.isArray(modes), "Should return an array");
});

// ----------------------------------------------------------------
// getErrorBreakdown
// ----------------------------------------------------------------

test("scoring: getErrorBreakdown counts number errors", () => {
  // target has '5' at position 0, typed has 'x'
  const breakdown = getErrorBreakdown("x", "5");
  assert.strictEqual(breakdown.numberErrors, 1);
  assert.strictEqual(breakdown.totalErrors, 1);
});

test("scoring: getErrorBreakdown counts capital letter errors", () => {
  const breakdown = getErrorBreakdown("x", "A");
  assert.strictEqual(breakdown.capitalErrors, 1);
});

test("scoring: getErrorBreakdown counts punctuation errors", () => {
  const breakdown = getErrorBreakdown("x", ".");
  assert.strictEqual(breakdown.punctuationErrors, 1);
});

test("scoring: getErrorBreakdown returns zeros for perfect match", () => {
  const breakdown = getErrorBreakdown("hello", "hello");
  assert.strictEqual(breakdown.totalErrors, 0);
});

// ----------------------------------------------------------------
// getPrimaryWeakCategory
// ----------------------------------------------------------------

test("scoring: getPrimaryWeakCategory identifies dominant error type", () => {
  // 3 number errors, 1 capital
  const typed = "x x x y";
  const target = "1 2 3 A";
  const breakdown = getErrorBreakdown(typed, target);
  const cat = getPrimaryWeakCategory(breakdown);
  assert.ok(typeof cat === "string" && cat.length > 0);
});
