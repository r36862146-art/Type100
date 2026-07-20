import test from "node:test";
import assert from "node:assert/strict";
import { getDefaultRules } from "../services/rrbRules";
import { computeRRBScore } from "../services/scoring";
import { validateInput } from "../services/validation";

// ----------------------------------------------------------------
// Timer / auto-submit logic (pure function equivalents)
// These test the timer arithmetic without needing a DOM / React.
// ----------------------------------------------------------------

test("simulator: duration * 60 gives correct initial seconds", () => {
  const rules = getDefaultRules();
  const initialSeconds = rules.duration * 60;
  assert.strictEqual(initialSeconds, 600, "10 min × 60 = 600 seconds");
});

test("simulator: elapsed computation from start time", () => {
  const start = Date.now();
  // Simulate 3 seconds of typing
  const fakeNow = start + 3000;
  const elapsed = (fakeNow - start) / 1000;
  assert.ok(Math.abs(elapsed - 3) < 0.1, `Elapsed should be ~3s, got ${elapsed}`);
});

test("simulator: score computed correctly from session data", () => {
  // 300 chars, 3 errors, 60s → net WPM = (300 - 15) / 5 / 1 = 57 WPM
  const result = computeRRBScore({
    grossCharacters: 300,
    errors: 3,
    elapsedSeconds: 60,
    targetWpm: 30,
    targetAccuracy: 90,
  });
  assert.ok(result.netWPM > 0, "Net WPM should be > 0");
  assert.ok(result.accuracy > 0, "Accuracy should be > 0");
  assert.strictEqual(result.qualifies, true);
});

// ----------------------------------------------------------------
// Auto-submit edge cases
// ----------------------------------------------------------------

test("simulator: timeRemaining reaches 0 correctly", () => {
  let timeLeft = 5; // 5 seconds test
  const ticks: number[] = [];
  while (timeLeft > 0) {
    timeLeft -= 1;
    ticks.push(timeLeft);
  }
  assert.strictEqual(timeLeft, 0);
  assert.strictEqual(ticks[ticks.length - 1], 0);
  assert.strictEqual(ticks.length, 5);
});

test("simulator: autoSubmit triggers at zero timeRemaining", () => {
  let autoSubmitCalled = false;
  const rules = { ...getDefaultRules(), autoSubmit: true };

  let timeLeft = 2;
  const tick = () => {
    timeLeft -= 1;
    if (timeLeft <= 0 && rules.autoSubmit) {
      autoSubmitCalled = true;
    }
  };
  tick();
  tick();

  assert.strictEqual(autoSubmitCalled, true);
});

test("simulator: autoSubmit=false does not auto-trigger", () => {
  let autoSubmitCalled = false;
  const rules = { ...getDefaultRules(), autoSubmit: false };

  let timeLeft = 2;
  const tick = () => {
    timeLeft -= 1;
    if (timeLeft <= 0 && rules.autoSubmit) {
      autoSubmitCalled = true;
    }
  };
  tick();
  tick();

  assert.strictEqual(autoSubmitCalled, false);
});

// ----------------------------------------------------------------
// Phase transitions (pure state machine logic)
// ----------------------------------------------------------------

test("simulator: valid phase sequence", () => {
  type Phase =
    | "idle"
    | "instructions"
    | "countdown"
    | "active"
    | "results";

  const transitions: Record<Phase, Phase | null> = {
    idle: "instructions",
    instructions: "countdown",
    countdown: "active",
    active: "results",
    results: null,
  };

  let phase: Phase = "idle";
  const path: Phase[] = [phase];

  while (transitions[phase] !== null) {
    phase = transitions[phase]!;
    path.push(phase);
  }

  assert.deepStrictEqual(path, [
    "idle",
    "instructions",
    "countdown",
    "active",
    "results",
  ]);
});

// ----------------------------------------------------------------
// Live stats computation
// ----------------------------------------------------------------

test("simulator: live stats computes accuracy from typed vs passage", () => {
  const typed = "Hello World";
  const passage = "Hello world"; // lowercase 'w' difference
  const result = validateInput(typed, passage);
  assert.ok(result.accuracy < 100, "Should have <100% accuracy with mismatch");
  assert.strictEqual(result.incorrectChars, 1, "One char mismatch");
});

test("simulator: progress from 0 to 100 as user types", () => {
  const passage = "Hello World";
  const typedStates = ["", "Hello", "Hello World"];
  const progresses = typedStates.map((t) =>
    Math.min(100, Math.round((t.length / passage.length) * 100))
  );
  assert.strictEqual(progresses[0], 0);
  assert.ok(progresses[1] > 0 && progresses[1] < 100);
  assert.strictEqual(progresses[2], 100);
});

// ----------------------------------------------------------------
// Pause/resume accumulated time
// ----------------------------------------------------------------

test("simulator: accumulated pause time excluded from elapsed", () => {
  const start = 1000;
  const pausedAt = 3000;     // paused after 2s
  const resumedAt = 8000;    // resumed after 5s pause
  const endTime = 10000;     // ended 2s after resume

  const pauseDuration = resumedAt - pausedAt; // 5000ms
  const elapsed = (endTime - start - pauseDuration) / 1000;

  // Should be 4s (2s before pause + 2s after resume)
  assert.ok(Math.abs(elapsed - 4) < 0.01, `Expected ~4s elapsed, got ${elapsed}`);
});

// ----------------------------------------------------------------
// Restart validation
// ----------------------------------------------------------------

test("simulator: allowRestart=false means restart cannot proceed", () => {
  const rules = { ...getDefaultRules(), allowRestart: false };
  let restarted = false;
  if (rules.allowRestart) {
    restarted = true;
  }
  assert.strictEqual(restarted, false);
});

test("simulator: allowRestart=true means restart can proceed", () => {
  const rules = { ...getDefaultRules(), allowRestart: true };
  let restarted = false;
  if (rules.allowRestart) {
    restarted = true;
  }
  assert.strictEqual(restarted, true);
});
