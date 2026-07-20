// ============================================================
// ANDAMAN CHSL REGISTRY — Phase 8.4
// Exam profiles for Andaman & Nicobar Administration
// Combined Higher Secondary Level.
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * Andaman CHSL — LDC English Typing Test
 * Lower Division Clerk.
 * Qualifying: 35 WPM, 90% accuracy, 10 min.
 */
export const ANDAMAN_CHSL_LDC_EN: ExamProfile = {
  id: "andaman_chsl",
  organization: "Andaman",
  exam: "Combined Higher Secondary Level (CHSL)",
  post: "Lower Division Clerk (LDC)",
  language: "en",
  duration: 10,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: [
    "general",
    "government",
    "economy",
    "current_affairs",
    "environment",
  ],
  description:
    "Typing Skill Test for Lower Division Clerk posts under Andaman & Nicobar " +
    "Administration CHSL. English medium. Candidates must achieve 35 WPM " +
    "with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "LDC",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    region: "Andaman & Nicobar Islands",
    authority: "Andaman & Nicobar Administration",
  },
};

/**
 * Andaman CHSL — LDC Hindi Typing Test
 * Lower Division Clerk (Hindi medium).
 * Qualifying: 30 WPM, 90% accuracy, 10 min.
 */
export const ANDAMAN_CHSL_LDC_HI: ExamProfile = {
  id: "andaman_chsl",
  organization: "Andaman",
  exam: "Combined Higher Secondary Level (CHSL)",
  post: "Lower Division Clerk (LDC) — Hindi",
  language: "hi",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing Skill Test for Lower Division Clerk posts (Hindi medium) under " +
    "Andaman & Nicobar Administration CHSL. Candidates must achieve 30 WPM " +
    "with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "LDC_HI",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    region: "Andaman & Nicobar Islands",
    authority: "Andaman & Nicobar Administration",
  },
};

export const CHSL_PROFILES: ExamProfile[] = [
  ANDAMAN_CHSL_LDC_EN,
  ANDAMAN_CHSL_LDC_HI,
];
