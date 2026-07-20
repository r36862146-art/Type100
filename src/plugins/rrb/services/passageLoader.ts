// ============================================================
// RRB PASSAGE LOADER — Phase 8.3
// Lazy-loads RRB passage datasets from JSON files.
// In-memory caching, random and sequential selection.
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// RRBPassage interface
// ----------------------------------------------------------------

export interface RRBPassage {
  /** Unique passage identifier */
  id: string;

  /** The exam ID this passage targets (rrb_ntpc | rrb_typing) */
  exam: string;

  /** Official post name this passage is calibrated for */
  post: string;

  /** Language of the passage */
  language: ExamLanguage;

  /** Title of the passage */
  title: string;

  /** Difficulty level */
  difficulty: "easy" | "medium" | "hard";

  /** Passage category */
  category:
    | "general"
    | "government"
    | "economy"
    | "science"
    | "technology"
    | "environment"
    | "current_affairs";

  /** Full text to be typed */
  text: string;

  /** Declared character count */
  characterCount: number;

  /** Target WPM calibrated for this passage */
  estimatedWpm: number;

  /** Estimated completion time in minutes at target WPM */
  estimatedDuration: number;

  /** Optional passage-level metadata */
  metadata?: Record<string, string | number | boolean>;
}

// ----------------------------------------------------------------
// Dataset version metadata
// ----------------------------------------------------------------

export interface RRBDatasetMeta {
  version: string;
  lastUpdated: string;
  datasets: Record<
    string,
    Record<
      string,
      { passageCount: number; avgWordCount: number; difficulty: string }
    >
  >;
}

// ----------------------------------------------------------------
// In-memory cache
// ----------------------------------------------------------------

const passageCache = new Map<string, RRBPassage[]>();

function cacheKey(examId: ExamId, language: ExamLanguage): string {
  return `rrb_${examId}_${language}`;
}

// ----------------------------------------------------------------
// Passage loading
// ----------------------------------------------------------------

/**
 * Dynamically imports an RRB passage dataset for the given exam + language.
 * Results are cached in memory to avoid repeated JSON parsing.
 */
export async function loadRRBPassages(
  examId: ExamId,
  language: ExamLanguage
): Promise<RRBPassage[]> {
  const key = cacheKey(examId, language);

  if (passageCache.has(key)) {
    return passageCache.get(key)!;
  }

  try {
    let data: RRBPassage[];

    if (examId === "rrb_ntpc" && language === "en") {
      const mod = await import("../datasets/english/ntpc.json");
      data = mod.default as RRBPassage[];
    } else if (examId === "rrb_ntpc" && language === "hi") {
      const mod = await import("../datasets/hindi/ntpc.json");
      data = mod.default as RRBPassage[];
    } else if (examId === "rrb_typing" && language === "en") {
      const mod = await import("../datasets/english/typing_posts.json");
      data = mod.default as RRBPassage[];
    } else {
      console.warn(
        `[rrbPassageLoader] No dataset for ${examId}/${language}. Falling back to RRB NTPC English.`
      );
      const mod = await import("../datasets/english/ntpc.json");
      data = mod.default as RRBPassage[];
    }

    passageCache.set(key, data);
    return data;
  } catch (err) {
    console.error(
      `[rrbPassageLoader] Failed to load dataset for ${examId}/${language}:`,
      err
    );
    return [];
  }
}

/**
 * Returns a random passage from the dataset.
 * Falls back to the first passage if dataset is empty.
 */
export async function getRandomPassage(
  examId: ExamId,
  language: ExamLanguage
): Promise<RRBPassage | null> {
  const passages = await loadRRBPassages(examId, language);
  if (passages.length === 0) return null;
  const idx = Math.floor(Math.random() * passages.length);
  return passages[idx];
}

/**
 * Returns a specific passage by index (0-based). Wraps on overflow.
 * Used for sequential / official mode.
 */
export async function getPassageByIndex(
  examId: ExamId,
  language: ExamLanguage,
  index: number
): Promise<RRBPassage | null> {
  const passages = await loadRRBPassages(examId, language);
  if (passages.length === 0) return null;
  return passages[index % passages.length] ?? null;
}

/**
 * Returns passages filtered by category (for weak-area practice).
 */
export async function getPassagesByCategory(
  examId: ExamId,
  language: ExamLanguage,
  category: RRBPassage["category"]
): Promise<RRBPassage[]> {
  const all = await loadRRBPassages(examId, language);
  const filtered = all.filter((p) => p.category === category);
  return filtered.length > 0 ? filtered : all;
}

/**
 * Returns the total number of passages for an exam + language.
 */
export async function getPassageCount(
  examId: ExamId,
  language: ExamLanguage
): Promise<number> {
  const passages = await loadRRBPassages(examId, language);
  return passages.length;
}

/**
 * Clears the in-memory passage cache. Useful for testing.
 */
export function clearPassageCache(): void {
  passageCache.clear();
}
