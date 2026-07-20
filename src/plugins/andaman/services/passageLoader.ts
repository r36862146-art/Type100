// ============================================================
// ANDAMAN PASSAGE LOADER — Phase 8.4
// Lazy-loads JSON passage datasets with in-memory caching.
// Adds `topic` field (per Phase 8.4 AndamanPassage spec).
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// AndamanPassage interface
// ----------------------------------------------------------------

export interface AndamanPassage {
  /** Unique passage identifier */
  id: string;

  /** The exam ID this passage targets */
  exam: string;

  /** Official post name this passage is calibrated for */
  post: string;

  /** Language of the passage */
  language: ExamLanguage;

  /** Title of the passage */
  title: string;

  /** Thematic topic (more specific than category) */
  topic: string;

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

  /** Full text to type */
  text: string;

  /** Declared character count */
  characterCount: number;

  /** Target WPM calibrated for this passage */
  estimatedWpm: number;

  /** Estimated completion time at target WPM */
  estimatedDuration: number;

  /** Optional passage-level metadata */
  metadata?: Record<string, string | number | boolean>;
}

// ----------------------------------------------------------------
// Dataset version metadata
// ----------------------------------------------------------------

export interface AndamanDatasetMeta {
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

const passageCache = new Map<string, AndamanPassage[]>();

function cacheKey(examId: ExamId, language: ExamLanguage): string {
  return `andaman_${examId}_${language}`;
}

// ----------------------------------------------------------------
// Passage loading
// ----------------------------------------------------------------

/**
 * Lazy-loads the passage dataset for the given exam + language.
 * Results are cached in memory.
 */
export async function loadAndamanPassages(
  examId: ExamId,
  language: ExamLanguage
): Promise<AndamanPassage[]> {
  const key = cacheKey(examId, language);
  if (passageCache.has(key)) return passageCache.get(key)!;

  try {
    let data: AndamanPassage[];

    if (examId === "andaman_chsl" && language === "en") {
      const mod = await import("../datasets/english/chsl.json");
      data = mod.default as AndamanPassage[];
    } else if (examId === "andaman_chsl" && language === "hi") {
      const mod = await import("../datasets/hindi/chsl.json");
      data = mod.default as AndamanPassage[];
    } else if (examId === "andaman_mts" && language === "en") {
      const mod = await import("../datasets/english/mts.json");
      data = mod.default as AndamanPassage[];
    } else {
      console.warn(
        `[andamanPassageLoader] No dataset for ${examId}/${language}. Falling back to CHSL English.`
      );
      const mod = await import("../datasets/english/chsl.json");
      data = mod.default as AndamanPassage[];
    }

    passageCache.set(key, data);
    return data;
  } catch (err) {
    console.error(
      `[andamanPassageLoader] Failed to load ${examId}/${language}:`,
      err
    );
    return [];
  }
}

/** Returns a random passage (uniform distribution) */
export async function getRandomPassage(
  examId: ExamId,
  language: ExamLanguage
): Promise<AndamanPassage | null> {
  const passages = await loadAndamanPassages(examId, language);
  if (passages.length === 0) return null;
  return passages[Math.floor(Math.random() * passages.length)];
}

/** Returns a passage by index (wraps on overflow) */
export async function getPassageByIndex(
  examId: ExamId,
  language: ExamLanguage,
  index: number
): Promise<AndamanPassage | null> {
  const passages = await loadAndamanPassages(examId, language);
  if (passages.length === 0) return null;
  return passages[index % passages.length] ?? null;
}

/** Returns passages filtered by category */
export async function getPassagesByCategory(
  examId: ExamId,
  language: ExamLanguage,
  category: AndamanPassage["category"]
): Promise<AndamanPassage[]> {
  const all = await loadAndamanPassages(examId, language);
  const filtered = all.filter((p) => p.category === category);
  return filtered.length > 0 ? filtered : all;
}

/** Returns total passage count for an exam + language */
export async function getPassageCount(
  examId: ExamId,
  language: ExamLanguage
): Promise<number> {
  const passages = await loadAndamanPassages(examId, language);
  return passages.length;
}

/** Clears the in-memory cache (useful for testing) */
export function clearPassageCache(): void {
  passageCache.clear();
}
