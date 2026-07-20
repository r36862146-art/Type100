import { WordsProvider } from "../providers/words";

describe("WordsProvider", () => {
  it("should have correct mode id", () => {
    const provider = new WordsProvider();
    expect(provider.getModeId()).toBe("words");
  });

  it("should generate words practice content with default config", async () => {
    const provider = new WordsProvider();
    const content = await provider.generate({
      mode: "words",
      language: "en",
    });

    expect(content.id).toContain("words-en-medium-50");
    expect(content.language).toBe("en");
    expect(content.text.split(" ").length).toBe(50);
  });

  it("should generate words practice content with specific config", async () => {
    const provider = new WordsProvider();
    const content = await provider.generate({
      mode: "words",
      language: "hi",
      difficulty: "hard",
      length: 25,
    });

    expect(content.id).toContain("words-hi-hard-25");
    expect(content.language).toBe("hi");
    expect(content.text.split(" ").length).toBe(25);
  });
});
