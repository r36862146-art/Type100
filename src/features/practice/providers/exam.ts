import { PracticeConfig, PracticeContent, PracticeProvider, ExamDataset } from "../types";
import { selectUnplayedItem } from "../utils/history";

export class ExamProvider implements PracticeProvider {
  public getModeId() {
    return "exam" as const;
  }

  public async generate(config: PracticeConfig): Promise<PracticeContent> {
    const examId = config.examId;
    if (!examId) {
      throw new Error("No exam ID provided for exam mode.");
    }
    
    let dataset: ExamDataset;
    
    try {
      const raw = await import(`../../../data/exam_passages/${examId}.json`);
      dataset = (raw.default || raw) as ExamDataset;
    } catch (error) {
      console.error(`Could not load exam dataset for ID: ${examId}`, error);
      throw new Error("Failed to load exam practice data.");
    }

    const { items } = dataset;
    
    let filtered = items;
    
    if (config.examType) {
      filtered = filtered.filter(item => item.examType === config.examType);
    }
    
    if (config.examSetId) {
      filtered = filtered.filter(item => item.examSetId === config.examSetId);
    }
    
    if (filtered.length === 0) {
      filtered = items; // fallback to any difficulty if none match
    }

    const selectedItem = selectUnplayedItem(filtered);
    
    if (!selectedItem) {
      // If we somehow didn't get an item, maybe clear history manually or pick random
      const randomFallback = filtered[Math.floor(Math.random() * filtered.length)];
      if (!randomFallback) {
         throw new Error("No exam passages found for this configuration.");
      }
      return this.formatContent(randomFallback, config.language || 'en');
    }

    return this.formatContent(selectedItem, config.language || 'en');
  }

  private formatContent(item: any, language: "en" | "hi"): PracticeContent {
    return {
      id: item.id,
      text: item.text,
      language: language,
      metadata: {
        category: `Official Mock - ${item.examId.replace(/_/g, ' ')}`,
        author: item.title,
        source: `Target: ${item.targetSpeed} WPM | Duration: ${item.duration} Min`
      }
    };
  }
}
