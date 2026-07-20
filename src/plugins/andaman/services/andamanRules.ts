// ============================================================
// ANDAMAN RULES ENGINE — Phase 8.4
// AndamanRules interface + per-post rule configurations.
// Extends the RRB pattern with:
//   - instructions: string[]  (per-exam official rule text)
//   - weak_long_words practice mode
// Pure functions only. No magic numbers. Everything configurable.
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// Practice mode union
// ----------------------------------------------------------------

export type AndamanPracticeMode =
  | "practice_unlimited"
  | "practice_timed"
  | "official_full"
  | "official_qualifying"
  | "weak_numbers"
  | "weak_capitals"
  | "weak_punctuation"
  | "weak_long_words";

// ----------------------------------------------------------------
// AndamanRules interface
// ----------------------------------------------------------------

export interface AndamanRules {
  /** Target WPM to qualify */
  targetWpm: number;

  /** Target accuracy percentage (0-100) */
  targetAccuracy: number;

  /** Exam/test duration in minutes */
  duration: number;

  /** Available typing languages */
  languageOptions: ExamLanguage[];

  /** Scoring method — always WPM for Andaman exams */
  qualifyingType: "wpm";

  /** Whether this config represents an official no-pause simulation */
  officialSimulation: boolean;

  /** Whether pausing is permitted (only in practice modes) */
  allowPause: boolean;

  /** Show live WPM/accuracy counter during the test */
  showLiveStats: boolean;

  /** Auto-submit when timer reaches zero */
  autoSubmit: boolean;

  /** Allow candidate to restart during the session */
  allowRestart: boolean;

  /** Supported practice modes for this configuration */
  practiceModes: AndamanPracticeMode[];

  /** Official font size in pixels */
  fontSizePx: number;

  /** Official line height in pixels */
  lineHeightPx: number;

  /** Official passage width in characters */
  passageWidthCh: number;

  /**
   * Official instruction text lines.
   * Sourced from examBranding.ts — never hardcoded here.
   * Components render this directly.
   */
  instructions: string[];
}

// ----------------------------------------------------------------
// Constants — no magic numbers
// ----------------------------------------------------------------

const OFFICIAL_FONT_SIZE_PX = 16;
const OFFICIAL_LINE_HEIGHT_PX = 28;
const OFFICIAL_PASSAGE_WIDTH_CH = 80;

const ALL_PRACTICE_MODES: AndamanPracticeMode[] = [
  "practice_unlimited",
  "practice_timed",
  "official_full",
  "official_qualifying",
  "weak_numbers",
  "weak_capitals",
  "weak_punctuation",
  "weak_long_words",
];

const PRACTICE_ONLY_MODES: AndamanPracticeMode[] = [
  "practice_unlimited",
  "practice_timed",
  "weak_numbers",
  "weak_capitals",
  "weak_punctuation",
  "weak_long_words",
];

// Instruction text imported via branding (no magic strings)
import { ANDAMAN_INSTRUCTIONS } from "../assets/examBranding";

// ----------------------------------------------------------------
// Per-post rule configurations
// ----------------------------------------------------------------

const ANDAMAN_RULES: Record<string, AndamanRules> = {
  // CHSL — English official (LDC 35 WPM)
  andaman_chsl_en: {
    targetWpm: 35,
    targetAccuracy: 90,
    duration: 10,
    languageOptions: ["en"],
    qualifyingType: "wpm",
    officialSimulation: true,
    allowPause: false,
    showLiveStats: true,
    autoSubmit: true,
    allowRestart: false,
    practiceModes: ALL_PRACTICE_MODES,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
    instructions: ANDAMAN_INSTRUCTIONS["andaman_chsl"],
  },

  // CHSL — Hindi official (LDC 30 WPM)
  andaman_chsl_hi: {
    targetWpm: 30,
    targetAccuracy: 90,
    duration: 10,
    languageOptions: ["hi"],
    qualifyingType: "wpm",
    officialSimulation: true,
    allowPause: false,
    showLiveStats: true,
    autoSubmit: true,
    allowRestart: false,
    practiceModes: ALL_PRACTICE_MODES,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
    instructions: ANDAMAN_INSTRUCTIONS["andaman_chsl"],
  },

  // MTS — practice-only English (25 WPM preparatory)
  andaman_mts_en: {
    targetWpm: 25,
    targetAccuracy: 85,
    duration: 10,
    languageOptions: ["en"],
    qualifyingType: "wpm",
    officialSimulation: false,
    allowPause: true,
    showLiveStats: true,
    autoSubmit: false,
    allowRestart: true,
    practiceModes: PRACTICE_ONLY_MODES,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
    instructions: ANDAMAN_INSTRUCTIONS["andaman_mts"],
  },

  // Practice — English with pause/restart enabled
  andaman_practice_en: {
    targetWpm: 35,
    targetAccuracy: 90,
    duration: 5,
    languageOptions: ["en"],
    qualifyingType: "wpm",
    officialSimulation: false,
    allowPause: true,
    showLiveStats: true,
    autoSubmit: false,
    allowRestart: true,
    practiceModes: ALL_PRACTICE_MODES,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
    instructions: ANDAMAN_INSTRUCTIONS["andaman_chsl"],
  },

  // Practice — Hindi with pause/restart enabled
  andaman_practice_hi: {
    targetWpm: 30,
    targetAccuracy: 90,
    duration: 5,
    languageOptions: ["hi"],
    qualifyingType: "wpm",
    officialSimulation: false,
    allowPause: true,
    showLiveStats: true,
    autoSubmit: false,
    allowRestart: true,
    practiceModes: ALL_PRACTICE_MODES,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
    instructions: ANDAMAN_INSTRUCTIONS["andaman_chsl"],
  },
};

