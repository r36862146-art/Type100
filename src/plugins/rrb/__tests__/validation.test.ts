import test from "node:test";
import assert from "node:assert/strict";
import {
  validateInput,
  isCharCorrect,
  getCharStates,
  computeProgress,
} from "../services/validation";

// ----------------------------------------------------------------
// validateInput — basic correctness
// ----------------------------------------------------------------

test("validation: perfect match returns all correct", () => {
  const result = validateInput("hello", "hello");
  assert.strictEqual(result.correctChars, 5);
  assert.strictEqual(result.incorrectChars, 0);
  assert.strictEqual(result.isPerfect, true);
  assert.strictEqual(result.accuracy, 100);
});

test("validation: empty typed returns zeros", () => {
  const result = validateInput("", "hello world");
  assert.strictEqual(result.correctChars, 0);
  assert.strictEqual(result.incorrectChars, 0);
  assert.strictEqual(result.totalTypedChars, 0);
  assert.strictEqual(result.missingChars, 11);
});

test("validation: single incorrect char counted as error", () => {
  const result = validateInput("xhello", "ahello");
  assert.strictEqual(result.incorrectChars, 1);
  assert.strictEqual(result.correctChars, 5);
});

test("validation: extra chars beyond target counted as errors", () => {
  const result = validateInput("helloXXX", "hello");
  assert.strictEqual(result.extraChars, 3);
  assert.ok(result.incorrectChars >= 3, "Extra chars should count as errors");
});

test("validation: missing chars calculated correctly", () => {
  const result = validateInput("hel", "hello");
  assert.strictEqual(result.missingChars, 2);
  assert.strictEqual(result.totalTargetChars, 5);
});

// ----------------------------------------------------------------
// validateInput — accuracy
// ----------------------------------------------------------------

test("validation: accuracy is 100 for perfect match", () => {
  const result = validateInput("Hello", "Hello");
  assert.strictEqual(result.accuracy, 100);
});

test("validation: accuracy reflects error ratio", () => {
  // 1 error out of 5 chars = 80%
  const result = validateInput("xello", "hello");
  assert.ok(result.accuracy < 100, "Accuracy should be < 100 with errors");
  assert.ok(result.accuracy >= 60, "Accuracy should not be zero with 1 error in 5");
});

test("validation: accuracy for empty typed is 0", () => {
  const result = validateInput("", "hello");
  assert.strictEqual(result.accuracy, 0);
});

// ----------------------------------------------------------------
// validateInput — isPerfect flag
// ----------------------------------------------------------------

test("validation: isPerfect is false with extra chars", () => {
  const result = validateInput("helloX", "hello");
  assert.strictEqual(result.isPerfect, false);
});

test("validation: isPerfect is false with missing chars", () => {
  const result = validateInput("hell", "hello");
  assert.strictEqual(result.isPerfect, false);
});

// ----------------------------------------------------------------
// isCharCorrect
// ----------------------------------------------------------------

test("validation: isCharCorrect returns true for matching position", () => {
  assert.strictEqual(isCharCorrect("hello", "hello", 0), true);
  assert.strictEqual(isCharCorrect("hello", "hello", 4), true);
});

test("validation: isCharCorrect returns false for mismatch", () => {
  assert.strictEqual(isCharCorrect("xello", "hello", 0), false);
});

test("validation: isCharCorrect returns false for out-of-bounds typed", () => {
  assert.strictEqual(isCharCorrect("hi", "hello", 3), false);
});

test("validation: isCharCorrect returns false for out-of-bounds target", () => {
  assert.strictEqual(isCharCorrect("hello world", "hello", 6), false);
});

// ----------------------------------------------------------------
// getCharStates
// ----------------------------------------------------------------

test("validation: getCharStates returns correct states", () => {
  const states = getCharStates("hel", "hello");
  assert.strictEqual(states[0], "correct");
  assert.strictEqual(states[1], "correct");
  assert.strictEqual(states[2], "correct");
  assert.strictEqual(states[3], "current");
  assert.strictEqual(states[4], "pending");
});

test("validation: getCharStates marks incorrect characters", () => {
  const states = getCharStates("xello", "hello");
  assert.strictEqual(states[0], "incorrect");
  assert.strictEqual(states[1], "correct");
});

test("validation: getCharStates for empty typed marks first char as current", () => {
  const states = getCharStates("", "hello");
  assert.strictEqual(states[0], "current");
  assert.ok(states.slice(1).every((s) => s === "pending"), "Rest should be pending");
});

test("validation: getCharStates length equals target length", () => {
  const target = "Hello, World!";
  const states = getCharStates("Hello", target);
  assert.strictEqual(states.length, target.length);
});

// ----------------------------------------------------------------
// computeProgress
// ----------------------------------------------------------------

test("validation: computeProgress returns 0 for empty typed", () => {
  assert.strictEqual(computeProgress("", "hello world"), 0);
});

test("validation: computeProgress returns 100 for complete passage", () => {
  assert.strictEqual(computeProgress("hello", "hello"), 100);
});

test("validation: computeProgress returns correct intermediate value", () => {
  const progress = computeProgress("hello", "hello world");
  assert.ok(progress > 0 && progress < 100, `Expected between 0 and 100, got ${progress}`);
});

test("validation: computeProgress returns 0 for empty target", () => {
  assert.strictEqual(computeProgress("anything", ""), 0);
});

test("validation: computeProgress clamps to 100 for over-typed", () => {
  const progress = computeProgress("hello world extra", "hello world");
  assert.strictEqual(progress, 100);
});
