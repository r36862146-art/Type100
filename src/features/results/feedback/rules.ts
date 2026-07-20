import { ResultsSnapshot } from "../types";

export interface RuleOutputs {
  strengthsKeys: string[];
  weaknessesKeys: string[];
}

export function evaluateRules(snapshot: ResultsSnapshot): RuleOutputs {
  const strengthsKeys: string[] = [];
  const weaknessesKeys: string[] = [];

  // High WPM + Low Accuracy
  if (snapshot.wpm > 80 && snapshot.accuracy < 90) {
    weaknessesKeys.push("frequentCorrections");
  }

  // High Accuracy + Low WPM
  if (snapshot.accuracy >= 98 && snapshot.wpm < 40) {
    strengthsKeys.push("excellentAccuracy");
  }

  // High Extra Characters
  if (snapshot.extraCharacters > 10) {
    weaknessesKeys.push("tooManyExtraKeystrokes");
  }

  // Many Missed Characters
  if (snapshot.missedCharacters > 10) {
    weaknessesKeys.push("highMissRate");
  }

  // Excellent Accuracy + Stable Speed
  if (snapshot.accuracy >= 98 && snapshot.wpm >= 60 && snapshot.wpm / snapshot.rawWpm > 0.95) {
    strengthsKeys.push("stablePerformance");
  }

  // Very Long Session
  if (snapshot.elapsedTime > 300000) {
    strengthsKeys.push("greatEndurance");
  }

  // Generic Strengths
  if (snapshot.accuracy > 95 && !strengthsKeys.includes("excellentAccuracy")) {
    strengthsKeys.push("excellentAccuracy");
  }

  if (snapshot.incorrectCharacters === 0 && snapshot.missedCharacters === 0 && snapshot.extraCharacters === 0) {
    strengthsKeys.push("lowErrorRate");
  }

  if (snapshot.wpm > 70) {
    strengthsKeys.push("strongSpeed");
  }

  return {
    strengthsKeys,
    weaknessesKeys,
  };
}
