import { ResultsSnapshot } from "../types";
import { Milestone } from "./types";

/**
 * Evaluates milestones. 
 * Note: Since the ResultsSnapshot only contains data for the current session,
 * this function acts as a placeholder for when historical context is provided,
 * or it returns milestones that can be inferred purely locally.
 */
export function evaluateMilestones(snapshot: ResultsSnapshot): Milestone[] {
  const milestones: Milestone[] = [];

  // Currently we don't have a history store passed in.
  // In the future, this signature can be expanded: 
  // export function evaluateMilestones(snapshot: ResultsSnapshot, history: UserHistory)
  
  return milestones;
}
