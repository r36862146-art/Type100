import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider } from "../types";
import { contentGenerator } from "../../../services/contentGenerator";

export class WordsProvider implements PracticeProvider {
  public getModeId(): PracticeMode {
    return "words";
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const length = config.length || 50;
    const difficulty = config.difficulty || "medium";

    const text = await contentGenerator.generateWordsText(
      config.language,
      difficulty,
      length
    );

    return {
      id: `words-${config.language}-${difficulty}-${length}-${Date.now()}`,
      text,
      language: config.language,
    };
  }
}