// ----------------------------------------------------------------
// Public API — pure functions
// ----------------------------------------------------------------

/**
 * Returns AndamanRules for a given rule key.
 * Falls back to andaman_chsl_en if key is unknown.
 */
export function getRules(ruleKey: string): AndamanRules {
  return ANDAMAN_RULES[ruleKey] ?? ANDAMAN_RULES["andaman_chsl_en"];
}

/**
 * Returns official rules for a given exam + language pair.
 */
export function getRulesForExam(
  examId: ExamId,
  language: ExamLanguage
): AndamanRules {
  if (examId === "andaman_chsl") {
    return language === "hi"
      ? ANDAMAN_RULES["andaman_chsl_hi"]
      : ANDAMAN_RULES["andaman_chsl_en"];
  }
  if (examId === "andaman_mts") {
    return ANDAMAN_RULES["andaman_mts_en"];
  }
  return ANDAMAN_RULES["andaman_chsl_en"];
}

/**
 * Returns practice-mode rules (pause + restart allowed).
 */
export function getPracticeRules(language: ExamLanguage): AndamanRules {
  return language === "hi"
    ? ANDAMAN_RULES["andaman_practice_hi"]
    : ANDAMAN_RULES["andaman_practice_en"];
}

/**
 * Returns all known rule keys.
 */
export function getAllRuleKeys(): string[] {
  return Object.keys(ANDAMAN_RULES);
}

/**
 * Validates that an AndamanRules object has sane values.
 * Returns array of error strings (empty = valid).
 */
export function validateRules(rules: AndamanRules): string[] {
  const errors: string[] = [];
  if (rules.targetWpm <= 0) errors.push("targetWpm must be > 0");
  if (rules.targetAccuracy < 0 || rules.targetAccuracy > 100)
    errors.push("targetAccuracy must be 0–100");
  if (rules.duration <= 0) errors.push("duration must be > 0");
  if (rules.languageOptions.length === 0)
    errors.push("languageOptions must have at least one entry");
  if (rules.fontSizePx <= 0) errors.push("fontSizePx must be > 0");
  if (rules.lineHeightPx <= 0) errors.push("lineHeightPx must be > 0");
  if (rules.passageWidthCh <= 0) errors.push("passageWidthCh must be > 0");
  if (!Array.isArray(rules.instructions))
    errors.push("instructions must be an array");
  return errors;
}

/**
 * Returns a safe default rules object (CHSL English official).
 */
export function getDefaultRules(): AndamanRules {
  return { ...ANDAMAN_RULES["andaman_chsl_en"] };
}

/**
 * Returns the human-readable label for an Andaman practice mode.
 */
export function getPracticeModeLabel(mode: AndamanPracticeMode): string {
  const labels: Record<AndamanPracticeMode, string> = {
    practice_unlimited: "Unlimited Practice",
    practice_timed: "Timed Practice",
    official_full: "Official Full Test",
    official_qualifying: "Qualifying Test",
    weak_numbers: "Weak Area: Numbers",
    weak_capitals: "Weak Area: Capital Letters",
    weak_punctuation: "Weak Area: Punctuation",
    weak_long_words: "Weak Area: Long Words",
  };
  return labels[mode];
}
