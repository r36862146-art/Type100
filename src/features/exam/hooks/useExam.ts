"use client";

// ============================================================
// useExam HOOK — Phase 8.1
// Composing hook: settings persistence + registry lookup +
// readiness/qualification engines + progress tracking.
// ============================================================

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type {
  ExamSettings,
  ExamProfile,
  ExamOrganization,
  ExamId,
  ExamLanguage,
  ExamProgress,
  ReadinessReport,
  QualificationResult,
  ResultsSnapshot,
} from "../types";
import { DEFAULT_EXAM_SETTINGS, EXAM_SETTINGS_STORAGE_KEY } from "../constants";
import {
  loadOrganizations,
  loadExamsForOrg,
  loadPostsForExam,
  loadExamById,
} from "../services/examLoader";
import { computeReadiness } from "../services/readinessEngine";
import { computeQualification } from "../services/qualificationEngine";
import {
  getProgress,
  recordAttempt as recordAttemptService,
} from "../services/progressService";

// ----------------------------------------------------------------
// Settings persistence helpers
// ----------------------------------------------------------------

function readSettings(): ExamSettings {
  if (typeof window === "undefined") return DEFAULT_EXAM_SETTINGS;
  try {
    const oldKey = "type100_exam_settings";
    const oldData = localStorage.getItem(oldKey);
    if (oldData && !localStorage.getItem(EXAM_SETTINGS_STORAGE_KEY)) {
      localStorage.setItem(EXAM_SETTINGS_STORAGE_KEY, oldData);
      localStorage.removeItem(oldKey);
    }
    const raw = localStorage.getItem(EXAM_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_EXAM_SETTINGS;
    return JSON.parse(raw) as ExamSettings;
  } catch {
    return DEFAULT_EXAM_SETTINGS;
  }
}

function saveSettings(settings: ExamSettings): void {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(EXAM_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  } catch {
    // Storage unavailable — fail silently
  }
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export function useExam() {
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettingsState] = useState<ExamSettings>(DEFAULT_EXAM_SETTINGS);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    setSettingsState(readSettings());
  }, []);

  // -----------------------------------------------
  // Active profile
  // -----------------------------------------------
  const activeProfile = useMemo<ExamProfile | undefined>(() => {
    if (!settings.examId) return undefined;
    return loadExamById(settings.examId);
  }, [settings.examId]);

  // -----------------------------------------------
  // Available selections (driven by registry)
  // -----------------------------------------------
  const availableOrganizations = useMemo(() => loadOrganizations(), []);

  const availableExams = useMemo<string[]>(() => {
    if (!settings.organization) return [];
    return loadExamsForOrg(settings.organization);
  }, [settings.organization]);

  const availablePosts = useMemo<ExamProfile[]>(() => {
    if (!settings.organization || !settings.examId) return [];
    const profile = loadExamById(settings.examId);
    if (!profile) return [];
    return loadPostsForExam(settings.organization, profile.exam);
  }, [settings.organization, settings.examId]);

  // -----------------------------------------------
  // Progress
  // -----------------------------------------------
  const [progress, setProgress] = useState<ExamProgress | null>(null);

  useEffect(() => {
    if (settings.examId) {
      setProgress(getProgress(settings.examId));
    } else {
      setProgress(null);
    }
  }, [settings.examId]);

  // -----------------------------------------------
  // Settings updaters
  // -----------------------------------------------
  const setSettings = useCallback((patch: Partial<ExamSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...patch };
      saveSettings(updated);
      return updated;
    });
  }, []);

  const selectOrganization = useCallback(
    (org: ExamOrganization) => {
      setSettings({ organization: org, examId: null, post: null });
    },
    [setSettings]
  );

  const selectExam = useCallback(
    (examId: ExamId) => {
      const profile = loadExamById(examId);
      setSettings({
        examId,
        post: profile?.post ?? null,
        language: profile?.language ?? "en",
      });
    },
    [setSettings]
  );

  const selectLanguage = useCallback(
    (language: ExamLanguage) => {
      setSettings({ language });
    },
    [setSettings]
  );

  const clearSelection = useCallback(() => {
    setSettings(DEFAULT_EXAM_SETTINGS);
  }, [setSettings]);

  // -----------------------------------------------
  // Engine computations (memoized)
  // -----------------------------------------------
  const computeReadinessForSnapshot = useCallback(
    (snapshot: ResultsSnapshot): ReadinessReport | null => {
      if (!activeProfile) return null;
      return computeReadiness(snapshot, activeProfile);
    },
    [activeProfile]
  );

  const computeQualificationForSnapshot = useCallback(
    (snapshot: ResultsSnapshot): QualificationResult | null => {
      if (!activeProfile) return null;
      return computeQualification(snapshot, activeProfile);
    },
    [activeProfile]
  );

  // -----------------------------------------------
  // Record an attempt
  // -----------------------------------------------
  const recordAttempt = useCallback(
    (snapshot: ResultsSnapshot) => {
      if (!settings.examId || !activeProfile) return;
      const qualified =
        snapshot.wpm >= activeProfile.qualifyingSpeed &&
        snapshot.accuracy >= activeProfile.qualifyingAccuracy;
      const updated = recordAttemptService(settings.examId, snapshot, qualified);
      setProgress(updated);
    },
    [settings.examId, activeProfile]
  );

  return {
    // State
    settings,
    isReady: isClient,
    activeProfile,
    progress,

    // Available options from registry
    availableOrganizations,
    availableExams,
    availablePosts,

    // Actions
    selectOrganization,
    selectExam,
    selectLanguage,
    clearSelection,
    recordAttempt,

    // Engine helpers
    computeReadinessForSnapshot,
    computeQualificationForSnapshot,
  };
}
