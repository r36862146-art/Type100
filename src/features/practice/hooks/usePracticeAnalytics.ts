import { useRef, useCallback } from "react";
import { PracticeMode } from "../types";

export type AnalyticsEvent = 
  | "practice_started"
  | "practice_completed"
  | "mode_changed"
  | "language_changed"
  | "settings_changed"
  | "custom_text_used";

export function trackAnalyticsEvent(eventName: AnalyticsEvent, payload?: Record<string, any>) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("type100_analytics", {
      detail: { event: eventName, timestamp: Date.now(), ...payload },
    });
    window.dispatchEvent(event);
  }
}

export function usePracticeAnalytics() {
  const previousMode = useRef<PracticeMode | null>(null);

  const trackEvent = useCallback((eventName: AnalyticsEvent, payload?: Record<string, any>) => {
    trackAnalyticsEvent(eventName, payload);
  }, []);

  const trackModeChange = useCallback((newMode: PracticeMode) => {
    if (previousMode.current !== newMode && previousMode.current !== null) {
      trackAnalyticsEvent("mode_changed", { from: previousMode.current, to: newMode });
    }
    previousMode.current = newMode;
  }, []);

  return {
    trackEvent,
    trackModeChange,
  };
}
