import type { ExamPlugin } from "@/core/plugins/types";
import { rrbRegistry } from "./registry";
import { createRRBAdapter } from "./adapter";
import { getRules } from "./services/rrbRules";
import { getRandomPassage } from "./services/passageLoader";
import type { ExamLanguage } from "@/features/exam/types";

export const RRBPlugin: ExamPlugin = {
  id: "rrb",
  organization: "Railway Recruitment Board",
  profiles: Object.values(rrbRegistry),
  
  ruleProvider: (examId: string) => {
    return getRules(examId as any);
  },
  
  datasetProvider: async (examId: string, language: ExamLanguage) => {
    return getRandomPassage(examId as any, language);
  },
  
  brandingProvider: () => ({
    primaryColor: "#f43f5e", // rose-500
    icon: "Train"
  }),
  
  simulatorConfiguration: (examId: string, language: ExamLanguage) => {
    const rules = getRules(examId as any);
    return createRRBAdapter(examId, language, rules);
  },
  
  metadata: {
    description: "Official Railway Recruitment Board (RRB) typing skill test simulator."
  }
};
