// ============================================================
// RRB NTPC REGISTRY — Phase 8.3
// Exam profiles for Railway Recruitment Board NTPC.
// All profiles extend ExamProfile from Phase 8.1.
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * RRB NTPC — Junior Clerk cum Typist (English)
 * Qualifying: 30 WPM, 90% accuracy, 10 min.
 */
export const RRB_NTPC_JUNIOR_CLERK_EN: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Junior Clerk cum Typist",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "economy"],
  description:
    "Typing Skill Test for Junior Clerk cum Typist post under RRB NTPC. " +
    "English medium. Candidates must achieve 30 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "JCT",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB NTPC — Junior Clerk cum Typist (Hindi)
 * Hindi qualifying: 25 WPM, 90% accuracy, 10 min.
 */
export const RRB_NTPC_JUNIOR_CLERK_HI: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Junior Clerk cum Typist (Hindi)",
  language: "hi",
  duration: 10,
  qualifyingSpeed: 25,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing Skill Test for Junior Clerk cum Typist post under RRB NTPC. " +
    "Hindi medium. Candidates must achieve 25 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "JCT",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB NTPC — Accounts Clerk cum Typist (English)
 * Qualifying: 30 WPM, 90% accuracy, 10 min.
 */
export const RRB_NTPC_ACCOUNTS_CLERK_EN: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Accounts Clerk cum Typist",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["economy", "government", "general"],
  description:
    "Typing Skill Test for Accounts Clerk cum Typist post under RRB NTPC. " +
    "English medium. Candidates must achieve 30 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "ACT",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB NTPC — Junior Time Keeper (English)
 * Qualifying: 30 WPM, 90% accuracy, 10 min.
 * English only post.
 */
export const RRB_NTPC_JUNIOR_TIME_KEEPER_EN: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Junior Time Keeper",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing Skill Test for Junior Time Keeper post under RRB NTPC. " +
    "English medium only. Candidates must achieve 30 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "JTK",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB NTPC — Senior Clerk cum Typist (English)
 * Qualifying: 30 WPM, 90% accuracy, 10 min.
 */
export const RRB_NTPC_SENIOR_CLERK_EN: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Senior Clerk cum Typist",
  language: "en",
  duration: 10,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "current_affairs"],
  description:
    "Typing Skill Test for Senior Clerk cum Typist post under RRB NTPC. " +
    "English medium. Candidates must achieve 30 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "SCT",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

/**
 * RRB NTPC — Senior Clerk cum Typist (Hindi)
 * Hindi qualifying: 25 WPM, 90% accuracy, 10 min.
 */
export const RRB_NTPC_SENIOR_CLERK_HI: ExamProfile = {
  id: "rrb_ntpc",
  organization: "RRB",
  exam: "Non-Technical Popular Categories (NTPC)",
  post: "Senior Clerk cum Typist (Hindi)",
  language: "hi",
  duration: 10,
  qualifyingSpeed: 25,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Typing Skill Test for Senior Clerk cum Typist post under RRB NTPC. " +
    "Hindi medium. Candidates must achieve 25 WPM with 90% accuracy in 10 minutes.",
  metadata: {
    postCode: "SCT",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    practiceMode: true,
  },
};

export const NTPC_PROFILES: ExamProfile[] = [
  RRB_NTPC_JUNIOR_CLERK_EN,
  RRB_NTPC_JUNIOR_CLERK_HI,
  RRB_NTPC_ACCOUNTS_CLERK_EN,
  RRB_NTPC_JUNIOR_TIME_KEEPER_EN,
  RRB_NTPC_SENIOR_CLERK_EN,
  RRB_NTPC_SENIOR_CLERK_HI,
];
