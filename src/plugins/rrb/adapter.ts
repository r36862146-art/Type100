import type { SimulatorAdapter } from "@/features/exam/simulator/useOfficialSimulator";
import type { RRBPassage } from "./services/passageLoader";
import type { RRBRules } from "./services/rrbRules";
import type { RRBScoreResult, RRBErrorBreakdown } from "./services/scoring";

import { getRandomPassage } from "./services/passageLoader";
import { validateInput } from "./services/validation";
import { computeRRBScore, getErrorBreakdown } from "./services/scoring";
import type { ExamLanguage } from "@/features/exam/types";

export function createRRBAdapter(
  examId: string, 
  language: ExamLanguage, 
  rules: RRBRules
): SimulatorAdapter<RRBPassage, RRBRules, RRBScoreResult, RRBErrorBreakdown> {
  return {
    rules,
    loadPassage: () => getRandomPassage(examId as any, language).then(p => {
      if (!p) throw new Error("Passage not found");
      return p;
    }),
    validateInput: (typed, target) => validateInput(typed, target),
    computeScore: ({ grossCharacters, errors, elapsedSeconds, rules }) => 
      computeRRBScore({
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

export function mapRRBScore(score: RRBScoreResult, breakdown: RRBErrorBreakdown | null, rules: RRBRules) {
  return {
    score: {
      netWPM: score.netWPM,
      grossWPM: score.grossWPM,
      accuracy: score.accuracy,
      errors: score.errors,
      qualifies: score.qualifies,
      extraStats: [
        { label: "Gross Speed", value: `${score.grossWPM} WPM` },
        { label: "Total Errors", value: score.errors.toString() },
      ]
    },
    isKPH: false,
    analysis: undefined
  };
}
