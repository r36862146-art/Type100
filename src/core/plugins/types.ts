import type { ExamProfile, ExamLanguage } from "@/features/exam/types";
import type { SimulatorAdapter } from "@/features/exam/simulator/useOfficialSimulator";

export interface ExamPlugin {
  /** Unique identifier for the plugin (e.g., 'ssc', 'rrb') */
  id: string;
  
  /** Name of the organization (e.g., 'Staff Selection Commission') */
  organization: string;
  
  /** List of exam profiles supported by this plugin */
  profiles: ExamProfile[];
  
  /** Returns the specific rules for an exam profile */
  ruleProvider: (examId: string) => any;
  
  /** Returns a passage for the exam profile and language */
  datasetProvider: (examId: string, language: ExamLanguage) => Promise<any>;
  
  /** Organization branding assets */
  brandingProvider: () => { 
    primaryColor: string; 
    icon: string; // lucide icon name or svg
  };
  
  /** Returns the configured simulator adapter for the unified exam engine */
  simulatorConfiguration: (examId: string, language: ExamLanguage) => SimulatorAdapter<any, any, any, any>;
  
  /** Any extra metadata for the plugin */
  metadata?: Record<string, any>;
}
