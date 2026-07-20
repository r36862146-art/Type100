"use client";

// ============================================================
// useAndamanSettings HOOK — Phase 8.4
// localStorage-backed settings persistence for the Andaman module.
// ============================================================

import { useState, useCallback, useEffect } from "react";
import type { ExamId, ExamLanguage } from "@/features/exam/types";
import type { AndamanPracticeMode } from "../services/andamanRules";

const ANDAMAN_SETTINGS_STORAGE_KEY = "type100_andaman_settings";

export interface AndamanSettings {
  examId: ExamId | null;
  post: string | null;
  language: ExamLanguage;
  practiceMode: AndamanPracticeMode;
  simulationMode: "practice" | "official";
}

const DEFAULT_SETTINGS: AndamanSettings = {
  examId: "andaman_chsl",
  post: null,
  language: "en",
  practiceMode: "practice_timed",
  simulationMode: "practice",
};

export function useAndamanSettings(): [
  AndamanSettings,
  (updates: Partial<AndamanSettings>) => void,
  () => void,
] {
  const [settings, setSettingsState] = useState<AndamanSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(ANDAMAN_SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AndamanSettings>) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ANDAMAN_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore — localStorage unavailable
    }
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AndamanSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(ANDAMAN_SETTINGS_STORAGE_KEY); } catch { /* ignore */ }
    }
  }, []);

  return [settings, updateSettings, resetSettings];
}
