import test from "node:test";
import assert from "node:assert";
import { normalizeCustomText } from "../services/normalizer";

test("normalizer: handles empty input", () => {
  assert.strictEqual(normalizeCustomText(""), "");
});

test("normalizer: normalizes line endings", () => {
  const result = normalizeCustomText("Line 1\r\nLine 2\rLine 3");
  assert.strictEqual(result, "Line 1\nLine 2\nLine 3");
});

test("normalizer: trims edges but preserves internal formatting", () => {
  const input = "   \n  Line 1  \n  Line 2\n   ";
  const result = normalizeCustomText(input);
  // Expects leading/trailing of the whole block trimmed. 
  // Line 1 trailing spaces are removed.
  assert.strictEqual(result, "Line 1\n  Line 2");
});

test("normalizer: reduces excessive blank lines", () => {
  const input = "Line 1\n\n\n\nLine 2";
  const result = normalizeCustomText(input);
  assert.strictEqual(result, "Line 1\n\nLine 2");
});
