import { ResultsSnapshot } from "../types";
import { PerformanceFeedback } from "./types";
import { calculateScore } from "./scorer";
import { evaluateBadges } from "./badges";
// import { evaluateMilestones } from "./milestones"; // for future expansion
import { evaluateRules } from "./rules";
import { generateRecommendations } from "./recommendations";
import {
  getOverallRating,
  getOverallMessage,
  resolveStrengths,
  resolveWeaknesses,
  resolveRecommendations,
  resolveGoal,
} from "./generator";

/**
 * Generates deterministic performance feedback for a typing session.
 * Pure function, O(1) evaluation over aggregated statistics.
 */
export function generateFeedback(snapshot: ResultsSnapshot): PerformanceFeedback {
  // 1. Scoring
  const score = calculateScore(snapshot);
  const overallRating = getOverallRating(score);
  const overallMessage = getOverallMessage(overallRating);
  
  // Confidence level can be correlated with the score or length of session.
  // A longer session yields higher confidence in the rating.
  const confidenceLevel = Math.min(1, snapshot.elapsedTime / 60000); // Max confidence at 1 minute

  // 2. Rules Evaluation (Strengths & Weaknesses)
  const ruleOutputs = evaluateRules(snapshot);

  // 3. Recommendations & Next Goal
  const recommendationOutputs = generateRecommendations(snapshot, ruleOutputs);

  // 4. Badges (and Milestones)
  const achievements = evaluateBadges(snapshot);
  // const milestones = evaluateMilestones(snapshot);

  // 5. Localization / String Generation
  const strengths = resolveStrengths(ruleOutputs.strengthsKeys);
  const weaknesses = resolveWeaknesses(ruleOutputs.weaknessesKeys);
  const recommendations = resolveRecommendations(recommendationOutputs.recommendationKeys);
  const nextGoal = resolveGoal(recommendationOutputs.nextGoalKey);

  return {
    overallRating,
    overallMessage,
    strengths,
    weaknesses,
    recommendations,
    achievements,
    nextGoal,
    confidenceLevel,
  };
}
