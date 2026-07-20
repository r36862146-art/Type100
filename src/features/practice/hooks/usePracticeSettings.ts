import { useState, useEffect, useCallback } from "react";
import { PracticeConfig } from "../types";

const STORAGE_KEY = "type100_practice_settings";

const DEFAULT_CONFIG: PracticeConfig = {
  mode: "learning",
  language: "en",
  length: 60,
  difficulty: "medium",
};

export function usePracticeSettings(initialConfig?: Partial<PracticeConfig>) {
  const [isClient, setIsClient] = useState(false);
  
  // Start with default config for SSR to match server render
  const [config, setConfigState] = useState<PracticeConfig>(() => {
    const merged = {
      ...DEFAULT_CONFIG,
      ...initialConfig,
    };
    if (merged.mode === "exam" && !merged.examId) {
      merged.mode = "learning";
    }
    return merged;
  });

  // Load from local storage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (parsed.mode && !["practice", "learning", "custom", "exam"].includes(parsed.mode)) {
          parsed.mode = "learning";
        }
        
        setConfigState((prev) => {
          const merged = {
            ...prev,
            ...parsed,
            ...initialConfig, // explicit overrides take precedence
          };
          
          if (merged.mode === "exam" && !merged.examId) {
            merged.mode = "learning";
          }
          
          return merged;
        });
      }
    } catch (e) {
      console.warn("Failed to parse practice settings from local storage.", e);
    }
  }, [initialConfig]);

  const setConfig = useCallback((newConfig: Partial<PracticeConfig>) => {
    setConfigState((prev) => {
      const updated = { ...prev, ...newConfig };
      
      try {
        const toSave = { ...updated };
        delete toSave.customText; // Do not persist active custom text to force editor on reload
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.warn("Failed to save practice settings to local storage.", e);
      }
      
      return updated;
    });
  }, []);

  return { config, setConfig, isReady: isClient };
}
