import test from "node:test";
import assert from "node:assert/strict";
import { computeQualification } from "../services/qualificationEngine";
import type { ExamProfile, ResultsSnapshot } from "../types";

const baseProfile: ExamProfile = {
  id: "ssc_cgl",
  organization: "SSC",
  exam: "CGL",
  post: "Tax Assistant",
  language: "en",
  duration: 10,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general"],
  description: "",
};

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

test("qualificationEngine: returns 'qualified' when both WPM and accuracy met", () => {
  const result = computeQualification(makeSnapshot(40, 95), baseProfile);
  assert.strictEqual(result.status, "qualified");
  assert.strictEqual(result.speedQualified, true);
  assert.strictEqual(result.accuracyQualified, true);
  assert.strictEqual(result.details.wpmShortfall, 0);
  assert.strictEqual(result.details.accuracyShortfall, 0);
});

test("qualificationEngine: returns 'qualified' at exact threshold", () => {
  const result = computeQualification(makeSnapshot(35, 90), baseProfile);
  assert.strictEqual(result.status, "qualified");
});

test("qualificationEngine: returns 'nearly_ready' when within delta", () => {
  // 28 WPM = 7 shortfall (≤ 8 delta), 88% = 2 shortfall (≤ 3 delta)
  const result = computeQualification(makeSnapshot(28, 88), baseProfile);
  assert.strictEqual(result.status, "nearly_ready");
});

test("qualificationEngine: returns 'needs_improvement' when far below", () => {
  const result = computeQualification(makeSnapshot(15, 70), baseProfile);
  assert.strictEqual(result.status, "needs_improvement");
});

test("qualificationEngine: speedQualified is false when WPM below target", () => {
  const result = computeQualification(makeSnapshot(30, 95), baseProfile);
  assert.strictEqual(result.speedQualified, false);
  assert.strictEqual(result.accuracyQualified, true);
});

test("qualificationEngine: accuracyQualified is false when accuracy below target", () => {
  const result = computeQualification(makeSnapshot(40, 85), baseProfile);
  assert.strictEqual(result.speedQualified, true);
  assert.strictEqual(result.accuracyQualified, false);
});

test("qualificationEngine: wpmShortfall is zero when speed qualified", () => {
  const result = computeQualification(makeSnapshot(40, 85), baseProfile);
  assert.strictEqual(result.details.wpmShortfall, 0);
});

test("qualificationEngine: accuracyShortfall is zero when accuracy qualified", () => {
  const result = computeQualification(makeSnapshot(30, 95), baseProfile);
  assert.strictEqual(result.details.accuracyShortfall, 0);
});

test("qualificationEngine: nextGoal is a non-empty string", () => {
  const result = computeQualification(makeSnapshot(20, 80), baseProfile);
  assert.ok(result.nextGoal.length > 0);
});

test("qualificationEngine: requiredImprovement mentions no improvement when qualified", () => {
  const result = computeQualification(makeSnapshot(40, 95), baseProfile);
  assert.match(result.requiredImprovement, /no improvement needed/i);
});
