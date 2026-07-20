// ============================================================
// RRB POSTS REGISTRY — Phase 8.3
// RRB Typing Posts (standalone typing posts beyond NTPC).
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * RRB Typing Posts — Typist Grade III (English)
 * Qualifying: 40 WPM, 92% accuracy, 10 min.
 */
export const RRB_TYPING_TYPIST_EN: ExamProfile = {
  id: "rrb_typing",
  organization: "RRB",
  exam: "RRB Typing Posts",
  post: "Typist Grade III",
  language: "en",
  duration: 10,
  qualifyingSpeed: 40,
  qualifyingAccuracy: 92,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "current_affairs"],
  description:
    "Typing test for Typist Grade III posts via Railway Recruitment Board. " +
    "English medium. Candidates must achieve 40 WPM with 92% accuracy in 10 minutes.",
  metadata: {
    postCode: "TYP3",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB Typing Posts — Stenographer (English)
 * Qualifying: 40 WPM, 92% accuracy, 10 min.
 */
export const RRB_TYPING_STENO_EN: ExamProfile = {
  id: "rrb_typing",
  organization: "RRB",
  exam: "RRB Typing Posts",
  post: "Stenographer Grade D",
  language: "en",
  duration: 10,
  qualifyingSpeed: 40,
  qualifyingAccuracy: 92,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing component of the Stenographer Grade D test via Railway Recruitment Board. " +
    "English medium. 40 WPM with 92% accuracy required.",
  metadata: {
    postCode: "STENO",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

export const RRB_POSTS_PROFILES: ExamProfile[] = [
  RRB_TYPING_TYPIST_EN,
  RRB_TYPING_STENO_EN,
];
