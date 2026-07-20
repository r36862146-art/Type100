import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider } from "../types";
import { contentGenerator } from "../../../services/contentGenerator";

export class NumbersProvider implements PracticeProvider {
  public getModeId(): PracticeMode {
    return "numbers";
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const numberType = config.numberType || "mixed";
    const length = config.length || 20;

    const text = contentGenerator.generateNumbersText(numberType, length);

    return {
      id: `numbers-${numberType}-${length}-${Date.now()}`,
      text,
      language: config.language, // Keep language for consistency, although numbers are mostly universal
    };
  }
}
