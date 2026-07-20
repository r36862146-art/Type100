import test from "node:test";
import assert from "node:assert/strict";
import {
  validateInput,
  isCharCorrect,
  getCharStates,
  computeProgress,
} from "../services/validation";

// ----------------------------------------------------------------
// validateInput
// ----------------------------------------------------------------

test("validation: perfect match returns all correct", () => {
  const result = validateInput("hello", "hello");
  assert.strictEqual(result.correctChars, 5);
  assert.strictEqual(result.incorrectChars, 0);
  assert.strictEqual(result.extraChars, 0);
  assert.strictEqual(result.missingChars, 0);
  assert.strictEqual(result.isPerfect, true);
  assert.strictEqual(result.accuracy, 100);
});

test("validation: empty typed returns zeros", () => {
  const result = validateInput("", "hello world");
  assert.strictEqual(result.correctChars, 0);
  assert.strictEqual(result.incorrectChars, 0);
  assert.strictEqual(result.totalTypedChars, 0);
  assert.strictEqual(result.missingChars, 11);
  assert.strictEqual(result.accuracy, 0);
});

test("validation: single incorrect char counted as error", () => {
  const result = validateInput("xello", "hello");
  assert.strictEqual(result.incorrectChars, 1);
  assert.strictEqual(result.correctChars, 4);
});

test("validation: extra chars beyond target counted as errors", () => {
  const result = validateInput("helloXXX", "hello");
  assert.strictEqual(result.extraChars, 3);
  assert.strictEqual(result.incorrectChars, 3);
  assert.strictEqual(result.correctChars, 5);
});

test("validation: accuracy reflects error ratio", () => {
  const result = validateInput("xello", "hello");
  assert.strictEqual(result.accuracy, 80); // 4/5 correct
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

test("validation: computeProgress returns 0 for empty target", () => {
  assert.strictEqual(computeProgress("anything", ""), 0);
});

test("validation: computeProgress clamps to 100 for over-typed", () => {
  assert.strictEqual(computeProgress("hello world extra", "hello world"), 100);
});
