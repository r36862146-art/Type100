import { WordsProvider } from "../providers/words";
import { PracticeConfig } from "../types";

describe("WordsProvider", () => {
  it("should have the correct mode id", () => {
    const provider = new WordsProvider();
    expect(provider.getModeId()).toBe("words");
  });

  it("should generate the requested number of words in English", async () => {
    const provider = new WordsProvider();
    const config: PracticeConfig = { mode: "words", language: "en", length: 10 };
    
    const content = await provider.generate(config);
    expect(content.language).toBe("en");
    expect(content.text.split(" ").length).toBe(10);
  });

  it("should generate the requested number of words in Hindi", async () => {
    const provider = new WordsProvider();
    const config: PracticeConfig = { mode: "words", language: "hi", length: 5 };
    
    const content = await provider.generate(config);
    expect(content.language).toBe("hi");
    expect(content.text.split(" ").length).toBe(5);
  });
});
