import test from "node:test";
import assert from "node:assert/strict";
import {
  computeGrossWPM,
  computeNetWPM,
  computeKPH,
  computeAccuracy,
  computeSSCScore,
  getWeakestArea,
  getStrongestArea,
} from "../services/scoring";

test("scoring: computeGrossWPM calculates correctly", () => {
  // 600 chars / 5 / 2 min = 60 WPM
  const wpm = computeGrossWPM(600, 120);
  assert.strictEqual(wpm, 60);
});

test("scoring: computeGrossWPM returns 0 for zero elapsed time", () => {
  assert.strictEqual(computeGrossWPM(600, 0), 0);
});

test("scoring: computeNetWPM deducts errors correctly", () => {
  // 600 chars, 2 errors, 120s = gross 60 WPM, penalty 2 words = 58 WPM adjusted
  // adjusted chars = 600 - (2 * 1 * 5) = 590, / 5 / 2 = 59 WPM
  const netWPM = computeNetWPM(600, 2, 120);
  assert.strictEqual(netWPM, 59);
});

test("scoring: computeNetWPM returns 0 for zero elapsed time", () => {
  assert.strictEqual(computeNetWPM(600, 0, 0), 0);
});

test("scoring: computeNetWPM clamps to 0 with excessive errors", () => {
  // Huge error count should result in 0, not negative
  const netWPM = computeNetWPM(100, 10000, 60);
  assert.strictEqual(netWPM, 0);
});

test("scoring: computeKPH calculates correctly", () => {
  // 8000 chars in 3600s = 8000 KPH
  const kph = computeKPH(8000, 3600);
  assert.strictEqual(kph, 8000);
});

test("scoring: computeAccuracy calculates correctly", () => {
  // 10 errors out of 100 chars = 90%
  const acc = computeAccuracy(100, 10);
  assert.strictEqual(acc, 90);
});

test("scoring: computeAccuracy returns 100 for zero errors", () => {
  assert.strictEqual(computeAccuracy(200, 0), 100);
});

test("scoring: computeAccuracy returns 0 for zero gross chars", () => {
  assert.strictEqual(computeAccuracy(0, 0), 0);
});

test("scoring: computeSSCScore qualifies when both criteria met", () => {
  // 35 WPM net, 90% accuracy → qualifies for ssc_cgl
  const score = computeSSCScore(
    { grossCharacters: 350, errors: 0, elapsedSeconds: 60, qualifyingType: "wpm" },
    35
  );
  assert.ok(score.netWPM >= 35, `Expected netWPM >= 35, got ${score.netWPM}`);
  assert.ok(score.accuracy >= 90, `Expected accuracy >= 90, got ${score.accuracy}`);
  assert.strictEqual(score.qualifies, true);
});

test("scoring: computeSSCScore does not qualify with low WPM", () => {
  const score = computeSSCScore(
    { grossCharacters: 100, errors: 0, elapsedSeconds: 60, qualifyingType: "wpm" },
    35
  );
  assert.strictEqual(score.qualifies, false);
});

test("scoring: computeSSCScore does not qualify with low accuracy", () => {
  const score = computeSSCScore(
    { grossCharacters: 350, errors: 200, elapsedSeconds: 60, qualifyingType: "wpm" },
    35
  );
  assert.strictEqual(score.qualifies, false);
});

test("scoring: computeSSCScore qualifies KPH mode at 8000 KPH", () => {
  // 8000 chars in 3600s with 0 errors
  const score = computeSSCScore(
    { grossCharacters: 8000, errors: 0, elapsedSeconds: 3600, qualifyingType: "keystrokes_per_hour" },
    27,
    8000
  );
  assert.strictEqual(score.qualifies, true);
});

test("scoring: getWeakestArea returns 'Typing Speed' when speed is below target", () => {
  const score = computeSSCScore(
    { grossCharacters: 100, errors: 0, elapsedSeconds: 60, qualifyingType: "wpm" },
    35
  );
  const weakest = getWeakestArea(score, 35);
  assert.strictEqual(weakest, "Typing Speed");
});

test("scoring: getStrongestArea returns when speed above target", () => {
  const score = computeSSCScore(
    { grossCharacters: 500, errors: 5, elapsedSeconds: 60, qualifyingType: "wpm" },
    35
  );
  const strongest = getStrongestArea(score, 35);
  assert.ok(["Typing Speed", "Accuracy"].includes(strongest));
});
