import { STRINGS } from "./strings";
import { RatingLevel } from "./types";

export function getOverallRating(score: number): RatingLevel {
  if (score >= 95) return "Outstanding";
  if (score >= 85) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Needs Improvement";
}

export function getOverallMessage(rating: RatingLevel): string {
  switch (rating) {
    case "Outstanding": return STRINGS.overalls.outstanding;
    case "Excellent": return STRINGS.overalls.excellent;
    case "Very Good": return STRINGS.overalls.veryGood;
    case "Good": return STRINGS.overalls.good;
    case "Average": return STRINGS.overalls.average;
    case "Needs Improvement": return STRINGS.overalls.needsImprovement;
    default: return STRINGS.overalls.good;
  }
}

export function resolveStrengths(keys: string[]): string[] {
  return keys.map(key => (STRINGS.strengths as Record<string, string>)[key] || key);
}

export function resolveWeaknesses(keys: string[]): string[] {
  return keys.map(key => (STRINGS.weaknesses as Record<string, string>)[key] || key);
}

export function resolveRecommendations(keys: string[]): string[] {
  return keys.map(key => (STRINGS.recommendations as Record<string, string>)[key] || key);
}

export function resolveGoal(key: string): string {
  return (STRINGS.goals as Record<string, string>)[key] || key;
}
