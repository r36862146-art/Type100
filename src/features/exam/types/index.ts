// ============================================================
// EXAM TYPES — Phase 8.1 Foundation
// All government exam types are defined here.
// Do NOT add UI logic or exam-specific data here.
// ============================================================

import { ResultsSnapshot } from "../../results/types";

// ----------------------------------------------------------------
// Core Identifiers
// ----------------------------------------------------------------

export type ExamOrganization = "SSC" | "RRB" | "Andaman";

export type ExamId =
  | "ssc_cgl"
  | "ssc_chsl"
  | "rrb_ntpc"
  | "rrb_typing"
  | "andaman_chsl"
  | "andaman_mts";

export type ExamLanguage = "en" | "hi";

export type PassageCategory =
  | "general"
  | "government"
  | "economy"
  | "science"
  | "technology"
  | "environment"
  | "current_affairs";

export type PassageDifficulty = "easy" | "medium" | "hard";

// ----------------------------------------------------------------
// Exam Profile — canonical definition of every exam
// ----------------------------------------------------------------

export interface ExamProfile {
  /** Unique identifier for this exam entry */
  id: ExamId;

  /** The organizing body (SSC, RRB, Andaman) */
  organization: ExamOrganization;

  /** Full official name of the exam (e.g. "Combined Graduate Level") */
  exam: string;

  /** Official post name (e.g. "Tax Assistant", "Lower Division Clerk") */
  post: string;

  /** Supported typing language for this post */
  language: ExamLanguage;

  /** Typing test duration in minutes */
  duration: number;

  /** Minimum WPM required to qualify */
  qualifyingSpeed: number;

  /** Minimum accuracy percentage required to qualify (0-100) */
  qualifyingAccuracy: number;

  /** Whether a typing test is required for this post */
  typingTestRequired: boolean;

  /** Whether the exam enforces a live countdown timer */
  timerEnabled: boolean;

  /** Categories of passages used in the exam */
  passageCategories: PassageCategory[];

  /** Short human-readable description of this exam post */
  description: string;

  /** Arbitrary additional metadata (notifications, links, tags) */
  metadata?: Record<string, string | number | boolean>;
}

// ----------------------------------------------------------------
// Passage — data model stub (datasets added in Phase 8.2+)
// ----------------------------------------------------------------

export interface ExamPassage {
  /** Unique passage identifier */
  id: string;

  /** The exam this passage belongs to */
  organization: ExamOrganization;

  /** Exam ID this passage targets */
  exam: ExamId;

  /** Post this passage is calibrated for */
  post: string;

  /** Language of the passage */
  language: ExamLanguage;

  /** Title of the passage */
  title: string;

  /** Difficulty rating */
  difficulty: PassageDifficulty;

  /** Passage category */
  category: PassageCategory;

  /** The full typed text of the passage */
  text: string;

  /** Estimated WPM target for this passage */
  estimatedWPM: number;

  /** Estimated completion time in minutes */
  estimatedTime: number;

  /** Arbitrary passage-level metadata */
  metadata?: Record<string, string | number | boolean>;
}

// ----------------------------------------------------------------
// Readiness Engine — input/output types
// ----------------------------------------------------------------

export type ReadinessLevel = "ready" | "almost_ready" | "needs_practice";

export interface ReadinessReport {
  /** Current WPM from snapshot */
  currentWPM: number;

  /** Required WPM from ExamProfile */
  requiredWPM: number;

  /** WPM gap (positive = above target, negative = below) */
  wpmGap: number;

  /** Current accuracy from snapshot */
  currentAccuracy: number;

  /** Required accuracy from ExamProfile */
  requiredAccuracy: number;

  /** Accuracy gap (positive = above target, negative = below) */
  accuracyGap: number;

  /** Overall computed readiness level */
  overallReadiness: ReadinessLevel;

  /** Human-readable list of areas needing improvement */
  areasToImprove: string[];

  /** Estimated likelihood of qualification (0-100) */
  estimatedQualification: number;
}

// ----------------------------------------------------------------
// Qualification Engine — input/output types
// ----------------------------------------------------------------

export type QualificationStatus = "qualified" | "nearly_ready" | "needs_improvement";

export interface QualificationResult {
  /** Overall qualification status */
  status: QualificationStatus;

  /** Whether speed criterion is met */
  speedQualified: boolean;

  /** Whether accuracy criterion is met */
  accuracyQualified: boolean;

  /** Additional per-criterion details */
  details: {
    wpmShortfall: number;
    accuracyShortfall: number;
  };

  /** Human-readable next goal */
  nextGoal: string;

  /** Human-readable description of what's needed */
  requiredImprovement: string;
}

// ----------------------------------------------------------------
// Progress Tracking
// ----------------------------------------------------------------

export interface ExamAttempt {
  /** ISO timestamp of this attempt */
  timestamp: string;

  /** WPM achieved in this attempt */
  wpm: number;

  /** Accuracy achieved in this attempt */
  accuracy: number;

  /** Duration of the attempt in seconds */
  durationSeconds: number;

  /** Whether the attempt was a qualifying run */
  qualified: boolean;
}

export interface ExamProgress {
  /** The exam this progress belongs to */
  examId: ExamId;

  /** Total number of attempts recorded */
  attempts: number;

  /** Average WPM across all attempts */
  averageWPM: number;

  /** Best WPM achieved */
  bestWPM: number;

  /** Average accuracy across all attempts */
  averageAccuracy: number;

  /** Number of completed passages */
  completedPassages: number;

  /** ISO timestamp of last practice session */
  lastPracticed: string | null;

  /** Full history of individual attempts */
  history: ExamAttempt[];
}

// ----------------------------------------------------------------
// Exam Settings — user's persistent selection state
// ----------------------------------------------------------------

export interface ExamSettings {
  /** Selected organization */
  organization: ExamOrganization | null;

  /** Selected exam ID */
  examId: ExamId | null;

  /** Selected post name */
  post: string | null;

  /** Selected language */
  language: ExamLanguage;
}

// ----------------------------------------------------------------
// Re-export ResultsSnapshot for convenience
// ----------------------------------------------------------------
export type { ResultsSnapshot };
