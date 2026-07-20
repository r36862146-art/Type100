import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider } from "../types";
import { contentGenerator } from "../../../services/contentGenerator";

export class QuoteProvider implements PracticeProvider {
  public getModeId(): PracticeMode {
    return "quotes";
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const category = config.quoteCategory || "motivational";

    const quoteItem = await contentGenerator.generateQuote(
      config.language,
      category
    );

    return {
      id: `quotes-${config.language}-${category}-${Date.now()}`,
      text: quoteItem.text,
      language: config.language,
      metadata: {
        author: quoteItem.author,
        category: category,
        source: quoteItem.source
      }
    };
  }
}
