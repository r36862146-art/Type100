import test from "node:test";
import assert from "node:assert/strict";
import {
  getRandomPassage,
  getPassageByIndex,
  getPassageCount,
  getPassagesByCategory,
  clearPassageCache,
  loadAndamanPassages,
} from "../services/passageLoader";

// ----------------------------------------------------------------
// loadAndamanPassages — counts
// ----------------------------------------------------------------

test("passageLoader: loads passages for andaman_chsl/en", async () => {
  clearPassageCache();
  const count = await getPassageCount("andaman_chsl", "en");
  assert.strictEqual(count, 5); // We wrote 5 in the JSON
});

test("passageLoader: loads passages for andaman_chsl/hi", async () => {
  clearPassageCache();
  const count = await getPassageCount("andaman_chsl", "hi");
  assert.strictEqual(count, 5);
});

test("passageLoader: loads passages for andaman_mts/en", async () => {
  clearPassageCache();
  const count = await getPassageCount("andaman_mts", "en");
  assert.strictEqual(count, 5);
});

// ----------------------------------------------------------------
// getRandomPassage — validation
// ----------------------------------------------------------------

test("passageLoader: getRandomPassage returns valid AndamanPassage shape", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("andaman_chsl", "en");
  assert.ok(passage !== null);
  assert.ok(typeof passage!.id === "string");
  assert.ok(typeof passage!.text === "string");
  assert.ok(typeof passage!.title === "string");
  assert.ok(typeof passage!.topic === "string", "Should have topic field"); // The new Andaman field
  assert.ok(passage!.characterCount > 0);
  assert.ok(passage!.estimatedWpm === 35, "CHSL English is 35 WPM");
  assert.strictEqual(passage!.language, "en");
});

test("passageLoader: MTS passage returns 25 WPM target", async () => {
  clearPassageCache();
  const passage = await getRandomPassage("andaman_mts", "en");
  assert.ok(passage !== null);
  assert.strictEqual(passage!.estimatedWpm, 25);
  assert.strictEqual(passage!.difficulty, "easy"); // MTS passages are easy
});

// ----------------------------------------------------------------
// getPassageByIndex
// ----------------------------------------------------------------

test("passageLoader: getPassageByIndex wraps index correctly", async () => {
  clearPassageCache();
  const p1 = await getPassageByIndex("andaman_chsl", "en", 0);
  const p2 = await getPassageByIndex("andaman_chsl", "en", 5); // We have 5, so 5 wraps to 0
  assert.ok(p1 !== null && p2 !== null);
  assert.strictEqual(p1!.id, p2!.id);
});

// ----------------------------------------------------------------
// getPassagesByCategory
// ----------------------------------------------------------------

test("passageLoader: getPassagesByCategory returns filtered subset", async () => {
  clearPassageCache();
  const passages = await getPassagesByCategory("andaman_chsl", "en", "government");
  assert.ok(passages.length > 0);
  assert.ok(passages.every(p => p.category === "government"));
});

test("passageLoader: getPassagesByCategory falls back to all if none found", async () => {
  clearPassageCache();
  // We didn't add any "technology" category to MTS
  const passages = await getPassagesByCategory("andaman_mts", "en", "technology");
  assert.strictEqual(passages.length, 5); // Should return all 5 instead of empty
});

// ----------------------------------------------------------------
// Caching
// ----------------------------------------------------------------

test("passageLoader: cache returns consistent count on second call", async () => {
  clearPassageCache();
  const count1 = await getPassageCount("andaman_chsl", "en");
  const count2 = await getPassageCount("andaman_chsl", "en");
  assert.strictEqual(count1, count2);
});

// ----------------------------------------------------------------
// Fallback for unknown exam
// ----------------------------------------------------------------

test("passageLoader: unknown examId falls back to CHSL English", async () => {
  clearPassageCache();
  const passages = await loadAndamanPassages("unknown_exam" as never, "en");
  assert.strictEqual(passages.length, 5); // CHSL English has 5
  assert.strictEqual(passages[0].exam, "andaman_chsl");
});
