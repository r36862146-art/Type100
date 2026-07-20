// ============================================================
// SSC CGL REGISTRY — Phase 8.2
// Exam profiles for SSC Combined Graduate Level.
// Consumed by ssc/registry/index.ts → examRegistry.
// ============================================================

import type { ExamProfile } from "@/features/exam/types";

/**
 * SSC CGL — DEST (Data Entry Speed Test)
 * Tax Assistant & Upper Division Clerk posts.
 * Qualifying: 35 WPM (English) | 30 WPM (Hindi), 90% accuracy, 15 min.
 */
export const SSC_CGL_DEST_EN: ExamProfile = {
  id: "ssc_cgl",
  organization: "SSC",
  exam: "Combined Graduate Level (CGL)",
  post: "Tax Assistant / Upper Division Clerk — DEST",
  language: "en",
  duration: 15,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government", "economy"],
  description:
    "Data Entry Speed Test for Tax Assistant & UDC posts. English medium. " +
    "Candidates must achieve 35 WPM with 90% accuracy in 15 minutes.",
  metadata: {
    mode: "DEST",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    cptStub: true,
  },
};

/**
 * SSC CGL — DEST (Hindi medium)
 * Hindi qualifying: 30 WPM, 90% accuracy.
 */
export const SSC_CGL_DEST_HI: ExamProfile = {
  id: "ssc_cgl",
  organization: "SSC",
  exam: "Combined Graduate Level (CGL)",
  post: "Tax Assistant / Upper Division Clerk — DEST (Hindi)",
  language: "hi",
  duration: 15,
  qualifyingSpeed: 30,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Data Entry Speed Test for Tax Assistant & UDC posts. Hindi medium. " +
    "Candidates must achieve 30 WPM with 90% accuracy in 15 minutes.",
  metadata: {
    mode: "DEST",
    qualifyingType: "wpm",
    allowLiveStats: true,
    officialFontSizePx: 16,
    officialLineHeightPx: 28,
    officialPassageWidthCh: 80,
    cptStub: true,
  },
};

/**
 * SSC CGL — CPT placeholder (Computer Proficiency Test)
 * Full implementation deferred to Phase 9+.
 * Typing component only; Excel/Word proficiency not simulated.
 */
export const SSC_CGL_CPT_STUB: ExamProfile = {
  id: "ssc_cgl",
  organization: "SSC",
  exam: "Combined Graduate Level (CGL)",
  post: "Assistant Section Officer — CPT (Stub)",
  language: "en",
  duration: 45,
  qualifyingSpeed: 35,
  qualifyingAccuracy: 90,
  typingTestRequired: true,
  timerEnabled: true,
  passageCategories: ["general", "government"],
  description:
    "Computer Proficiency Test stub. Full Excel/Word proficiency testing is deferred to Phase 9. " +
    "Currently only the typing component is available.",
  metadata: {
    mode: "CPT",
    qualifyingType: "wpm",
    stub: true,
  },
};

export const CGL_PROFILES: ExamProfile[] = [SSC_CGL_DEST_EN, SSC_CGL_DEST_HI];
