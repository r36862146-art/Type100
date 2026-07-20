export type RatingLevel = 
  | "Outstanding" 
  | "Excellent" 
  | "Very Good" 
  | "Good" 
  | "Average" 
  | "Needs Improvement";

export interface FeedbackBadge {
  id: string;
  name: string;
  description: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
}

export interface PerformanceFeedback {
  overallRating: RatingLevel;
  overallMessage: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  achievements: FeedbackBadge[];
  nextGoal: string;
  confidenceLevel: number; // 0 to 1
}
