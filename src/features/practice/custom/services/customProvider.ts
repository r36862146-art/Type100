import { PracticeProvider, PracticeConfig, PracticeContent, PracticeMode } from "../../types";
import { normalizeCustomText } from "./normalizer";
import { validateCustomText } from "./validator";
import { saveRecentText } from "./storage";

export const customProvider: PracticeProvider = {
  getModeId(): PracticeMode {
    return "custom";
  },

  async generate(config: PracticeConfig): Promise<PracticeContent> {
    if (config.mode !== "custom") {
      throw new Error(`Invalid mode for customProvider: ${config.mode}`);
    }

    const rawText = config.customText || "";
    const normalizedText = normalizeCustomText(rawText);
    
    const validation = validateCustomText(normalizedText);
    if (!validation.isValid) {
      throw new Error(`Custom text validation failed: ${validation.errors.join("; ")}`);
    }

    // Save to local storage upon successful session generation
    saveRecentText(normalizedText);

    return {
      id: `custom_${crypto.randomUUID()}`,
      text: normalizedText,
      language: config.language,
      metadata: {
        category: "custom",
      }
    };
  }
};
