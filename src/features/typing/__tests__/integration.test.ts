import test from "node:test";
import assert from "node:assert";
import { useTypingStore } from "../store";
import { DEFAULT_TYPING_CONFIG } from "../constants";

test("Integration: End-to-end typing flow", () => {
  const store = useTypingStore.getState();

  // 1. Initialize empty - should warn and not change text
  store.initSession("", DEFAULT_TYPING_CONFIG);
  assert.strictEqual(useTypingStore.getState().rawText, "");

  // 2. Initialize properly
  store.initSession("hello world", DEFAULT_TYPING_CONFIG);
  let state = useTypingStore.getState();
  
  assert.strictEqual(state.rawText, "hello world");
  assert.strictEqual(state.status, "idle");
  assert.strictEqual(state.words.length, 2);

  // 3. Type "h" (first key starts session)
  state.handleKeystroke("h");
  state = useTypingStore.getState();
  assert.strictEqual(state.status, "running");
  assert.strictEqual(state.stats.correct, 1);
  assert.strictEqual(state.cursor.charIndex, 1);
  assert.strictEqual(state.words[0].characters[0].state, "correct");

  // 4. Type incorrect "a"
  state.handleKeystroke("a");
  state = useTypingStore.getState();
  assert.strictEqual(state.stats.incorrect, 1);
  assert.strictEqual(state.cursor.charIndex, 2);
  assert.strictEqual(state.words[0].characters[1].state, "incorrect");
  
  // 5. Backspace to fix "a"
  state.handleKeystroke("Backspace");
  state = useTypingStore.getState();
  assert.strictEqual(state.cursor.charIndex, 1);
  assert.strictEqual(state.words[0].characters[1].state, "current");
  assert.strictEqual(state.stats.incorrect, 0); // Erased penalty
  
  // 6. Finish "hello "
  state.handleKeystroke("e");
  state.handleKeystroke("l");
  state.handleKeystroke("l");
  state.handleKeystroke("o");
  state.handleKeystroke(" ");
  state = useTypingStore.getState();
  
  assert.strictEqual(state.cursor.wordIndex, 1);
  assert.strictEqual(state.cursor.charIndex, 0);
  assert.strictEqual(state.stats.correct, 6); // h, e, l, l, o, space
  assert.strictEqual(state.stats.wordsCompleted, 1);
  
  // 7. Type "world" to complete test
  state.handleKeystroke("w");
  state.handleKeystroke("o");
  state.handleKeystroke("r");
  state.handleKeystroke("l");
  state.handleKeystroke("d");
  state = useTypingStore.getState();
  
  assert.strictEqual(state.status, "finished");
  assert.strictEqual(state.stats.correct, 11); // total characters
  assert.strictEqual(state.stats.wordsCompleted, 2);

  // 8. Test Reset Session
  // To ensure the reset works with extra characters, let's type extra before resetting.
  store.initSession("hello reset", DEFAULT_TYPING_CONFIG);
  state = useTypingStore.getState();
  state.handleKeystroke("h"); // char 0
  state.handleKeystroke("e"); // char 1
  state.handleKeystroke("l"); // char 2
  state.handleKeystroke("l"); // char 3
  state.handleKeystroke("o"); // char 4
  state.handleKeystroke(" "); // char 5
  // Now on word 1 ("reset")
  state.handleKeystroke("r"); // char 0
  state.handleKeystroke("e"); // char 1
  state.handleKeystroke("s"); // char 2
  state.handleKeystroke("e"); // char 3
  // Don't finish! We are at char 4. Type extra stuff!
  state.handleKeystroke("t"); // char 4 (finishes word)
  // Wait, if I type "t" it finishes the test!
  // Instead of typing the last character, type extra BEFORE the word is over?
  // No, extra characters are only added when you type past the end of the word!
  // But typing past the end of the LAST word finishes the test!
  // So we must type past the end of the FIRST word!
  
  store.initSession("word1 word2", DEFAULT_TYPING_CONFIG);
  state = useTypingStore.getState();
  state.handleKeystroke("w");
  state.handleKeystroke("o");
  state.handleKeystroke("r");
  state.handleKeystroke("l");
  state.handleKeystroke("d"); // 5th char
  
  state = useTypingStore.getState();
  
  state.resetSession();
  state = useTypingStore.getState();
  assert.strictEqual(state.status, "idle");
  assert.strictEqual(state.words[0].characters.length, 6); // Perfectly restored
  assert.strictEqual(state.stats.correct, 0); // Stats wiped
});
