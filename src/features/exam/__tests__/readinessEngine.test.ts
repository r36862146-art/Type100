import test from "node:test";
import assert from "node:assert/strict";
import { computeReadiness } from "../services/readinessEngine";
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

test("readinessEngine: returns 'ready' when both WPM and accuracy met", () => {
  const report = computeReadiness(makeSnapshot(40, 95), baseProfile);
  assert.strictEqual(report.overallReadiness, "ready");
  assert.ok(report.wpmGap >= 0, "wpmGap should be non-negative");
  assert.ok(report.accuracyGap >= 0, "accuracyGap should be non-negative");
});

test("readinessEngine: returns 'almost_ready' when within delta", () => {
  // 28 WPM (within 10 below 35) and 87% accuracy (within 5 below 90)
  const report = computeReadiness(makeSnapshot(28, 87), baseProfile);
  assert.strictEqual(report.overallReadiness, "almost_ready");
});

test("readinessEngine: returns 'needs_practice' when far below target", () => {
  const report = computeReadiness(makeSnapshot(15, 70), baseProfile);
  assert.strictEqual(report.overallReadiness, "needs_practice");
});

test("readinessEngine: computes correct WPM gap", () => {
  const report = computeReadiness(makeSnapshot(30, 90), baseProfile);
  assert.strictEqual(report.wpmGap, -5);
  assert.strictEqual(report.currentWPM, 30);
  assert.strictEqual(report.requiredWPM, 35);
});

test("readinessEngine: computes correct accuracy gap", () => {
  const report = computeReadiness(makeSnapshot(40, 88), baseProfile);
  assert.strictEqual(report.accuracyGap, -2);
});

test("readinessEngine: estimatedQualification is 100 when both criteria met", () => {
  const report = computeReadiness(makeSnapshot(35, 90), baseProfile);
  assert.strictEqual(report.estimatedQualification, 100);
});

test("readinessEngine: estimatedQualification is 0 when WPM and accuracy are 0", () => {
  const report = computeReadiness(makeSnapshot(0, 0), baseProfile);
  assert.strictEqual(report.estimatedQualification, 0);
});

test("readinessEngine: areasToImprove is non-empty when criteria not met", () => {
  const report = computeReadiness(makeSnapshot(20, 80), baseProfile);
  assert.ok(report.areasToImprove.length > 0);
});

test("readinessEngine: areasToImprove has maintenance message when all criteria met", () => {
  const report = computeReadiness(makeSnapshot(40, 95), baseProfile);
  assert.strictEqual(report.areasToImprove.length, 1);
  assert.match(report.areasToImprove[0], /consistently/i);
});
