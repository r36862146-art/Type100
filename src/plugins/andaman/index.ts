import type { ExamPlugin } from "@/core/plugins/types";
import { andamanRegistry } from "./registry";
import { createAndamanAdapter } from "./adapter";
import { getRules } from "./services/andamanRules";
import { getRandomPassage } from "./services/passageLoader";
import type { ExamLanguage } from "@/features/exam/types";

export const AndamanPlugin: ExamPlugin = {
  id: "andaman",
  organization: "Andaman Administration",
  profiles: Object.values(andamanRegistry),
  
  ruleProvider: (examId: string) => {
    return getRules(examId as any);
  },
  
  datasetProvider: async (examId: string, language: ExamLanguage) => {
    return getRandomPassage(examId as any, language);
  },
  
  brandingProvider: () => ({
    primaryColor: "#14b8a6", // teal-500
    icon: "Palmtree"
  }),
  
  simulatorConfiguration: (examId: string, language: ExamLanguage) => {
    const rules = getRules(examId as any);
    return createAndamanAdapter(examId, language, rules);
  },
  
  metadata: {
    description: "Official Andaman & Nicobar Administration typing skill test simulator."
  }
};
