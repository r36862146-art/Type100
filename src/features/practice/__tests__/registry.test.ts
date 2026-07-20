import { practiceRegistry } from "../registry";
import { PracticeProvider, PracticeMode, PracticeConfig, PracticeContent } from "../types";

class MockProvider implements PracticeProvider {
  constructor(private mode: PracticeMode) {}
  
  getModeId() {
    return this.mode;
  }
  
  async generate(config: PracticeConfig): Promise<PracticeContent> {
    return {
      id: "mock",
      text: `mock ${config.mode}`,
      language: config.language,
    };
  }
}

describe("PracticeModeRegistry", () => {
  beforeEach(() => {
    // Clear out standard singleton state for tests if needed, or use a new instance if we made it instantiable.
    // For now we'll just register fresh mocks.
  });

  it("should register a provider and retrieve registered modes", () => {
    const provider = new MockProvider("quotes");
    practiceRegistry.register(provider);
    
    expect(practiceRegistry.getRegisteredModes()).toContain("quotes");
  });

  it("should generate content using the registered provider", async () => {
    const provider = new MockProvider("numbers");
    practiceRegistry.register(provider);
    
    const config: PracticeConfig = { mode: "numbers", language: "en" };
    const content = await practiceRegistry.generateContent(config);
    
    expect(content.text).toBe("mock numbers");
  });

  it("should cache generated content for identical configurations", async () => {
    const provider = new MockProvider("custom");
    let generateCount = 0;
    
    // Override generate to track calls
    provider.generate = async (config) => {
      generateCount++;
      return { id: "custom-1", text: "custom content", language: config.language };
    };
    
    practiceRegistry.register(provider);
    practiceRegistry.clearCache(); // Reset cache before test
    
    const config: PracticeConfig = { mode: "custom", language: "en" };
    
    await practiceRegistry.generateContent(config);
    await practiceRegistry.generateContent(config); // Should hit cache
    
    expect(generateCount).toBe(1);
  });

  it("should throw an error for unregistered modes", async () => {
    const config: PracticeConfig = { mode: "paragraphs", language: "en" };
    // Assuming paragraphs is not registered yet in this test block
    practiceRegistry.unregister("paragraphs");
    
    await expect(practiceRegistry.generateContent(config)).rejects.toThrow("No provider registered for mode: paragraphs");
  });
});
