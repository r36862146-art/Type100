import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider } from "../types";
import { contentGenerator } from "../../../services/contentGenerator";

export class PunctuationProvider implements PracticeProvider {
  public getModeId(): PracticeMode {
    return "punctuation";
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const punctuationType = config.punctuationType || "mixed";
    const length = config.length || 30;

    const text = contentGenerator.generatePunctuationText(punctuationType, length);

    return {
      id: `punctuation-${punctuationType}-${length}-${Date.now()}`,
      text,
      language: config.language, // Keep language for consistency
    };
  }
}
