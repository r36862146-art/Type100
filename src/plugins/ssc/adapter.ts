import type { SimulatorAdapter } from "@/features/exam/simulator/useOfficialSimulator";
import type { SSCPassage } from "./services/passageLoader";
import type { SSCRules } from "./services/sscRules";
import type { SSCScoreResult } from "./services/scoring";

import { getRandomPassage } from "./services/passageLoader";
import { validateInput } from "./services/validation";
import { computeSSCScore, getStrongestArea, getWeakestArea } from "./services/scoring";
import type { ExamLanguage } from "@/features/exam/types";

export function createSSCAdapter(
  examId: string, 
  language: ExamLanguage, 
  rules: SSCRules
): SimulatorAdapter<SSCPassage, SSCRules, SSCScoreResult, any> {
  return {
    rules,
    loadPassage: () => getRandomPassage(examId as any, language).then(p => {
      if (!p) throw new Error("Passage not found");
      return p;
    }),
    validateInput: (typed, target) => validateInput(typed, target),
    computeScore: ({ grossCharacters, errors, elapsedSeconds, rules }) => 
      computeSSCScore({
        grossCharacters,
        errors,
        elapsedSeconds,
        qualifyingType: rules.qualifyingType
      }, rules.targetSpeed, rules.targetKPH),
    getErrorBreakdown: (typed, target) => null,
    getDuration: (r) => r.duration,
    isAutoSubmit: (r) => r.autoSubmit,
    canPause: (r) => (r as any).allowPause || false,
    canRestart: (r) => r.allowRestart,
    isOfficialSimulation: (r) => r.officialSimulation,
  };
}

export function mapSSCScore(score: SSCScoreResult, breakdown: any | null, rules: SSCRules) {
  const isKPH = rules.qualifyingType === "keystrokes_per_hour";
  return {
    score: {
      netWPM: score.netWPM,
      grossWPM: score.grossWPM,
      accuracy: score.accuracy,
      errors: score.errors,
      qualifies: score.qualifies,
      extraStats: isKPH ? [
        { label: "Keystrokes Per Hour", value: score.keystrokesPerHour.toLocaleString() }
      ] : [
        { label: "Gross Speed", value: `${score.grossWPM} WPM` },
        { label: "Error Penalty", value: `-${score.errorPenalty} words` },
        { label: "Correct Chars", value: score.correctCharacters },
        { label: "Total Typed", value: score.grossCharacters },
      ]
    },
    isKPH,
    analysis: {
      strongest: getStrongestArea(score, rules.targetSpeed),
      weakest: getWeakestArea(score, rules.targetSpeed)
    }
  };
}
