import test from "node:test";
import assert from "node:assert";
import { saveRecentText, getRecentTexts, clearRecentTexts } from "../services/storage";

test("storage: gracefully handles undefined window", () => {
  // In node environment, window is undefined by default
  const recent = getRecentTexts();
  assert.deepStrictEqual(recent, []);

  // Should not throw
  saveRecentText("Hello world");
  clearRecentTexts();
});

test("storage: with window mocked", () => {
  // Mock window and localStorage
  const mockStorage = new Map<string, string>();
  
  (global as any).window = {};
  (global as any).localStorage = {
    getItem: (key: string) => mockStorage.get(key) || null,
    setItem: (key: string, val: string) => mockStorage.set(key, val),
    removeItem: (key: string) => mockStorage.delete(key),
  };

  try {
    clearRecentTexts();
    assert.deepStrictEqual(getRecentTexts(), []);

    saveRecentText("First text block");
    const afterFirst = getRecentTexts();
    assert.strictEqual(afterFirst.length, 1);
    assert.strictEqual(afterFirst[0].text, "First text block");

    saveRecentText("Second text block");
    const afterSecond = getRecentTexts();
    assert.strictEqual(afterSecond.length, 2);
    assert.strictEqual(afterSecond[0].text, "Second text block");

  } finally {
    delete (global as any).window;
    delete (global as any).localStorage;
  }
});
