import type { SimulatorAdapter } from "@/features/exam/simulator/useOfficialSimulator";
import type { AndamanPassage } from "./services/passageLoader";
import type { AndamanRules } from "./services/andamanRules";
import type { AndamanScoreResult, AndamanErrorBreakdown } from "./services/scoring";

import { getRandomPassage } from "./services/passageLoader";
import { validateInput } from "./services/validation";
import { computeAndamanScore, getErrorBreakdown } from "./services/scoring";
import type { ExamLanguage } from "@/features/exam/types";

export function createAndamanAdapter(
  examId: string, 
  language: ExamLanguage, 
  rules: AndamanRules
): SimulatorAdapter<AndamanPassage, AndamanRules, AndamanScoreResult, AndamanErrorBreakdown> {
  return {
    rules,
    loadPassage: () => getRandomPassage(examId as any, language).then(p => {
      if (!p) throw new Error("Passage not found");
      return p;
    }),
    validateInput: (typed, target) => validateInput(typed, target),
    computeScore: ({ grossCharacters, errors, elapsedSeconds, rules }) => 
      computeAndamanScore({
        grossCharacters,
        errors,
        elapsedSeconds,
        targetWpm: rules.targetWpm,
        targetAccuracy: rules.targetAccuracy,
      }),
    getErrorBreakdown: (typed, target) => getErrorBreakdown(typed, target),
    getDuration: (r) => r.duration,
    isAutoSubmit: (r) => r.autoSubmit,
    canPause: (r) => r.allowPause,
    canRestart: (r) => r.allowRestart,
    isOfficialSimulation: (r) => r.officialSimulation,
  };
}

export function mapAndamanScore(score: AndamanScoreResult, breakdown: AndamanErrorBreakdown | null, rules: AndamanRules) {
  // Try to cast score to get longWordErrors if it exists
  const longWordErrors = (score as any).longWordErrors || 0;
  return {
    score: {
      netWPM: score.netWPM,
      grossWPM: score.grossWPM,
      accuracy: score.accuracy,
      errors: score.errors,
      qualifies: score.qualifies,
      extraStats: [
        { label: "Gross Speed", value: `${score.grossWPM} WPM` },
        { label: "Long Word Errors", value: longWordErrors.toString() },
      ]
    },
    isKPH: false,
    analysis: undefined
  };
}
