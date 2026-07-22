import test from "node:test";
import assert from "node:assert/strict";
import {
  getProgress,
  recordAttempt,
  getBestWpm,
  getAverageWpm,
  clearProgress,
} from "../services/progressService";
import type { ResultsSnapshot, StorageStrategy } from "../services/progressService";

// ----------------------------------------------------------------
// In-memory storage strategy for testing (no DOM/localStorage)
// ----------------------------------------------------------------
function makeMemoryStorage(): StorageStrategy {
  const store = new Map<string, string>();
  return {
    get: (key) => store.get(key) ?? null,
    set: (key, value) => store.set(key, value),
    remove: (key) => store.delete(key),
  };
}

function makeSnapshot(wpm: number, accuracy: number): ResultsSnapshot {
  return {
    wpm,
    rawWpm: wpm + 2,
    accuracy,
    cpm: wpm * 5,
    elapsedTime: 60000,
    progress: 100,
    correctCharacters: 200,
    incorrectCharacters: 5,
    extraCharacters: 0,
    missedCharacters: 0,
    wordsCompleted: wpm,
    totalCharacters: 205,
    backspaces: 0,
  };
}

test("progressService: returns empty progress for unknown exam", () => {
  const s = makeMemoryStorage();
  const p = getProgress("ssc_cgl", s);
  assert.strictEqual(p.attempts, 0);
  assert.strictEqual(p.bestWPM, 0);
  assert.strictEqual(p.lastPracticed, null);
});

test("progressService: recordAttempt increments attempt count", () => {
  const s = makeMemoryStorage();
  const p = recordAttempt("ssc_cgl", makeSnapshot(30, 88), false, s);
  assert.strictEqual(p.attempts, 1);
});

test("progressService: recordAttempt stores correct best WPM", () => {
  const s = makeMemoryStorage();
  recordAttempt("ssc_cgl", makeSnapshot(30, 88), false, s);
  const p2 = recordAttempt("ssc_cgl", makeSnapshot(40, 92), true, s);
  assert.strictEqual(p2.bestWPM, 40);
});

test("progressService: bestWPM is max across all attempts", () => {
  const s = makeMemoryStorage();
  recordAttempt("ssc_cgl", makeSnapshot(25, 85), false, s);
  recordAttempt("ssc_cgl", makeSnapshot(35, 90), true, s);
  recordAttempt("ssc_cgl", makeSnapshot(30, 88), false, s);
  const best = getBestWpm("ssc_cgl", s);
  assert.strictEqual(best, 35);
});

test("progressService: averageWPM is computed correctly", () => {
  const s = makeMemoryStorage();
  recordAttempt("ssc_cgl", makeSnapshot(30, 88), false, s);
  recordAttempt("ssc_cgl", makeSnapshot(40, 92), true, s);
  const avg = getAverageWpm("ssc_cgl", s);
  assert.strictEqual(avg, 35); // (30 + 40) / 2
});

test("progressService: clearProgress resets to empty state", () => {
  const s = makeMemoryStorage();
  recordAttempt("ssc_cgl", makeSnapshot(35, 90), true, s);
  clearProgress("ssc_cgl", s);
  const p = getProgress("ssc_cgl", s);
  assert.strictEqual(p.attempts, 0);
  assert.strictEqual(p.bestWPM, 0);
});

test("progressService: lastPracticed is set after recordAttempt", () => {
  const s = makeMemoryStorage();
  const p = recordAttempt("ssc_cgl", makeSnapshot(35, 90), true, s);
  assert.ok(p.lastPracticed !== null, "lastPracticed should be set");
  assert.ok(new Date(p.lastPracticed!).getTime() > 0, "should be valid date");
});

test("progressService: qualified flag stored in history", () => {
  const s = makeMemoryStorage();
  const p = recordAttempt("ssc_cgl", makeSnapshot(35, 90), true, s);
  assert.strictEqual(p.history[0].qualified, true);
});

test("progressService: multiple exams are tracked independently", () => {
  const s = makeMemoryStorage();
  recordAttempt("ssc_cgl", makeSnapshot(35, 90), true, s);
  recordAttempt("rrb_ntpc", makeSnapshot(28, 87), false, s);
  const cgl = getProgress("ssc_cgl", s);
  const rrb = getProgress("rrb_ntpc", s);
  assert.strictEqual(cgl.bestWPM, 35);
  assert.strictEqual(rrb.bestWPM, 28);
  assert.strictEqual(cgl.attempts, 1);
  assert.strictEqual(rrb.attempts, 1);
});
