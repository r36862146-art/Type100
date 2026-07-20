import { ParagraphsDataset, WordsDataset, QuotesDataset } from "../features/practice/types";

class DatasetLoader {
  private wordsCache: Map<string, WordsDataset> = new Map();
  private paragraphsCache: Map<string, ParagraphsDataset> = new Map();
  private quotesCache: Map<string, QuotesDataset> = new Map();

  public async loadWordsDataset(language: string): Promise<WordsDataset> {
    if (this.wordsCache.has(language)) {
      return this.wordsCache.get(language)!;
    }

    let dataset: WordsDataset;
    try {
      if (language === "hi") {
        const data = await import("../features/practice/content/datasets/hi_words.json");
        dataset = data.default as WordsDataset;
      } else {
        const data = await import("../features/practice/content/datasets/en_words.json");
        dataset = data.default as WordsDataset;
      }

      this.wordsCache.set(language, dataset);
      return dataset;
    } catch (error) {
      console.error(`Failed to load words dataset for language: ${language}`, error);
      throw new Error(`Failed to load words dataset for language: ${language}`);
    }
  }

  public async loadParagraphsDataset(language: string): Promise<ParagraphsDataset> {
    if (this.paragraphsCache.has(language)) {
      return this.paragraphsCache.get(language)!;
    }

    let dataset: ParagraphsDataset;
    try {
      if (language === "hi") {
        const data = await import("../features/practice/content/datasets/hi_paragraphs.json");
        dataset = data.default as ParagraphsDataset;
      } else {
        const data = await import("../features/practice/content/datasets/en_paragraphs.json");
        dataset = data.default as ParagraphsDataset;
      }

      this.paragraphsCache.set(language, dataset);
      return dataset;
    } catch (error) {
      console.error(`Failed to load paragraphs dataset for language: ${language}`, error);
      throw new Error(`Failed to load paragraphs dataset for language: ${language}`);
    }
  }

  public async loadQuotesDataset(language: string): Promise<QuotesDataset> {
    if (this.quotesCache.has(language)) {
      return this.quotesCache.get(language)!;
    }

    let dataset: QuotesDataset;
    try {
      if (language === "hi") {
        const data = await import("../features/practice/content/datasets/hi_quotes.json");
        dataset = data.default as QuotesDataset;
      } else {
        const data = await import("../features/practice/content/datasets/en_quotes.json");
        dataset = data.default as QuotesDataset;
      }

      this.quotesCache.set(language, dataset);
      return dataset;
    } catch (error) {
      console.error(`Failed to load quotes dataset for language: ${language}`, error);
      throw new Error(`Failed to load quotes dataset for language: ${language}`);
    }
  }

  public clearCache(): void {
    this.wordsCache.clear();
    this.paragraphsCache.clear();
    this.quotesCache.clear();
  }
}

export const datasetLoader = new DatasetLoader();
