import test from "node:test";
import assert from "node:assert/strict";
import {
  computeGrossWPM,
  computeNetWPM,
  computeAccuracy,
  computeAndamanScore,
  getWeakAreas,
  getRecommendedPractice,
  getErrorBreakdown,
  getPrimaryWeakCategory,
} from "../services/scoring";

// ----------------------------------------------------------------
// computeGrossWPM
// ----------------------------------------------------------------

test("scoring: computeGrossWPM returns 0 for zero elapsed time", () => {
  assert.strictEqual(computeGrossWPM(100, 0), 0);
});

test("scoring: computeGrossWPM returns 0 for zero characters", () => {
  assert.strictEqual(computeGrossWPM(0, 60), 0);
});

test("scoring: computeGrossWPM calculates correct WPM (300 chars, 60s -> 60 WPM)", () => {
  assert.strictEqual(computeGrossWPM(300, 60), 60);
});

test("scoring: computeGrossWPM rounds to nearest integer", () => {
  // 312 chars / 5 = 62.4 words in 60s -> 62 WPM
  assert.strictEqual(computeGrossWPM(312, 60), 62);
  // 313 chars / 5 = 62.6 words in 60s -> 63 WPM
  assert.strictEqual(computeGrossWPM(313, 60), 63);
});

// ----------------------------------------------------------------
// computeNetWPM (1 word penalty per error)
// ----------------------------------------------------------------

test("scoring: computeNetWPM returns 0 for zero elapsed time", () => {
  assert.strictEqual(computeNetWPM(100, 0, 0), 0);
});

test("scoring: computeNetWPM subtracts exactly 1 word (5 chars) per error", () => {
  // Gross: 300 chars (60 words). Errors: 4 -> 4 words penalty. Net = 56 words in 1 min = 56 WPM.
  assert.strictEqual(computeNetWPM(300, 4, 60), 56);
});

test("scoring: computeNetWPM floors at 0 (never negative)", () => {
  // Gross: 10 chars (2 words). Errors: 10 -> 10 words penalty. Net = 0.
  assert.strictEqual(computeNetWPM(10, 10, 60), 0);
});

// ----------------------------------------------------------------
// computeAccuracy
// ----------------------------------------------------------------

test("scoring: computeAccuracy returns 100 for zero errors", () => {
  assert.strictEqual(computeAccuracy(100, 0), 100);
});

test("scoring: computeAccuracy returns 0 for zero gross chars", () => {
  assert.strictEqual(computeAccuracy(0, 0), 0);
});

test("scoring: computeAccuracy floors at 0 for more errors than chars", () => {
  assert.strictEqual(computeAccuracy(10, 15), 0);
});

test("scoring: computeAccuracy calculates ratio and rounds to 1 decimal", () => {
  // 9 errors in 100 chars -> 91%
  assert.strictEqual(computeAccuracy(100, 9), 91);
  // 1 error in 3 chars -> 66.7%
  assert.strictEqual(computeAccuracy(3, 1), 66.7);
});

// ----------------------------------------------------------------
// computeAndamanScore
// ----------------------------------------------------------------

test("scoring: computeAndamanScore qualifies with meeting WPM + accuracy", () => {
  const score = computeAndamanScore({
    grossCharacters: 200, // 40 WPM gross
    errors: 1, // -1 WPM -> 39 WPM net
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.netWPM, 39);
  assert.strictEqual(score.accuracy, 99.5);
  assert.strictEqual(score.qualifies, true);
});

test("scoring: computeAndamanScore does not qualify with low WPM", () => {
  const score = computeAndamanScore({
    grossCharacters: 150, // 30 WPM gross
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.qualifies, false);
});

test("scoring: computeAndamanScore does not qualify with low accuracy", () => {
  const score = computeAndamanScore({
    grossCharacters: 250, // 50 WPM gross
    errors: 30, // 12% error rate -> 88% accuracy
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 90,
  });
  assert.strictEqual(score.qualifies, false);
});

test("scoring: computeAndamanScore computes gaps correctly", () => {
  const score = computeAndamanScore({
    grossCharacters: 100, // 20 WPM
    errors: 10, // 90% accuracy
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 95,
  });
  // Net WPM = 20 gross - 10 penalty = 10 net. Gap = 10 - 35 = -25.
  assert.strictEqual(score.wpmGap, -25);
  assert.strictEqual(score.accuracyGap, -5);
});

// ----------------------------------------------------------------
// Error Breakdown (including longWordErrors)
// ----------------------------------------------------------------

test("scoring: getErrorBreakdown counts long word errors", () => {
  const target = "A veryyyyylongword here"; // 18 chars in word -> >8 chars
  const typed  = "A veryyyyylongxord here"; // 1 error inside the long word
  
  const breakdown = getErrorBreakdown(typed, target);
  assert.strictEqual(breakdown.longWordErrors, 1);
  assert.strictEqual(breakdown.totalErrors, 1);
});

test("scoring: getErrorBreakdown counts standard error types", () => {
  const target = "A 1 ,";
  const typed  = "a 2 ."; // Capital error, Number error, Punctuation error
  
  const breakdown = getErrorBreakdown(typed, target);
  assert.strictEqual(breakdown.capitalErrors, 1);
  assert.strictEqual(breakdown.numberErrors, 1);
  assert.strictEqual(breakdown.punctuationErrors, 1);
});

test("scoring: getPrimaryWeakCategory identifies dominant error type", () => {
  const target = "verylongword1 verylongword2 verylongword3";
  const typed  = "veryxongword1 veryxongword2 veryxongword3"; // 3 long word errors
  const breakdown = getErrorBreakdown(typed, target);
  assert.strictEqual(getPrimaryWeakCategory(breakdown), "Long Words");
});

// ----------------------------------------------------------------
// Feedback / Recommendations
// ----------------------------------------------------------------

test("scoring: getRecommendedPractice suggests weak_long_words for accuracy gaps", () => {
  const score = computeAndamanScore({
    grossCharacters: 200,
    errors: 10, // 95% accuracy
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 99, // -4% gap -> triggers accuracy recommendations
  });
  const modes = getRecommendedPractice(score);
  assert.ok(modes.includes("weak_long_words"));
  assert.ok(modes.includes("weak_punctuation"));
});

test("scoring: getWeakAreas returns positive message when qualifying", () => {
  const score = computeAndamanScore({
    grossCharacters: 300,
    errors: 0,
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 90,
  });
  const areas = getWeakAreas(score);
  assert.strictEqual(areas.length, 1);
  assert.ok(areas[0].includes("None"));
});
