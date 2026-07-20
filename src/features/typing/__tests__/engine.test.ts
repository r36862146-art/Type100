import test from "node:test";
import assert from "node:assert";
import { isValidKey } from "../engine/validator";
import { matcher } from "../engine/matcher";
import { cursorMath } from "../engine/cursor";
import { typingEngine } from "../engine/typingEngine";
import { parseTextToModel } from "../parser";

// We'll mock a default config since we don't have access to the constants in this specific test scope easily if it's not exported
const DEFAULT_CONFIG = {
  mode: "time" as const,
  language: "english",
  timeLimit: 60,
  allowCrossWordBackspace: true,
  strictMode: false
};

const INITIAL_STATS = {
  elapsedTime: 0,
  correct: 0,
  incorrect: 0,
  extra: 0,
  missed: 0,
  wpm: 0,
  rawWpm: 0,
  accuracy: 0,
  cpm: 0,
  progress: 0,
  wordsCompleted: 0,
  remainingTime: 0
};

test("validator: isValidKey filters correctly", () => {
  assert.strictEqual(isValidKey("a", false, false, false), true);
  assert.strictEqual(isValidKey(" ", false, false, false), true);
  assert.strictEqual(isValidKey("Backspace", false, false, false), true);
  
  assert.strictEqual(isValidKey("Tab", false, false, false), false);
  assert.strictEqual(isValidKey("Escape", false, false, false), false);
  
  assert.strictEqual(isValidKey("c", true, false, false), false); // Ctrl+C
});

test("matcher: matchCharacter evaluates states accurately", () => {
  assert.strictEqual(matcher.matchCharacter("a", "a"), "correct");
  assert.strictEqual(matcher.matchCharacter("a", "b"), "incorrect");
  assert.strictEqual(matcher.matchCharacter(undefined, "a"), "extra");
});

test("cursorMath: advance, retreat, jump logic", () => {
  const lengths = [3, 4]; // e.g. "hi " "bye "
  
  // advance
  assert.deepStrictEqual(cursorMath.advance(lengths, { wordIndex: 0, charIndex: 0 }), { wordIndex: 0, charIndex: 1 });
  assert.deepStrictEqual(cursorMath.advance(lengths, { wordIndex: 0, charIndex: 2 }), { wordIndex: 1, charIndex: 0 });
  assert.strictEqual(cursorMath.advance(lengths, { wordIndex: 1, charIndex: 3 }), null);
  
  // retreat
  assert.deepStrictEqual(cursorMath.retreat(lengths, { wordIndex: 0, charIndex: 1 }, true), { wordIndex: 0, charIndex: 0 });
  assert.deepStrictEqual(cursorMath.retreat(lengths, { wordIndex: 1, charIndex: 0 }, true), { wordIndex: 0, charIndex: 2 });
  assert.deepStrictEqual(cursorMath.retreat(lengths, { wordIndex: 1, charIndex: 0 }, false), { wordIndex: 1, charIndex: 0 });
  
  // jumpToNextWord
  assert.deepStrictEqual(cursorMath.jumpToNextWord(lengths, { wordIndex: 0, charIndex: 0 }), { wordIndex: 1, charIndex: 0 });
});

test("typingEngine: processKey orchestrates state and emits events", () => {
  const words = parseTextToModel("hi bye");
  const session = {
    rawText: "hi bye",
    status: "idle" as const,
    words,
    config: DEFAULT_CONFIG,
    stats: INITIAL_STATS,
    cursor: { wordIndex: 0, charIndex: 0 }
  };

  // 1. Type "h"
  const step1 = typingEngine.processKey(session, "h");
  assert.strictEqual(step1.nextState.status, "running");
  assert.strictEqual(step1.nextState.words[0].characters[0].state, "correct");
  assert.strictEqual(step1.nextState.cursor.charIndex, 1);
  assert.strictEqual(step1.events[0].type, "FIRST_KEY");
  assert.strictEqual(step1.events[1].type, "CHARACTER_TYPED");
  assert.strictEqual(step1.events[2].type, "CHARACTER_CORRECT");

  // 2. Type incorrect "o" instead of "i"
  const step2 = typingEngine.processKey(step1.nextState, "o");
  assert.strictEqual(step2.nextState.words[0].characters[1].state, "incorrect");
  assert.strictEqual(step2.nextState.cursor.charIndex, 2);

  // 3. Backspace
  const step3 = typingEngine.processKey(step2.nextState, "Backspace");
  assert.strictEqual(step3.nextState.cursor.charIndex, 1);
  assert.strictEqual(step3.nextState.words[0].characters[1].state, "current");
  assert.strictEqual(step3.events[0].type, "BACKSPACE");
});
