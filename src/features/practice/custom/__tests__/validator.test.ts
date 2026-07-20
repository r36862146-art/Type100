import test from "node:test";
import assert from "node:assert";
import { validateCustomText, MIN_LENGTH, MAX_LENGTH } from "../services/validator";

test("validator: valid text passes", () => {
  const result = validateCustomText("This is a perfectly valid text of reasonable length.");
  assert.strictEqual(result.isValid, true);
  assert.strictEqual(result.errors.length, 0);
});

test("validator: empty text fails", () => {
  const result = validateCustomText("   ");
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes("empty")), true);
});

test("validator: min length fails", () => {
  const result = validateCustomText("short");
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes(`least ${MIN_LENGTH}`)), true);
});

test("validator: max length fails", () => {
  const longText = "a".repeat(MAX_LENGTH + 1);
  const result = validateCustomText(longText);
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes(`exceed ${MAX_LENGTH}`)), true);
});

test("validator: invalid control characters fail", () => {
  const result = validateCustomText("Here is some text \x07 with a bell char.");
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes("invalid control")), true);
});

test("validator: excessive whitespace fails", () => {
  const result = validateCustomText("Here is some           text with too many spaces.");
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes("excessive consecutive spaces")), true);
});

test("validator: consecutive blank lines fails", () => {
  const result = validateCustomText("Line 1\n\n\nLine 2");
  assert.strictEqual(result.isValid, false);
  assert.strictEqual(result.errors.some(e => e.includes("too many consecutive blank lines")), true);
});
