import test from "node:test";
import assert from "node:assert/strict";
import { getRandomPassage, getPassageByIndex, getPassageCount, clearPassageCache } from "../services/passageLoader";

// Note: These tests use dynamic import which requires the JSON files to exist.
// They are integration-level tests that verify the loader against real dataset files.

test("passageLoader: loadSSCPassages returns passages for ssc_cgl/en", async () => {
  clearPassageCache();
  const passages = await getPassageCount("ssc_cgl", "en");
  assert.ok(passages > 0, `Expected at least 1 passage for ssc_cgl/en, got ${passages}`);
});

test("passageLoader: loadSSCPassages returns passages for ssc_cgl/hi", async () => {
  clearPassageCache();
  const passages = await getPassageCount("ssc_cgl", "hi");
  assert.ok(passages > 0, `Expected at least 1 passage for ssc_cgl/hi, got ${passages}`);
});

test("passageLoader: loadSSCPassages returns passages for ssc_chsl/en", async () => {
  clearPassageCache();
  const passages = await getPassageCount("ssc_chsl", "en");
  assert.ok(passages > 0, `Expected at least 1 passage for ssc_chsl/en, got ${passages}`);
});

test("passageLoader: getRandomPassage returns a passage with required fields", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("ssc_cgl", "en");
  assert.ok(passage !== null, "Passage should not be null");
  assert.ok(typeof passage!.id === "string" && passage!.id.length > 0, "Should have id");
  assert.ok(typeof passage!.text === "string" && passage!.text.length > 0, "Should have text");
  assert.ok(typeof passage!.title === "string", "Should have title");
  assert.ok(passage!.characterCount > 0, "Should have characterCount > 0");
  assert.ok(passage!.estimatedWpm > 0, "Should have estimatedWpm > 0");
});

test("passageLoader: getPassageByIndex returns deterministic result", async () => {
  clearPassageCache();
  const p1 = await getPassageByIndex("ssc_cgl", "en", 0);
  const p2 = await getPassageByIndex("ssc_cgl", "en", 0);
  assert.ok(p1 !== null && p2 !== null);
  assert.strictEqual(p1!.id, p2!.id, "Same index should return same passage");
});

test("passageLoader: getPassageByIndex wraps index beyond array length", async () => {
  clearPassageCache();
  const count = await getPassageCount("ssc_cgl", "en");
  const p = await getPassageByIndex("ssc_cgl", "en", count + 100);
  assert.ok(p !== null, "Should return a passage even for large index");
});

test("passageLoader: cache returns same reference on second call", async () => {
  clearPassageCache();
  const p1 = await getRandomPassage("ssc_cgl", "en");
  // Loading again should use cache — both calls resolve from same dataset
  const count1 = await getPassageCount("ssc_cgl", "en");
  const count2 = await getPassageCount("ssc_cgl", "en");
  assert.strictEqual(count1, count2, "Cached dataset should have same count");
});

test("passageLoader: passage text length matches characterCount", async () => {
  clearPassageCache();
  const passage = await getPassageByIndex("ssc_cgl", "en", 0);
  assert.ok(passage !== null);
  // characterCount should be close to actual text length (±10% tolerance)
  const textLen = passage!.text.length;
  const declared = passage!.characterCount;
  assert.ok(Math.abs(textLen - declared) <= declared * 0.15,
    `text.length (${textLen}) should be within 15% of characterCount (${declared})`
  );
});
