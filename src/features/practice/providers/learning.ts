import { PracticeConfig, PracticeContent, PracticeProvider, LearningDataset } from "../types";
import { selectUnplayedItem } from "../utils/history";

export class LearningProvider implements PracticeProvider {
  public getModeId() {
    return "learning" as const;
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const topic = config.learningTopic || "General";
    
    // In a real application with a database, this would be an API call.
    // For local JSON files, we fetch or import the corresponding file.
    const topicSlug = this.slugify(topic);
    
    let dataset: LearningDataset;
    
    try {
      // Dynamic import of the JSON file using relative path for better bundler support
      const raw = await import(`../../../data/learning/${config.language}/${topicSlug}.json`);
      dataset = (raw.default || raw) as LearningDataset;
    } catch (error) {
      console.warn(`Could not load learning dataset for topic: ${topicSlug} in language: ${config.language}. Falling back to en/general. Error:`, error);
      try {
        const raw = await import(`../../../data/learning/en/general.json`);
        dataset = (raw.default || raw) as LearningDataset;
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
        throw new Error("Failed to load even the fallback learning dataset.");
      }
    }

    const { items } = dataset;
    
    // Filter by difficulty if provided (default to any if not specified)
    let filtered = items;
    
    if (config.difficulty) {
      filtered = filtered.filter(item => item.difficulty === config.difficulty);
    }

    // Filter by timer matching.
    // Assuming config.length represents the timer in seconds (if mode is "time").
    // If not matching perfectly, we still try to find the closest fit.
    if (config.length) {
      const exactMatch = filtered.filter(item => item.suitableTimers.includes(config.length!));
      if (exactMatch.length > 0) {
        filtered = exactMatch;
      }
    }
    
    if (filtered.length === 0) {
      // If no item perfectly matches the filters, fall back to any available item from the topic
      filtered = items;
    }

    // Pick a random unplayed paragraph
    const selectedItem = selectUnplayedItem(filtered);
    
    if (!selectedItem) {
      throw new Error("No paragraphs found for this combination.");
    }

    return {
      id: selectedItem.id,
      text: selectedItem.text,
      language: config.language,
      metadata: {
        category: selectedItem.topic,
        author: selectedItem.title,
        source: `Difficulty: ${selectedItem.difficulty}`
      }
    };
  }
  
  private slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_')       // Replace spaces with _
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '_')     // Replace multiple - with single _
      .replace(/^-+/, '')         // Trim - from start of text
      .replace(/-+$/, '');        // Trim - from end of text
  }
}
