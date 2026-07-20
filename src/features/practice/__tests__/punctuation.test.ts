import { PunctuationProvider } from "../providers/punctuation";

describe("PunctuationProvider", () => {
  it("should have correct mode id", () => {
    const provider = new PunctuationProvider();
    expect(provider.getModeId()).toBe("punctuation");
  });

  it("should generate punctuation practice content with default config", async () => {
    const provider = new PunctuationProvider();
    const content = await provider.generate({
      mode: "punctuation",
      language: "en",
    });

    expect(content.id).toContain("punctuation-mixed-30");
    expect(content.language).toBe("en");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
    expect(content.text.split(" ").length).toBe(30);
  });

  it("should generate punctuation practice content with specific config", async () => {
    const provider = new PunctuationProvider();
    const content = await provider.generate({
      mode: "punctuation",
      language: "hi",
      punctuationType: "advanced",
      length: 15,
    });

    expect(content.id).toContain("punctuation-advanced-15");
    expect(content.text.split(" ").length).toBe(15);
  });
});
