// ============================================================
// ANDAMAN MATRICULATION (MTS) REGISTRY — Phase 8.4
// Exam profiles for Andaman & Nicobar Administration
// Common Matriculation Level (Multi-Tasking Staff).
//
// NOTE: MTS does not mandate typing in official recruitment.
// Included here as a practice-preparatory exam per Phase 8.4 spec.
// officialSimulation = false enforces practice-only mode.
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * Andaman MTS — Common Matriculation Level (English)
 * Multi-Tasking Staff.
 * Practice-only — no official typing mandate.
 * Target: 25 WPM, 85% accuracy, 10 min (preparatory standard).
 */
export const ANDAMAN_MTS_EN: ExamProfile = {
  id: "andaman_mts",
  organization: "Andaman",
  exam: "Common Matriculation Level (MTS)",
  post: "Multi-Tasking Staff (MTS)",
  language: "en",
  duration: 10,
  qualifyingSpeed: 25,
  qualifyingAccuracy: 85,
  typingTestRequired: false,
  timerEnabled: true,
  passageCategories: ["general", "environment", "science"],
  description:
    "Preparatory typing practice for Multi-Tasking Staff posts under " +
    "Andaman & Nicobar Administration. Typing is not a mandatory recruitment " +
    "criterion for MTS but this module helps candidates build foundational " +
    "skills for future CHSL examinations.",
  metadata: {
    postCode: "MTS",
    qualifyingType: "wpm",
    allowLiveStats: true,
    practiceOnly: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    region: "Andaman & Nicobar Islands",
    authority: "Andaman & Nicobar Administration",
  },
};

export const MTS_PROFILES: ExamProfile[] = [ANDAMAN_MTS_EN];
