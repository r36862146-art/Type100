import { datasetLoader } from "./datasetLoader";
import { randomService } from "./randomService";
import { PracticeDifficulty, PracticeCategory } from "../features/practice/types";

class ContentGenerator {
  public async generateWordsText(
    language: string,
    difficulty: PracticeDifficulty = "medium",
    length: number = 50
  ): Promise<string> {
    const dataset = await datasetLoader.loadWordsDataset(language);

    // Fallback to "medium" if the requested difficulty array is empty or undefined
    let wordPool = dataset[difficulty];
    if (!wordPool || wordPool.length === 0) {
      console.warn(`Word pool for difficulty '${difficulty}' is empty. Falling back to 'medium'.`);
      wordPool = dataset.medium;
    }
    
    // Final fallback to easy if medium is also empty
    if (!wordPool || wordPool.length === 0) {
      wordPool = dataset.easy;
    }

    if (!wordPool || wordPool.length === 0) {
      throw new Error(`Failed to find any words for language: ${language}`);
    }

    const selectedWords = randomService.getRandomItems(wordPool, length);
    return selectedWords.join(" ");
  }

  public async generateParagraphText(
    language: string,
    category: PracticeCategory = "general",
    length: "short" | "medium" | "long" = "medium"
  ): Promise<string> {
    const dataset = await datasetLoader.loadParagraphsDataset(language);

    // Fallback to "general" if category is not found
    let categoryPool = dataset[category];
    if (!categoryPool || categoryPool.length === 0) {
      console.warn(`Category pool for '${category}' is empty. Falling back to 'general'.`);
      categoryPool = dataset.general;
    }

    if (!categoryPool || categoryPool.length === 0) {
      throw new Error(`Failed to find any paragraphs for language: ${language}`);
    }

    // Filter by length
    let filteredByLength = categoryPool.filter(p => p.length === length);
    
    // Fallback if no paragraph matches the requested length
    if (filteredByLength.length === 0) {
      console.warn(`No paragraph found with length '${length}' in category. Ignoring length filter.`);
      filteredByLength = categoryPool;
    }

    const selectedParagraph = randomService.getRandomItem(filteredByLength);
    return selectedParagraph.text;
  }

  public async generateQuote(
    language: string,
    category: string = "motivational"
  ) {
    const dataset = await datasetLoader.loadQuotesDataset(language);

    let categoryPool = dataset[category];
    if (!categoryPool || categoryPool.length === 0) {
      console.warn(`Quote pool for '${category}' is empty. Falling back to 'motivational'.`);
      categoryPool = dataset.motivational;
    }

    if (!categoryPool || categoryPool.length === 0) {
      throw new Error(`Failed to find any quotes for language: ${language}`);
    }

    return randomService.getRandomItem(categoryPool);
  }

  public generateNumbersText(
    type: "integers" | "decimals" | "currency" | "phone_numbers" | "mixed",
    length: number = 20
  ): string {
    const generators = {
      integers: () => randomService.getRandomIndex(10000).toString(),
      decimals: () => (randomService.getRandomIndex(100000) / 100).toFixed(2),
      currency: () => `$${(randomService.getRandomIndex(100000) / 100).toFixed(2)}`,
      phone_numbers: () => `+${randomService.getRandomIndex(9)+1}-${randomService.getRandomIndex(900)+100}-${randomService.getRandomIndex(9000)+1000}`,
    };

    const tokens: string[] = [];
    const keys = Object.keys(generators) as (keyof typeof generators)[];

    for (let i = 0; i < length; i++) {
      let t = type;
      if (t === "mixed") {
        t = randomService.getRandomItem(keys);
      }
      tokens.push(generators[t as keyof typeof generators]());
    }

    return tokens.join(" ");
  }

  public generatePunctuationText(
    type: "basic" | "advanced" | "mixed",
    length: number = 30
  ): string {
    const basicPunc = [",", ".", "?", "!", ";", ":", "'", "\""];
    const advancedPunc = ["(", ")", "[", "]", "{", "}", "-", "_", "/", "\\", "|", "<", ">", "~", "@", "#", "$", "%", "^", "&", "*", "+", "="];
    let pool: string[] = [];

    if (type === "basic") {
      pool = basicPunc;
    } else if (type === "advanced") {
      pool = advancedPunc;
    } else {
      pool = [...basicPunc, ...advancedPunc];
    }

    // Generate clusters of punctuations to simulate typing sequences
    const tokens: string[] = [];
    for (let i = 0; i < length; i++) {
      const clusterLength = randomService.getRandomIndex(3) + 1; // 1 to 3 chars
      let cluster = "";
      for (let j = 0; j < clusterLength; j++) {
        cluster += randomService.getRandomItem(pool);
      }
      tokens.push(cluster);
    }

    return tokens.join(" ");
  }
}

export const contentGenerator = new ContentGenerator();
