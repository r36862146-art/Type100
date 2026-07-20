import test from "node:test";
import assert from "node:assert/strict";
import {
  getRandomPassage,
  getPassageByIndex,
  getPassageCount,
  clearPassageCache,
  loadRRBPassages,
} from "../services/passageLoader";

// ----------------------------------------------------------------
// loadRRBPassages — basic counts
// ----------------------------------------------------------------

test("passageLoader: loads passages for rrb_ntpc/en", async () => {
  clearPassageCache();
  const count = await getPassageCount("rrb_ntpc", "en");
  assert.ok(count > 0, `Expected >= 1 passage for rrb_ntpc/en, got ${count}`);
});

test("passageLoader: loads passages for rrb_ntpc/hi", async () => {
  clearPassageCache();
  const count = await getPassageCount("rrb_ntpc", "hi");
  assert.ok(count > 0, `Expected >= 1 passage for rrb_ntpc/hi, got ${count}`);
});

test("passageLoader: loads passages for rrb_typing/en", async () => {
  clearPassageCache();
  const count = await getPassageCount("rrb_typing", "en");
  assert.ok(count > 0, `Expected >= 1 passage for rrb_typing/en, got ${count}`);
});

// ----------------------------------------------------------------
// getRandomPassage — field validation
// ----------------------------------------------------------------

test("passageLoader: getRandomPassage returns valid RRBPassage shape for ntpc/en", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("rrb_ntpc", "en");
  assert.ok(passage !== null, "Passage should not be null");
  assert.ok(typeof passage!.id === "string" && passage!.id.length > 0, "Should have id");
  assert.ok(typeof passage!.text === "string" && passage!.text.length > 0, "Should have text");
  assert.ok(typeof passage!.title === "string" && passage!.title.length > 0, "Should have title");
  assert.ok(passage!.characterCount > 0, "Should have characterCount > 0");
  assert.ok(passage!.estimatedWpm > 0, "Should have estimatedWpm > 0");
  assert.ok(passage!.estimatedDuration > 0, "Should have estimatedDuration > 0");
  assert.ok(["en", "hi"].includes(passage!.language), "Language should be en or hi");
  assert.ok(
    ["easy", "medium", "hard"].includes(passage!.difficulty),
    "Difficulty should be easy/medium/hard"
  );
});

test("passageLoader: getRandomPassage returns valid passage for ntpc/hi", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("rrb_ntpc", "hi");
  assert.ok(passage !== null, "Hindi passage should not be null");
  assert.strictEqual(passage!.language, "hi", "Language should be hi");
});

test("passageLoader: getRandomPassage returns valid passage for rrb_typing/en", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("rrb_typing", "en");
  assert.ok(passage !== null, "Typing post passage should not be null");
  assert.ok(passage!.estimatedWpm >= 30, "rrb_typing should target higher WPM");
});

// ----------------------------------------------------------------
// getPassageByIndex — determinism and wrapping
// ----------------------------------------------------------------

test("passageLoader: getPassageByIndex returns deterministic result", async () => {
  clearPassageCache();
  const p1 = await getPassageByIndex("rrb_ntpc", "en", 0);
  const p2 = await getPassageByIndex("rrb_ntpc", "en", 0);
  assert.ok(p1 !== null && p2 !== null, "Both calls should return a passage");
  assert.strictEqual(p1!.id, p2!.id, "Same index should return same passage");
});

test("passageLoader: getPassageByIndex wraps index beyond array length", async () => {
  clearPassageCache();
  const count = await getPassageCount("rrb_ntpc", "en");
  const passage = await getPassageByIndex("rrb_ntpc", "en", count + 500);
  assert.ok(passage !== null, "Should return a passage even for large index");
});

// ----------------------------------------------------------------
// Cache behaviour
// ----------------------------------------------------------------

test("passageLoader: cache returns consistent count on second call", async () => {
  clearPassageCache();
  const count1 = await getPassageCount("rrb_ntpc", "en");
  const count2 = await getPassageCount("rrb_ntpc", "en");
  assert.strictEqual(count1, count2, "Cached dataset should have same count");
});

test("passageLoader: clearPassageCache triggers fresh load", async () => {
  // First load
  const count1 = await getPassageCount("rrb_ntpc", "en");
  // Clear + reload
  clearPassageCache();
  const count2 = await getPassageCount("rrb_ntpc", "en");
  assert.strictEqual(count1, count2, "Fresh load should have same data");
});

// ----------------------------------------------------------------
// Character count integrity
// ----------------------------------------------------------------

test("passageLoader: characterCount is within 15% of actual text.length", async () => {
  clearPassageCache();
  const passage = await getPassageByIndex("rrb_ntpc", "en", 0);
  assert.ok(passage !== null);
  const textLen = passage!.text.length;
  const declared = passage!.characterCount;
  assert.ok(
    Math.abs(textLen - declared) <= declared * 0.15,
    `text.length (${textLen}) should be within 15% of characterCount (${declared})`
  );
});

// ----------------------------------------------------------------
// Fallback for unknown exam
// ----------------------------------------------------------------

test("passageLoader: unknown examId falls back gracefully", async () => {
  clearPassageCache();
  // andaman_chsl is not an RRB exam — loader should fall back rather than crash
  const passages = await loadRRBPassages("andaman_chsl" as never, "en");
  assert.ok(Array.isArray(passages), "Should return an array (possibly empty or fallback)");
});
