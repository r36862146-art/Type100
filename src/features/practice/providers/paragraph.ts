import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider, PracticeDataset } from "../types";
import { selectUnplayedItem } from "../utils/history";

export class ParagraphProvider implements PracticeProvider {
  private practiceTopics = [
    "daily_life",
    "productivity",
    "technology",
    "nature",
    "communication",
    "travel",
    "health",
    "motivation",
    "business",
    "general_reading"
  ];

  public getModeId(): PracticeMode {
    return "practice";
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    // Pick a random topic for practice mode
    const randomTopicSlug = this.practiceTopics[Math.floor(Math.random() * this.practiceTopics.length)];
    
    let dataset: PracticeDataset;
    
    try {
      const raw = await import(`../../../data/practice/${config.language || 'en'}/${randomTopicSlug}.json`);
      dataset = (raw.default || raw) as PracticeDataset;
    } catch (error) {
      console.warn(`Could not load practice dataset for topic: ${randomTopicSlug}. Falling back to daily_life.`, error);
      try {
        const raw = await import(`../../../data/practice/en/daily_life.json`);
        dataset = (raw.default || raw) as PracticeDataset;
      } catch (fallbackError) {
        throw new Error("Failed to load practice datasets.");
      }
    }

    const { items } = dataset;
    
    let filtered = items;
    
    if (config.difficulty) {
      filtered = filtered.filter(item => item.difficulty === config.difficulty);
    }

    if (config.length) {
      const exactMatch = filtered.filter(item => item.suitableTimers.includes(config.length!));
      if (exactMatch.length > 0) {
        filtered = exactMatch;
      }
    }
    
    if (filtered.length === 0) {
      filtered = items;
    }

    const selectedItem = selectUnplayedItem(filtered);
    
    if (!selectedItem) {
      throw new Error("No practice paragraphs found for this combination.");
    }

    return {
      id: selectedItem.id,
      text: selectedItem.text,
      language: config.language || 'en',
      metadata: {
        category: selectedItem.topic,
        author: selectedItem.title,
        source: `Difficulty: ${selectedItem.difficulty}`
      }
    };
  }
}
