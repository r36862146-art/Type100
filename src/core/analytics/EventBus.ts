// ============================================================
// CORE ANALYTICS EVENT BUS
// A central abstraction layer for application events.
// Any feature can publish events, and any service can subscribe.
// ============================================================

export type AnalyticsEventType =
  | "PracticeStarted"
  | "SimulationStarted"
  | "TypingCompleted"
  | "PersonalBest"
  | "AchievementUnlocked"
  | "GoalCompleted"
  | "DatasetLoaded"
  | "PluginLoaded"
  | "SettingsUpdated";

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  payload: Record<string, any>;
  timestamp: number;
}

export type EventSubscriber = (event: AnalyticsEvent) => void;

class EventBus {
  private subscribers: Set<EventSubscriber> = new Set();

  /**
   * Subscribe to all analytics events.
   */
  public subscribe(callback: EventSubscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Publish an event to all subscribers.
   */
  public publish(type: AnalyticsEventType, payload: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };
    
    // Asynchronously dispatch to avoid blocking the critical path
    setTimeout(() => {
      this.subscribers.forEach((callback) => {
        try {
          callback(event);
        } catch (error) {
          console.error(`[EventBus] Subscriber failed on ${type}:`, error);
        }
      });
    }, 0);
  }
}

export const eventBus = new EventBus();

// Default subscriber for development logging (fulfills the requirement of no 3rd party providers)
if (process.env.NODE_ENV === "development") {
  eventBus.subscribe((event) => {
    console.debug(`[Analytics Event] ${event.type}`, event.payload);
  });
}
