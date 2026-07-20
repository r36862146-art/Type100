// ============================================================
// ANALYTICS FACADE
// Delegates strictly typed events to the core EventBus.
// ============================================================

import type { ExamId, ExamOrganization } from "../exam/types";
import { eventBus } from "@/core/analytics/EventBus";

export const analytics = {
  trackSimulationStarted: (payload: {
    examId: ExamId;
    organization: ExamOrganization;
    isOfficial: boolean;
    mode: string;
  }) => {
    eventBus.publish("SimulationStarted", payload);
  },

  trackExamCompleted: (payload: {
    examId: ExamId;
    organization: ExamOrganization;
    wpm: number;
    accuracy: number;
    qualifies: boolean;
  }) => {
    eventBus.publish("TypingCompleted", payload);
  },

  trackPersonalBest: (payload: {
    examId: ExamId;
    previousWpm: number;
    newWpm: number;
  }) => {
    eventBus.publish("PersonalBest", payload);
  },

  trackDatasetLoaded: (payload: {
    examId: ExamId;
    language: string;
    passageCount: number;
  }) => {
    eventBus.publish("DatasetLoaded", payload);
  },

  trackSettingsChanged: (payload: {
    settingKey: string;
    newValue: any;
  }) => {
    eventBus.publish("SettingsUpdated", payload);
  },

  trackDashboardViewed: () => {
    // We can map this to a generic event if needed, or omit.
  },
};
