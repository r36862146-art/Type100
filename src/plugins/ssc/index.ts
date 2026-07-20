import type { ExamPlugin } from "@/core/plugins/types";
import { sscRegistry } from "./registry";
import { createSSCAdapter } from "./adapter";
import { getRules } from "./services/sscRules";
import { getRandomPassage } from "./services/passageLoader";
import type { ExamLanguage } from "@/features/exam/types";

export const SSCPlugin: ExamPlugin = {
  id: "ssc",
  organization: "Staff Selection Commission",
  profiles: Object.values(sscRegistry),
  
  ruleProvider: (examId: string) => {
    return getRules(examId as any);
  },
  
  datasetProvider: async (examId: string, language: ExamLanguage) => {
    return getRandomPassage(examId as any, language);
  },
  
  brandingProvider: () => ({
    primaryColor: "#3b82f6", // blue-500
    icon: "Briefcase"
  }),
  
  simulatorConfiguration: (examId: string, language: ExamLanguage) => {
    const rules = getRules(examId as any);
    return createSSCAdapter(examId, language, rules);
  },
  
  metadata: {
    description: "Official Staff Selection Commission (SSC) typing skill test simulator."
  }
};
