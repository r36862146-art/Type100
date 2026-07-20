// ============================================================
// SSC CHSL REGISTRY — Phase 8.2
// Exam profiles for SSC Combined Higher Secondary Level.
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * SSC CHSL — LDC/JSA Typing Test (English)
 * Lower Division Clerk / Junior Secretariat Assistant.
 * Qualifying: 35 WPM, 90% accuracy, 10 min.
 */
export const SSC_CHSL_LDC_JSA_EN: ExamProfile = {
  id: "ssc_chsl",
  organization: "SSC",
  exam: "Combined Higher Secondary Level (CHSL)",
  post: "Lower Division Clerk / Junior Secretariat Assistant",
  language: "en",
  duration: 10,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "current_affairs"],
  description:
    "Typing test for LDC/JSA posts under SSC CHSL. English medium. " +
    "Candidates must type 35 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    mode: "typing",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
  },
};

/**
 * SSC CHSL — LDC/JSA Typing Test (Hindi)
 * Hindi qualifying: 30 WPM, 90% accuracy.
 */
export const SSC_CHSL_LDC_JSA_HI: ExamProfile = {
  id: "ssc_chsl",
  organization: "SSC",
  exam: "Combined Higher Secondary Level (CHSL)",
  post: "Lower Division Clerk / Junior Secretariat Assistant (Hindi)",
  language: "hi",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing test for LDC/JSA posts. Hindi medium. " +
    "Candidates must type 30 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    mode: "typing",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
  },
};

/**
 * SSC CHSL — DEO Data Entry Skill Test
 * Data Entry Operator.
 * Qualifying: 8,000 key depressions per hour (KPH), 15 min.
 * Equivalent to approximately 27 WPM (8000 / 5 / 60).
 */
export const SSC_CHSL_DEO: ExamProfile = {
  id: "ssc_chsl",
  organization: "SSC",
  exam: "Combined Higher Secondary Level (CHSL)",
  post: "Data Entry Operator (DEO)",
  language: "en",
  duration: 15,
  qualifyingSpeed: 27,        // derived: 8000 KPH / 5 chars/word / 60 min
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "economy"],
  description:
    "Data Entry Skill Test for DEO posts under SSC CHSL. English medium. " +
    "Candidates must achieve 8,000 key depressions per hour in 15 minutes.",
  metadata: {
    mode: "DEO",
    qualifyingType: "keystrokes_per_hour",
    qualifyingKPH: 8000,
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
  },
};

export const CHSL_PROFILES: ExamProfile[] = [
  SSC_CHSL_LDC_JSA_EN,
  SSC_CHSL_LDC_JSA_HI,
  SSC_CHSL_DEO,
];
