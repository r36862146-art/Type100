// ============================================================
// RRB RULES ENGINE — Phase 8.3
// RRBRules interface + per-post rule configurations.
// Pure functions only. No magic numbers. Everything configurable.
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// RRBRules interface
// ----------------------------------------------------------------

export type RRBPracticeMode =
  | "practice_unlimited"
  | "practice_timed"
  | "official_full"
  | "official_qualifying"
  | "weak_numbers"
  | "weak_capitals"
  | "weak_punctuation";

export interface RRBRules {
  /** Target WPM to qualify */
  targetWpm: number;

  /** Target accuracy percentage (0-100) */
  targetAccuracy: number;

  /** Exam/test duration in minutes */
  duration: number;

  /** Available typing languages */
  languageOptions: ExamLanguage[];

  /** Scoring method — always WPM for RRB */
  qualifyingType: "wpm";

  /** Official no-pause simulation */
  officialSimulation: boolean;

  /** Whether pausing is permitted (only in practice modes) */
  allowPause: boolean;

  /** Show live WPM/accuracy counter during the test */
  showLiveStats: boolean;

  /** Auto-submit when timer reaches zero */
  autoSubmit: boolean;

  /** Allow candidate to restart */
  allowRestart: boolean;

  /** Supported practice modes */
  practiceModes: RRBPracticeMode[];

  /** Official font size in pixels */
  fontSizePx: number;

  /** Official line height in pixels */
  lineHeightPx: number;

  /** Official passage width in characters */
  passageWidthCh: number;
}

// ----------------------------------------------------------------
// Constants — no magic numbers anywhere
// ----------------------------------------------------------------

const OFFICIAL_FONT_SIZE_PX = 16;
const OFFICIAL_LINE_HEIGHT_PX = 28;
const OFFICIAL_PASSAGE_WIDTH_CH = 80;
const ALL_PRACTICE_MODES: RRBPracticeMode[] = [
  "practice_unlimited",
  "practice_timed",
  "official_full",
  "official_qualifying",
  "weak_numbers",
  "weak_capitals",
  "weak_punctuation",
];

// ----------------------------------------------------------------
// Per-post rule configurations
// ----------------------------------------------------------------

const RRB_RULES: Record<string, RRBRules> = {
  rrb_ntpc_en: {
    targetWpm: 30,
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
  },
  rrb_ntpc_hi: {
    targetWpm: 25,
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
  },
  rrb_typing_en: {
    targetWpm: 40,
    targetAccuracy: 92,
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
  },
  // Practice-only rules (pausing allowed, shorter duration)
  rrb_practice_en: {
    targetWpm: 30,
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
  },
  rrb_practice_hi: {
    targetWpm: 25,
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
  },
};

// ----------------------------------------------------------------
// Public API — pure functions
// ----------------------------------------------------------------

/**
 * Returns rules for a given rule key. Falls back to rrb_ntpc_en if unknown.
 */
export function getRules(ruleKey: string): RRBRules {
  return RRB_RULES[ruleKey] ?? RRB_RULES["rrb_ntpc_en"];
}

/**
 * Returns official rules for a given exam + language pair.
 */
export function getRulesForExam(examId: ExamId, language: ExamLanguage): RRBRules {
  if (examId === "rrb_typing") {
    return RRB_RULES["rrb_typing_en"];
  }
  if (examId === "rrb_ntpc") {
    return language === "hi" ? RRB_RULES["rrb_ntpc_hi"] : RRB_RULES["rrb_ntpc_en"];
  }
  return RRB_RULES["rrb_ntpc_en"];
}

/**
 * Returns practice-mode rules (pausing allowed, shorter).
 */
export function getPracticeRules(language: ExamLanguage): RRBRules {
  return language === "hi" ? RRB_RULES["rrb_practice_hi"] : RRB_RULES["rrb_practice_en"];
}

/**
 * Returns all known rule keys.
 */
export function getAllRuleKeys(): string[] {
  return Object.keys(RRB_RULES);
}

/**
 * Validates that an RRBRules object has sane values.
 * Returns array of error strings (empty = valid).
 */
export function validateRules(rules: RRBRules): string[] {
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
  return errors;
}

/**
 * Returns a safe default rules object.
 */
export function getDefaultRules(): RRBRules {
  return { ...RRB_RULES["rrb_ntpc_en"] };
}

/**
 * Returns the human-readable label for a practice mode.
 */
export function getPracticeModeLabel(mode: RRBPracticeMode): string {
  const labels: Record<RRBPracticeMode, string> = {
    practice_unlimited: "Unlimited Practice",
    practice_timed: "Timed Practice",
    official_full: "Official Full Test",
    official_qualifying: "Qualifying Test",
    weak_numbers: "Weak Area: Numbers",
    weak_capitals: "Weak Area: Capital Letters",
    weak_punctuation: "Weak Area: Punctuation",
  };
  return labels[mode];
}
