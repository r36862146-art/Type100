import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExamId, ExamLanguage, ExamOrganization } from "../exam/types";

export interface SettingsState {
  // Theme & Appearance
  theme: "light" | "dark" | "system";
  fontSizePx: number;
  typingFont: "georgia" | "monospace" | "inter" | "times";
  reduceMotion: boolean;
  highContrast: boolean;

  // Audio
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0

  // Keyboard
  keyboardShortcuts: boolean;

  // Defaults for Practice/Simulations
  defaultLanguage: ExamLanguage;
  defaultOrganization: ExamOrganization | null;
  defaultExamId: ExamId | null;
  
  // Actions
  updateSettings: (updates: Partial<Omit<SettingsState, "updateSettings" | "resetSettings">>) => void;
  resetSettings: () => void;
}

const DEFAULT_STATE = {
  theme: "system" as const,
  fontSizePx: 22,
  typingFont: "georgia" as const,
  reduceMotion: false,
  highContrast: false,
  soundEnabled: true,
  soundVolume: 0.5,
  keyboardShortcuts: true,
  defaultLanguage: "en" as const,
  defaultOrganization: null,
  defaultExamId: null,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      updateSettings: (updates) => set((state) => ({ ...state, ...updates })),
      resetSettings: () => set(DEFAULT_STATE),
    }),
    {
      name: "type100-global-settings",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
