import type { ExamProgress } from "@/features/exam/types";

export interface SmartRecommendation {
  id: string;
  type: "speed" | "accuracy" | "consistency" | "practice_mode" | "general" | "rhythm" | "correction";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

/**
 * Core Recommendation Engine
 * Analyzes an ExamProgress object and granular statistics to return a list of smart, actionable recommendations.
 */
export class RecommendationEngine {
  
  public static generate(progress: ExamProgress, targetWpm: number, targetAccuracy: number): SmartRecommendation[] {
    const recommendations: SmartRecommendation[] = [];

    if (!progress.history || progress.history.length === 0) {
      return [
        {
          id: "rec_diagnostic",
          type: "general",
          title: "Take a Diagnostic Test",
          description: "Complete your first typing test to get personalized recommendations.",
          priority: "high",
        }
      ];
    }

    // Calculate trends over the last 5 attempts
    const recentAttempts = progress.history.slice(-5);
    const avgRecentWpm = recentAttempts.reduce((acc, curr) => acc + curr.wpm, 0) / recentAttempts.length;
    const avgRecentAcc = recentAttempts.reduce((acc, curr) => acc + curr.accuracy, 0) / recentAttempts.length;

    const wpmVariance = Math.max(...recentAttempts.map(a => a.wpm)) - Math.min(...recentAttempts.map(a => a.wpm));

    // 1. Accuracy Check
    if (avgRecentAcc < targetAccuracy) {
      recommendations.push({
        id: "rec_accuracy",
        type: "accuracy",
        title: "Focus on Accuracy Over Speed",
        description: `Your recent accuracy is ${avgRecentAcc.toFixed(1)}%, which is below the target of ${targetAccuracy}%. Slow down slightly to reduce errors.`,
        priority: "high",
      });
    }

    // 2. Speed Check
    if (avgRecentWpm < targetWpm) {
      const gap = (targetWpm - avgRecentWpm).toFixed(1);
      recommendations.push({
        id: "rec_speed",
        type: "speed",
        title: "Increase Sustained Speed",
        description: `You need to gain ${gap} WPM to reach your target. Try practicing short bursts (1-2 minutes) at higher speeds.`,
        priority: avgRecentAcc >= targetAccuracy ? "high" : "medium",
      });
    }

    // 3. Consistency Check
    if (wpmVariance > 10) {
      recommendations.push({
        id: "rec_consistency",
        type: "consistency",
        title: "Improve Consistency",
        description: "Your typing speed fluctuates significantly between tests. Focus on maintaining a steady rhythm rather than rushing bursts.",
        priority: "medium",
      });
    }

    // 4. Correction Rate Check (Mocked placeholder logic - would use typing engine stats)
    // In a real system, we look at the raw keystroke stats
    if (avgRecentAcc > 90 && avgRecentWpm < targetWpm) {
      recommendations.push({
        id: "rec_correction",
        type: "correction",
        title: "Reduce Backspace Usage",
        description: "Your accuracy is good, but you might be relying too much on backspace. Try typing deliberately without looking at the screen.",
        priority: "low",
      });
    }

    // 5. Milestone Check
    if (avgRecentWpm >= targetWpm && avgRecentAcc >= targetAccuracy) {
      recommendations.push({
        id: "rec_ready",
        type: "general",
        title: "Exam Ready!",
        description: "You are consistently meeting the qualifying standard. Switch to Official Simulation mode to build exam temperament.",
        priority: "high",
      });
    }

    return recommendations;
  }
}
