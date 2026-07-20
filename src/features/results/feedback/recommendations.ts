import { ResultsSnapshot } from "../types";
import { RuleOutputs } from "./rules";

export interface RecommendationOutputs {
  recommendationKeys: string[];
  nextGoalKey: string;
}

export function generateRecommendations(
  snapshot: ResultsSnapshot, 
  rules: RuleOutputs
): RecommendationOutputs {
  const recommendationKeys: string[] = [];
  let nextGoalKey = "maintain70";

  // High WPM + Low Accuracy -> Recommend slowing down
  if (snapshot.wpm > 80 && snapshot.accuracy < 90) {
    recommendationKeys.push("slowDown");
    nextGoalKey = "reach98";
  }

  // High Accuracy + Low WPM -> Recommend increasing rhythm
  if (snapshot.accuracy >= 98 && snapshot.wpm < 40) {
    recommendationKeys.push("increaseRhythm");
    nextGoalKey = "maintain70";
  }

  // High Extra Characters -> Recommend reducing overshooting
  if (snapshot.extraCharacters > 10) {
    recommendationKeys.push("reduceOvershooting");
    nextGoalKey = "reduceExtra";
  }

  // Many Missed Characters -> Recommend reading ahead
  if (snapshot.missedCharacters > 10) {
    recommendationKeys.push("readAhead");
  }

  // Excellent Accuracy + Stable Speed -> Encourage exam mode
  if (snapshot.accuracy >= 98 && snapshot.wpm >= 60 && snapshot.wpm / snapshot.rawWpm > 0.95) {
    recommendationKeys.push("examMode");
  }

  // Short Session -> Recommend longer practice
  if (snapshot.elapsedTime < 15000) { // < 15 seconds
    recommendationKeys.push("longerPractice");
    nextGoalKey = "complete5Min";
  }

  // Fallbacks
  if (recommendationKeys.length === 0) {
    if (snapshot.accuracy < 95) {
      recommendationKeys.push("slowDown");
      nextGoalKey = "reach98";
    } else {
      recommendationKeys.push("practiceCustom");
    }
  }

  return {
    recommendationKeys,
    nextGoalKey,
  };
}
