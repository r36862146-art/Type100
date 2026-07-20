// ============================================================
// SSC RULES ENGINE — Phase 8.2
// SSCRules interface + per-exam rule configurations.
// Pure functions only. No magic numbers.
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// SSCRules interface
// ----------------------------------------------------------------

export type QualifyingType = "wpm" | "keystrokes_per_hour";

export interface SSCRules {
  /** Target speed — WPM for typing posts, KPH for DEO */
  targetSpeed: number;

  /** Target accuracy percentage (0-100) */
  targetAccuracy: number;

  /** Exam duration in minutes */
  duration: number;

  /** Available language options for this exam */
  languageOptions: ExamLanguage[];

  /** How speed is measured */
  qualifyingType: QualifyingType;

  /** For DEO: raw keystrokes/hour target */
  targetKPH?: number;

  /** Show live WPM/KPH counter during the test */
  liveStatistics: boolean;

  /** Strict no-pause official simulation mode */
  officialSimulation: boolean;

  /** Auto-submit when timer reaches zero */
  autoSubmit: boolean;

  /** Allow candidate to restart the test */
  allowRestart: boolean;

  /** Official font size in pixels */
  fontSizePx: number;

  /** Official line height in pixels */
  lineHeightPx: number;

  /** Official passage width in characters */
  passageWidthCh: number;
}

// ----------------------------------------------------------------
// SSCScoreConfig — used by scoring.ts
// ----------------------------------------------------------------

export interface SSCScoreConfig {
  /** Total gross characters typed */
  grossCharacters: number;

  /** Incorrect characters (errors) */
  errors: number;

  /** Duration actually elapsed, in seconds */
  elapsedSeconds: number;

  /** Qualifying type to determine scoring formula */
  qualifyingType: QualifyingType;
}

// ----------------------------------------------------------------
// Defaults — all constants, no magic numbers
// ----------------------------------------------------------------

const OFFICIAL_FONT_SIZE_PX = 16;
const OFFICIAL_LINE_HEIGHT_PX = 28;
const OFFICIAL_PASSAGE_WIDTH_CH = 80;
const CHARS_PER_WORD = 5; // standard typing industry convention
export { CHARS_PER_WORD };

// ----------------------------------------------------------------
// Per-exam rule configurations
// ----------------------------------------------------------------

const SSC_RULES: Record<string, SSCRules> = {
  ssc_cgl_dest_en: {
    targetSpeed: 35,
    targetAccuracy: 90,
    duration: 15,
    languageOptions: ["en"],
    qualifyingType: "wpm",
    liveStatistics: true,
    officialSimulation: true,
    autoSubmit: true,
    allowRestart: false,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
  },
  ssc_cgl_dest_hi: {
    targetSpeed: 30,
    targetAccuracy: 90,
    duration: 15,
    languageOptions: ["hi"],
    qualifyingType: "wpm",
    liveStatistics: true,
    officialSimulation: true,
    autoSubmit: true,
    allowRestart: false,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
  },
  ssc_chsl_ldc_en: {
    targetSpeed: 35,
    targetAccuracy: 90,
    duration: 10,
    languageOptions: ["en"],
    qualifyingType: "wpm",
    liveStatistics: true,
    officialSimulation: true,
    autoSubmit: true,
    allowRestart: false,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
  },
  ssc_chsl_ldc_hi: {
    targetSpeed: 30,
    targetAccuracy: 90,
    duration: 10,
    languageOptions: ["hi"],
    qualifyingType: "wpm",
    liveStatistics: true,
    officialSimulation: true,
    autoSubmit: true,
    allowRestart: false,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
  },
  ssc_chsl_deo: {
    targetSpeed: 27,           // derived from 8000 KPH
    targetAccuracy: 90,
    duration: 15,
    languageOptions: ["en"],
    qualifyingType: "keystrokes_per_hour",
    targetKPH: 8000,
    liveStatistics: true,
    officialSimulation: true,
    autoSubmit: true,
    allowRestart: false,
    fontSizePx: OFFICIAL_FONT_SIZE_PX,
    lineHeightPx: OFFICIAL_LINE_HEIGHT_PX,
    passageWidthCh: OFFICIAL_PASSAGE_WIDTH_CH,
  },
};

// ----------------------------------------------------------------
// Public API — pure functions
// ----------------------------------------------------------------

/**
 * Returns the SSCRules for a given rule key.
 * Defaults to ssc_chsl_ldc_en if the key is not found.
 */
export function getRules(ruleKey: string): SSCRules {
  return SSC_RULES[ruleKey] ?? SSC_RULES["ssc_chsl_ldc_en"];
}

/**
 * Returns rules for a standard exam + language pair.
 */
export function getRulesForExam(examId: ExamId, language: ExamLanguage): SSCRules {
  if (examId === "ssc_cgl") {
    return language === "hi"
      ? SSC_RULES["ssc_cgl_dest_hi"]
      : SSC_RULES["ssc_cgl_dest_en"];
  }
  if (examId === "ssc_chsl") {
    // DEO is English only — default to typing if language is hi
    return language === "hi"
      ? SSC_RULES["ssc_chsl_ldc_hi"]
      : SSC_RULES["ssc_chsl_ldc_en"];
  }
  // Fallback
  return SSC_RULES["ssc_chsl_ldc_en"];
}

/**
 * Returns the DEO-specific rules (KPH mode).
 */
export function getDEORules(): SSCRules {
  return SSC_RULES["ssc_chsl_deo"];
}

/**
 * Returns all known rule keys.
 */
export function getAllRuleKeys(): string[] {
  return Object.keys(SSC_RULES);
}

/**
 * Validates that a rules object has all required fields and sane values.
 * Returns an array of validation error strings (empty = valid).
 */
export function validateRules(rules: SSCRules): string[] {
  const errors: string[] = [];

  if (rules.targetSpeed <= 0) errors.push("targetSpeed must be > 0");
  if (rules.targetAccuracy < 0 || rules.targetAccuracy > 100)
    errors.push("targetAccuracy must be 0–100");
  if (rules.duration <= 0) errors.push("duration must be > 0");
  if (rules.languageOptions.length === 0)
    errors.push("languageOptions must have at least one entry");
  if (rules.fontSizePx <= 0) errors.push("fontSizePx must be > 0");
  if (rules.lineHeightPx <= 0) errors.push("lineHeightPx must be > 0");
  if (rules.passageWidthCh <= 0) errors.push("passageWidthCh must be > 0");
  if (rules.qualifyingType === "keystrokes_per_hour" && !rules.targetKPH)
    errors.push("targetKPH is required for keystrokes_per_hour qualifying type");

  return errors;
}

/**
 * Returns a safe default rules object for testing or fallback.
 */
export function getDefaultRules(): SSCRules {
  return { ...SSC_RULES["ssc_chsl_ldc_en"] };
}
