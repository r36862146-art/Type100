import type { Achievement } from "./types";

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_test",
    title: "First Steps",
    description: "Complete your very first typing simulation.",
    category: "Milestones",
    icon: "Flag",
    points: 10,
    unlockCondition: (event) => event.type === "TypingCompleted"
  },
  {
    id: "speed_demon_40",
    title: "Speed Demon: 40 WPM",
    description: "Achieve a typing speed of 40 WPM or higher.",
    category: "Speed",
    icon: "Zap",
    points: 20,
    unlockCondition: (event) => event.type === "TypingCompleted" && event.payload.wpm >= 40
  },
  {
    id: "perfect_accuracy",
    title: "Sharpshooter",
    description: "Achieve 100% accuracy on any test.",
    category: "Accuracy",
    icon: "Target",
    points: 50,
    unlockCondition: (event) => event.type === "TypingCompleted" && event.payload.accuracy === 100
  },
  {
    id: "exam_ready",
    title: "Exam Ready",
    description: "Meet the qualifying standard for a government exam.",
    category: "Government Exams",
    icon: "Award",
    points: 50,
    unlockCondition: (event) => event.type === "TypingCompleted" && event.payload.qualifies === true
  }
];

class AchievementRegistry {
  private achievements: Map<string, Achievement> = new Map();

  constructor() {
    DEFAULT_ACHIEVEMENTS.forEach(a => this.register(a));
  }

  public register(achievement: Achievement) {
    this.achievements.set(achievement.id, achievement);
  }

  public getAll(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  public getById(id: string): Achievement | undefined {
    return this.achievements.get(id);
  }
}

export const achievementRegistry = new AchievementRegistry();
