"use client";

// ============================================================
// useRRBSettings HOOK — Phase 8.3
// Persists user's RRB-specific selections to localStorage.
// Settings: selected post, language, practice mode, simulation mode.
// ============================================================

import { useState, useCallback, useEffect } from "react";
import type { ExamId, ExamLanguage } from "@/features/exam/types";
import type { RRBPracticeMode } from "../services/rrbRules";

// ----------------------------------------------------------------
// Storage key (no magic strings)
// ----------------------------------------------------------------

const RRB_SETTINGS_STORAGE_KEY = "type100_rrb_settings";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export interface RRBSettings {
  /** Selected exam (rrb_ntpc | rrb_typing) */
  examId: ExamId | null;

  /** Selected post name */
  post: string | null;

  /** Selected language */
  language: ExamLanguage;

  /** Selected practice mode */
  practiceMode: RRBPracticeMode;

  /** Whether official simulation is active */
  simulationMode: "practice" | "official";
}

const DEFAULT_SETTINGS: RRBSettings = {
  examId: "rrb_ntpc",
  post: null,
  language: "en",
  practiceMode: "practice_timed",
  simulationMode: "practice",
};

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

/**
 * Persists RRB user settings to localStorage.
 * Returns current settings + a stable setter.
 */
export function useRRBSettings(): [
  RRBSettings,
  (updates: Partial<RRBSettings>) => void,
  () => void,
] {
  const [settings, setSettingsState] = useState<RRBSettings>(() => {
    // Read from localStorage on first mount (client-only)
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(RRB_SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<RRBSettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist to localStorage whenever settings change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        RRB_SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch {
      // localStorage may be unavailable (private browsing, storage full)
    }
  }, [settings]);

  const updateSettings = useCallback(
    (updates: Partial<RRBSettings>) => {
      setSettingsState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(RRB_SETTINGS_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, []);

  return [settings, updateSettings, resetSettings];
}
