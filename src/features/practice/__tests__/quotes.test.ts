import { QuoteProvider } from "../providers/quotes";

describe("QuoteProvider", () => {
  it("should have correct mode id", () => {
    const provider = new QuoteProvider();
    expect(provider.getModeId()).toBe("quotes");
  });

  it("should generate quote practice content with default config", async () => {
    const provider = new QuoteProvider();
    const content = await provider.generate({
      mode: "quotes",
      language: "en",
    });

    expect(content.id).toContain("quotes-en-motivational");
    expect(content.language).toBe("en");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
    expect(content.metadata).toBeDefined();
    expect(content.metadata?.author).toBeDefined();
    expect(content.metadata?.category).toBe("motivational");
    expect(content.metadata?.source).toBeDefined();
  });

  it("should generate quote practice content with specific config", async () => {
    const provider = new QuoteProvider();
    const content = await provider.generate({
      mode: "quotes",
      language: "hi",
      quoteCategory: "technology",
    });

    expect(content.id).toContain("quotes-hi-technology");
    expect(content.language).toBe("hi");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
    expect(content.metadata?.category).toBe("technology");
  });
});
