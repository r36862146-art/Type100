import test from "node:test";
import assert from "node:assert";
import { calculator } from "../engine/calculator";
import { timer } from "../engine/timer";
import { statistics } from "../engine/statistics";

const INITIAL_STATS = {
  elapsedTime: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  accuracy: 100,
  wordsCompleted: 0,
  remainingTime: 0,
  totalKeystrokes: 0,
  progress: 0,
  backspaces: 0,
};

test("calculator: WPM handles division by zero safely", () => {
  assert.strictEqual(calculator.calculateWpm(100, 0), 0);
  assert.strictEqual(calculator.calculateWpm(0, 60000), 0);
  assert.strictEqual(calculator.calculateWpm(50, 60000), 10); // (50/5) / 1 min = 10 WPM
});

test("calculator: Raw WPM includes mistakes", () => {
  assert.strictEqual(calculator.calculateRawWpm(0, 60000), 0);
  assert.strictEqual(calculator.calculateRawWpm(50, 60000), 10); 
});

test("calculator: Accuracy edge cases", () => {
  assert.strictEqual(calculator.calculateAccuracy(0, 0, 0, 0), 100);
  assert.strictEqual(calculator.calculateAccuracy(5, 5, 0, 0), 50);
  assert.strictEqual(calculator.calculateAccuracy(10, 0, 2, 0), 83.33);
});

test("calculator: Progress logic", () => {
  assert.strictEqual(calculator.calculateProgress(5, 10), 50);
  assert.strictEqual(calculator.calculateProgress(10, 10), 100);
  assert.strictEqual(calculator.calculateProgress(0, 0), 0); // divide by zero check
});

test("timer: count down mode bounded safely", () => {
  const config = { mode: "time" as const, timeLimit: 30 } as any;
  const initial = { ...INITIAL_STATS, elapsedTime: 0, remainingTime: 30000 };
  
  const tick1 = timer.tick(initial, 1000, config);
  assert.strictEqual(tick1.elapsedTime, 1000);
  assert.strictEqual(tick1.remainingTime, 29000);
  
  // Test going below zero
  const tickOverflow = timer.tick(initial, 31000, config);
  assert.strictEqual(tickOverflow.elapsedTime, 31000);
  assert.strictEqual(tickOverflow.remainingTime, 0); // Stops at 0
});

test("statistics: processEvent O(1) reduction correctly updates bounds", () => {
  let stats = { ...INITIAL_STATS };
  
  // 1. Correct character typed
  stats = statistics.processEvent(stats, { type: "CHARACTER_CORRECT", payload: { char: "a" } });
  assert.strictEqual(stats.correct, 1);
  assert.strictEqual(stats.accuracy, 100);
  
  // 2. Incorrect character typed
  stats = statistics.processEvent(stats, { type: "CHARACTER_INCORRECT", payload: { expected: "b", typed: "c" } });
  assert.strictEqual(stats.incorrect, 1);
  assert.strictEqual(stats.accuracy, 50); // 1 correct, 1 incorrect
  
  // 3. Extra character typed (represented by empty expected string)
  stats = statistics.processEvent(stats, { type: "CHARACTER_INCORRECT", payload: { expected: "", typed: "d" } });
  assert.strictEqual(stats.extra, 1);
  assert.strictEqual(stats.accuracy, 33.33); // 1 correct, 1 incorrect, 1 extra
  
  // 4. Backspace erased an extra character
  stats = statistics.processEvent(stats, { type: "BACKSPACE", payload: { erasedState: "extra" } });
  assert.strictEqual(stats.extra, 0);
  assert.strictEqual(stats.accuracy, 50); // 1 correct, 1 incorrect
});
