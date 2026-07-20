import test from "node:test";
import assert from "node:assert/strict";
import { validateInput, isCharCorrect, getCharStates } from "../services/validation";

test("validation: correct input matches target exactly", () => {
  const result = validateInput("hello world", "hello world");
  assert.strictEqual(result.correctChars, 11);
  assert.strictEqual(result.incorrectChars, 0);
  assert.strictEqual(result.isPerfect, true);
});

test("validation: counts incorrect characters", () => {
  const result = validateInput("hellX world", "hello world");
  assert.strictEqual(result.correctChars, 10);
  assert.strictEqual(result.incorrectChars, 1);
  assert.strictEqual(result.isPerfect, false);
});

test("validation: counts extra characters as errors", () => {
  const result = validateInput("hello worldXXX", "hello world");
  assert.strictEqual(result.extraChars, 3);
  // extra chars are counted in incorrectChars
  assert.ok(result.incorrectChars >= 3);
});

test("validation: counts missing characters", () => {
  const result = validateInput("hello", "hello world");
  assert.strictEqual(result.missingChars, 6);
  assert.strictEqual(result.totalTypedChars, 5);
});

test("validation: empty typed string", () => {
  const result = validateInput("", "hello world");
  assert.strictEqual(result.correctChars, 0);
  assert.strictEqual(result.missingChars, 11);
  assert.strictEqual(result.accuracy, 0);
});

test("validation: empty target string", () => {
  const result = validateInput("hello", "");
  assert.strictEqual(result.extraChars, 5);
  assert.ok(result.incorrectChars >= 5);
});

test("validation: both empty strings", () => {
  const result = validateInput("", "");
  assert.strictEqual(result.correctChars, 0);
  assert.strictEqual(result.isPerfect, true);
});

test("validation: accuracy is 100 for perfect input", () => {
  const result = validateInput("abc", "abc");
  assert.strictEqual(result.accuracy, 100);
});

test("validation: isCharCorrect returns true at matching position", () => {
  assert.strictEqual(isCharCorrect("hello", "hello world", 0), true);
  assert.strictEqual(isCharCorrect("hello", "hello world", 4), true);
});

test("validation: isCharCorrect returns false for mismatch", () => {
  assert.strictEqual(isCharCorrect("hXllo", "hello world", 1), false);
});

test("validation: isCharCorrect returns false beyond typed length", () => {
  assert.strictEqual(isCharCorrect("hi", "hello", 4), false);
});

test("validation: getCharStates returns correct length", () => {
  const states = getCharStates("hel", "hello");
  assert.strictEqual(states.length, 5);
});

test("validation: getCharStates marks current position", () => {
  const states = getCharStates("hel", "hello");
  assert.strictEqual(states[3], "current");
});

test("validation: getCharStates marks pending after current", () => {
  const states = getCharStates("hel", "hello");
  assert.strictEqual(states[4], "pending");
});

test("validation: getCharStates marks correct and incorrect", () => {
  const states = getCharStates("hXllo", "hello");
  assert.strictEqual(states[0], "correct");
  assert.strictEqual(states[1], "incorrect");
});
