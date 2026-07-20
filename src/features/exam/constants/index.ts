// ============================================================
// EXAM CONSTANTS — Phase 8.1
// Shared constants, labels, and thresholds.
// ============================================================

import type {
  ExamOrganization,
  ExamLanguage,
  QualificationStatus,
  ReadinessLevel,
  ExamSettings,
} from "../types";

// ----------------------------------------------------------------
// Organization display labels
// ----------------------------------------------------------------

export const ORGANIZATION_LABELS: Record<ExamOrganization, string> = {
  SSC: "Staff Selection Commission (SSC)",
  RRB: "Railway Recruitment Board (RRB)",
  Andaman: "Andaman & Nicobar Administration",
};

export const ORGANIZATION_ABBREVIATIONS: Record<ExamOrganization, string> = {
  SSC: "SSC",
  RRB: "RRB",
  Andaman: "A&N",
};

// ----------------------------------------------------------------
// Language labels
// ----------------------------------------------------------------

export const LANGUAGE_LABELS: Record<ExamLanguage, string> = {
  en: "English",
  hi: "Hindi",
};

// ----------------------------------------------------------------
// Qualification status labels & descriptions
// ----------------------------------------------------------------

export const QUALIFICATION_STATUS_LABELS: Record<QualificationStatus, string> = {
  qualified: "Qualified",
  nearly_ready: "Nearly Ready",
  needs_improvement: "Needs Improvement",
};

export const QUALIFICATION_STATUS_DESCRIPTIONS: Record<QualificationStatus, string> = {
  qualified: "You meet the speed and accuracy requirements for this exam.",
  nearly_ready: "You're close! A little more practice and you'll be ready.",
  needs_improvement: "Keep practicing consistently to reach the qualifying standard.",
};

// ----------------------------------------------------------------
// Readiness level labels & thresholds
// ----------------------------------------------------------------

export const READINESS_LABELS: Record<ReadinessLevel, string> = {
  ready: "Ready",
  almost_ready: "Almost Ready",
  needs_practice: "Needs Practice",
};

/**
 * Thresholds for computing readiness level.
 * If both WPM and accuracy are within READY_THRESHOLD of target → ready
 * If within ALMOST_THRESHOLD → almost_ready
 * Otherwise → needs_practice
 */
export const READINESS_THRESHOLDS = {
  /** WPM percentage above target to be considered "ready" */
  READY_WPM_PERCENT: 0,       // must meet or exceed target
  READY_ACCURACY_PERCENT: 0,  // must meet or exceed target

  /** WPM within this percentage below target → "almost_ready" */
  ALMOST_READY_WPM_DELTA: 10,
  /** Accuracy within this many points below target → "almost_ready" */
  ALMOST_READY_ACCURACY_DELTA: 5,
} as const;

// ----------------------------------------------------------------
// Qualification thresholds
// ----------------------------------------------------------------

/**
 * Thresholds for qualification engine.
 * "nearly_ready" means within this margin below the qualifying bar.
 */
export const QUALIFICATION_THRESHOLDS = {
  NEARLY_READY_WPM_DELTA: 8,        // within 8 WPM below qualifying speed
  NEARLY_READY_ACCURACY_DELTA: 3,   // within 3% below qualifying accuracy
} as const;

// ----------------------------------------------------------------
// Default settings
// ----------------------------------------------------------------

export const DEFAULT_EXAM_SETTINGS: ExamSettings = {
  organization: null,
  examId: null,
  post: null,
  language: "en",
};

// ----------------------------------------------------------------
// Storage keys
// ----------------------------------------------------------------

export const EXAM_SETTINGS_STORAGE_KEY = "type100_exam_settings";
export const EXAM_PROGRESS_STORAGE_KEY_PREFIX = "type100_exam_progress_";
