// ============================================================
// ANDAMAN EXAM BRANDING — Phase 8.4
// Centralised display constants for the Andaman module.
// No strings hardcoded in simulator components.
// ============================================================

import type { ExamId } from "@/features/exam/types";

// ----------------------------------------------------------------
// Organisation identity
// ----------------------------------------------------------------

export const ANDAMAN_FULL_NAME =
  "Andaman & Nicobar Administration";

export const ANDAMAN_SHORT_NAME = "A&N Administration";

export const ANDAMAN_ABBREVIATION = "A&N";

/** Tailwind-compatible colour token for Andaman organisation badge */
export const ANDAMAN_ORG_COLOR = "teal" as const;

// ----------------------------------------------------------------
// Exam labels (human-readable)
// ----------------------------------------------------------------

export const ANDAMAN_EXAM_LABELS: Record<string, string> = {
  andaman_chsl: "Combined Higher Secondary Level (CHSL)",
  andaman_mts: "Common Matriculation Level (MTS)",
};

// ----------------------------------------------------------------
// Post labels by exam ID
// ----------------------------------------------------------------

export const ANDAMAN_POST_LABELS: Record<ExamId, Record<string, string>> = {
  andaman_chsl: {
    en: "Lower Division Clerk (LDC) — English",
    hi: "Lower Division Clerk (LDC) — Hindi",
  },
  andaman_mts: {
    en: "Multi-Tasking Staff (MTS) — Practice",
  },
  // Required by type — not Andaman-specific
  ssc_cgl: {},
  ssc_chsl: {},
  rrb_ntpc: {},
  rrb_typing: {},
};

// ----------------------------------------------------------------
// Official per-exam instruction text
// Displayed verbatim on the Instructions screen.
// Update here to propagate to all simulator instances.
// ----------------------------------------------------------------

export const ANDAMAN_INSTRUCTIONS: Record<string, string[]> = {
  andaman_chsl: [
    "This Typing Skill Test is qualifying in nature. No marks are awarded or deducted.",
    "You must achieve the minimum qualifying speed and accuracy to be declared eligible.",
    "The timer starts immediately after the countdown. You cannot pause the official test.",
    "Type the passage exactly as shown, including punctuation and capitalisation.",
    "Each typing error removes one word equivalent (5 characters) from your net WPM.",
    "The test will be automatically submitted when the timer reaches zero.",
    "Results are displayed immediately after submission for self-assessment purposes.",
    "This is a practice simulation based on Andaman & Nicobar Administration guidelines.",
  ],
  andaman_mts: [
    "This is a preparatory typing practice module — not an official MTS typing test.",
    "MTS recruitment by Andaman & Nicobar Administration does not mandate typing.",
    "Use this module to build foundational speed and accuracy before attempting CHSL.",
    "You may pause and restart freely in practice mode.",
    "Type the passage as accurately as possible to get a reliable speed measurement.",
    "Results show your current performance against the CHSL qualifying standard.",
  ],
};

// ----------------------------------------------------------------
// Practice mode descriptors (Andaman-specific messaging)
// ----------------------------------------------------------------

export const ANDAMAN_PRACTICE_MODE_DESCRIPTIONS: Record<string, string> = {
  practice_unlimited: "Type freely with no timer. Focus on accuracy.",
  practice_timed: "5-minute timed session with pause and restart available.",
  official_full: "Full 10-minute official simulation. No pause, auto-submit.",
  official_qualifying: "Qualifying test mode matching official conditions.",
  weak_numbers: "Targeted practice on passages with high number density.",
  weak_capitals: "Targeted practice on passages requiring frequent capitalisation.",
  weak_punctuation: "Targeted practice on passages with complex punctuation.",
  weak_long_words: "Targeted practice on passages with long and complex words.",
};

// ----------------------------------------------------------------
// Qualification badge labels
// ----------------------------------------------------------------

export const ANDAMAN_QUALIFICATION_LABELS = {
  qualified: "✓ Qualifying Score",
  nearly_ready: "~ Nearly Qualifying",
  needs_improvement: "✗ Not Yet Qualifying",
} as const;

// ----------------------------------------------------------------
// Result screen messaging
// ----------------------------------------------------------------

export const ANDAMAN_RESULT_MESSAGES = {
  qualified:
    "Excellent work! You meet the Andaman & Nicobar Administration qualifying standard.",
  nearly_ready:
    "You are very close. A little more consistent practice will get you there.",
  needs_improvement:
    "Keep going — daily practice brings steady improvement. You can do this.",
} as const;
