export type AchievementCategory = "Speed" | "Accuracy" | "Consistency" | "Practice" | "Streak" | "Government Exams" | "Milestones";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string; // lucide icon name
  points: number;
  
  // Evaluates an analytics event to see if it unlocks this achievement
  unlockCondition: (event: any, state: any) => boolean;
  
  reward?: string;
  metadata?: Record<string, any>;
}

export interface AchievementState {
  unlockedIds: string[];
  points: number;
  unlockAchievement: (id: string, points: number) => void;
}
