import { PracticeConfig, PracticeContent, PracticeMode, PracticeProvider } from "./types";

class PracticeModeRegistry {
  private providers: Map<PracticeMode, PracticeProvider> = new Map();
  private cache: Map<string, PracticeContent> = new Map();

  /**
   * Registers a new provider for a specific practice mode.
   */
  public register(provider: PracticeProvider): void {
    const mode = provider.getModeId();
    if (this.providers.has(mode)) {
      console.warn(`Provider for mode '${mode}' is being overwritten.`);
    }
    this.providers.set(mode, provider);
  }

  /**
   * Unregisters a provider by its mode ID.
   */
  public unregister(mode: PracticeMode): void {
    this.providers.delete(mode);
  }

  /**
   * Generates content based on the configuration. Uses cache if available.
   */
  public async generateContent(config: PracticeConfig): Promise<PracticeContent> {
    const provider = this.providers.get(config.mode);
    if (!provider) {
      throw new Error(`No provider registered for mode: ${config.mode}`);
    }

    const cacheKey = this.generateCacheKey(config);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const content = await provider.generate(config);
    this.cache.set(cacheKey, content);
    
    return content;
  }

  /**
   * Clears the content cache.
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Retrieves all registered modes.
   */
  public getRegisteredModes(): PracticeMode[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Generates a deterministic cache key based on the config payload.
   */
  private generateCacheKey(config: PracticeConfig): string {
    return JSON.stringify(config);
  }
}

// Export a singleton instance
export const practiceRegistry = new PracticeModeRegistry();

// Auto-register available providers
import { ParagraphProvider } from "./providers/paragraph";
import { customProvider } from "./custom/services/customProvider";
import { LearningProvider } from "./providers/learning";
import { ExamProvider } from "./providers/exam";

practiceRegistry.register(new ParagraphProvider());
practiceRegistry.register(customProvider);
practiceRegistry.register(new LearningProvider());
practiceRegistry.register(new ExamProvider());
