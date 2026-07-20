import { generateFeedback } from "../feedbackEngine";
import { ResultsSnapshot } from "../../types";

const createBaseSnapshot = (): ResultsSnapshot => ({
  wpm: 60,
  rawWpm: 65,
  accuracy: 95,
  cpm: 300,
  elapsedTime: 60000,
  progress: 100,
  correctCharacters: 300,
  incorrectCharacters: 10,
  extraCharacters: 2,
  missedCharacters: 1,
  wordsCompleted: 60,
  totalCharacters: 313,
});

describe("Performance Feedback Engine", () => {
  it("should generate appropriate feedback for high speed, low accuracy", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      wpm: 90,
      rawWpm: 120,
      accuracy: 85,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.weaknesses.some(w => w.includes("frequent"))).toBe(true);
    expect(feedback.recommendations.some(r => r.includes("slowing down"))).toBe(true);
  });

  it("should generate appropriate feedback for high accuracy, low speed", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      wpm: 30,
      rawWpm: 30,
      accuracy: 99,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.strengths.some(s => s.includes("Excellent Accuracy"))).toBe(true);
    expect(feedback.recommendations.some(r => r.includes("speed up"))).toBe(true);
  });

  it("should generate appropriate feedback for perfect accuracy", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      accuracy: 100,
      incorrectCharacters: 0,
      missedCharacters: 0,
      extraCharacters: 0,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.achievements.some(a => a.id === "accuracyMaster")).toBe(true);
  });

  it("should generate appropriate feedback for many extra characters", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      extraCharacters: 15,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.weaknesses.some(w => w.includes("extra keystrokes"))).toBe(true);
    expect(feedback.recommendations.some(r => r.includes("avoid extra keystrokes"))).toBe(true);
  });

  it("should generate appropriate feedback for many missed characters", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      missedCharacters: 15,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.weaknesses.some(w => w.includes("missed characters"))).toBe(true);
    expect(feedback.recommendations.some(r => r.includes("reading one word ahead"))).toBe(true);
  });

  it("should generate appropriate feedback for a short session", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      elapsedTime: 10000,
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.recommendations.some(r => r.includes("longer sessions"))).toBe(true);
  });

  it("should generate appropriate feedback for a long session", () => {
    const snapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      elapsedTime: 400000, // > 5 minutes
    };
    const feedback = generateFeedback(snapshot);
    expect(feedback.achievements.some(a => a.id === "typingMarathon")).toBe(true);
    expect(feedback.strengths.some(s => s.includes("Great Endurance"))).toBe(true);
  });

  it("should have a proper scoring mechanism that factors in various metrics", () => {
    const poorSnapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      accuracy: 50,
      wpm: 20,
    };
    const perfectSnapshot: ResultsSnapshot = {
      ...createBaseSnapshot(),
      accuracy: 100,
      wpm: 120,
      rawWpm: 120,
      incorrectCharacters: 0,
      extraCharacters: 0,
      missedCharacters: 0,
    };
    const poorFeedback = generateFeedback(poorSnapshot);
    const perfectFeedback = generateFeedback(perfectSnapshot);

    expect(poorFeedback.overallRating).toBe("Needs Improvement");
    expect(perfectFeedback.overallRating).toBe("Outstanding");
  });
});
