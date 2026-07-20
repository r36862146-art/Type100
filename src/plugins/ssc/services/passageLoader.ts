// ============================================================
// SSC PASSAGE LOADER — Phase 8.2
// Lazy-loads passage datasets from JSON files.
// Implements in-memory caching and random/sequential selection.
// ============================================================

import type { ExamId, ExamLanguage } from "@/features/exam/types";

// ----------------------------------------------------------------
// SSCPassage interface (extends the ExamPassage concept with SSC fields)
// ----------------------------------------------------------------

export interface SSCPassage {
  id: string;
  exam: string;
  post: string;
  language: ExamLanguage;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  text: string;
  characterCount: number;
  estimatedWpm: number;
  estimatedDuration: number;
}

// ----------------------------------------------------------------
// Dataset version metadata type
// ----------------------------------------------------------------

export interface DatasetMeta {
  version: string;
  lastUpdated: string;
  datasets: Record<string, Record<string, { passageCount: number; avgWordCount: number; difficulty: string }>>;
}

// ----------------------------------------------------------------
// In-memory cache
// ----------------------------------------------------------------

const passageCache = new Map<string, SSCPassage[]>();

function cacheKey(examId: ExamId, language: ExamLanguage): string {
  return `${examId}_${language}`;
}

// ----------------------------------------------------------------
// Passage loading
// ----------------------------------------------------------------

/**
 * Dynamically imports a passage dataset for the given exam and language.
 * Results are cached in memory to avoid repeated JSON parsing.
 */
export async function loadSSCPassages(
  examId: ExamId,
  language: ExamLanguage
): Promise<SSCPassage[]> {
  const key = cacheKey(examId, language);

  if (passageCache.has(key)) {
    return passageCache.get(key)!;
  }

  try {
    let data: SSCPassage[];

    // Dynamic import based on exam + language
    if (examId === "ssc_cgl" && language === "en") {
      const mod = await import("../datasets/cgl/en.json");
      data = mod.default as SSCPassage[];
    } else if (examId === "ssc_cgl" && language === "hi") {
      const mod = await import("../datasets/cgl/hi.json");
      data = mod.default as SSCPassage[];
    } else if (examId === "ssc_chsl" && language === "en") {
      const mod = await import("../datasets/chsl/en.json");
      data = mod.default as SSCPassage[];
    } else if (examId === "ssc_chsl" && language === "hi") {
      const mod = await import("../datasets/chsl/hi.json");
      data = mod.default as SSCPassage[];
    } else {
      console.warn(`[passageLoader] No dataset found for ${examId}/${language}. Falling back to CGL English.`);
      const mod = await import("../datasets/cgl/en.json");
      data = mod.default as SSCPassage[];
    }

    passageCache.set(key, data);
    return data;
  } catch (err) {
    console.error(`[passageLoader] Failed to load dataset for ${examId}/${language}:`, err);
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
): Promise<SSCPassage | null> {
  const passages = await loadSSCPassages(examId, language);
  if (passages.length === 0) return null;
  const idx = Math.floor(Math.random() * passages.length);
  return passages[idx];
}

/**
 * Returns a specific passage by index (0-based).
 * Used for sequential/official mode.
 */
export async function getPassageByIndex(
  examId: ExamId,
  language: ExamLanguage,
  index: number
): Promise<SSCPassage | null> {
  const passages = await loadSSCPassages(examId, language);
  if (passages.length === 0) return null;
  return passages[index % passages.length] ?? null;
}

/**
 * Returns the total number of passages available for an exam + language.
 */
export async function getPassageCount(
  examId: ExamId,
  language: ExamLanguage
): Promise<number> {
  const passages = await loadSSCPassages(examId, language);
  return passages.length;
}

/**
 * Clears the passage cache (useful for testing).
 */
export function clearPassageCache(): void {
  passageCache.clear();
}
