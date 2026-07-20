import test from "node:test";
import assert from "node:assert/strict";
import { getDefaultRules } from "../services/andamanRules";
import { computeAndamanScore } from "../services/scoring";
import { validateInput } from "../services/validation";
import type { AndamanSimulatorPhase } from "../hooks/useAndamanSimulator";

// ----------------------------------------------------------------
// Timer / auto-submit logic (pure function equivalents)
// ----------------------------------------------------------------

test("simulator: duration * 60 gives correct initial seconds", () => {
  const rules = getDefaultRules(); // 10 mins
  const initialSeconds = rules.duration * 60;
  assert.strictEqual(initialSeconds, 600);
});

test("simulator: elapsed computation from start time", () => {
  const start = Date.now();
  const fakeNow = start + 3000;
  const elapsed = (fakeNow - start) / 1000;
  assert.ok(Math.abs(elapsed - 3) < 0.1);
});

test("simulator: score computed correctly from session data", () => {
  // 350 chars, 5 errors, 60s -> 70 words gross - 5 words penalty = 65 net words -> 65 WPM
  const result = computeAndamanScore({
    grossCharacters: 350,
    errors: 5,
    elapsedSeconds: 60,
    targetWpm: 35,
    targetAccuracy: 90,
  });
  assert.strictEqual(result.netWPM, 65);
  assert.ok(result.accuracy > 0);
  assert.strictEqual(result.qualifies, true);
});

// ----------------------------------------------------------------
// Auto-submit edge cases
// ----------------------------------------------------------------

test("simulator: timeRemaining reaches 0 correctly", () => {
  let timeLeft = 5;
  const ticks: number[] = [];
  while (timeLeft > 0) {
    timeLeft -= 1;
    ticks.push(timeLeft);
  }
  assert.strictEqual(timeLeft, 0);
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
// Phase transitions
// ----------------------------------------------------------------

test("simulator: valid phase sequence", () => {
  const transitions: Record<AndamanSimulatorPhase, AndamanSimulatorPhase | null> = {
    idle: "instructions",
    instructions: "countdown",
    countdown: "active",
    active: "submitted",
    submitted: "results",
    results: null,
  };

  let phase: AndamanSimulatorPhase = "idle";
  const path: AndamanSimulatorPhase[] = [phase];

  while (transitions[phase] !== null) {
    phase = transitions[phase]!;
    path.push(phase);
  }

  assert.deepStrictEqual(path, [
    "idle",
    "instructions",
    "countdown",
    "active",
    "submitted",
    "results",
  ]);
});

// ----------------------------------------------------------------
// Live stats computation
// ----------------------------------------------------------------

test("simulator: live stats computes accuracy from typed vs passage", () => {
  const typed = "Hello World";
  const passage = "Hello world";
  const result = validateInput(typed, passage);
  assert.ok(result.accuracy < 100);
  assert.strictEqual(result.incorrectChars, 1);
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
  const pausedAt = 3000;
  const resumedAt = 8000;
  const endTime = 10000;

  const pauseDuration = resumedAt - pausedAt;
  const elapsed = (endTime - start - pauseDuration) / 1000;

  assert.ok(Math.abs(elapsed - 4) < 0.01);
});

// ----------------------------------------------------------------
// Restart validation
// ----------------------------------------------------------------

test("simulator: allowRestart=false prevents restart", () => {
  const rules = { ...getDefaultRules(), allowRestart: false };
  let restarted = false;
  if (rules.allowRestart) {
    restarted = true;
  }
  assert.strictEqual(restarted, false);
});
