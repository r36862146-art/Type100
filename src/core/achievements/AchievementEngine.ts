import { eventBus } from "../analytics/EventBus";
import { achievementRegistry } from "./AchievementRegistry";
import { useAchievementStore } from "./AchievementStore";

class AchievementEngine {
  public startListening() {
    eventBus.subscribe((event) => {
      // Don't evaluate during SSR
      if (typeof window === "undefined") return;

      const store = useAchievementStore.getState();
      const allAchievements = achievementRegistry.getAll();

      allAchievements.forEach(achievement => {
        // Skip already unlocked
        if (store.unlockedIds.includes(achievement.id)) return;

        // Check condition
        try {
          if (achievement.unlockCondition(event, store)) {
            store.unlockAchievement(achievement.id, achievement.points);
            
            // Dispatch a special event for the UI to show a toast/notification
            eventBus.publish("AchievementUnlocked", { 
              achievementId: achievement.id, 
              title: achievement.title 
            });
          }
        } catch (error) {
          console.error(`[AchievementEngine] Failed to evaluate condition for ${achievement.id}`, error);
        }
      });
    });
  }
}

export const achievementEngine = new AchievementEngine();

// Start engine in browser environment
if (typeof window !== "undefined") {
  achievementEngine.startListening();
}
