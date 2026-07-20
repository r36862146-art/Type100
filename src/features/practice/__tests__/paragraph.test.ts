import { ParagraphProvider } from "../providers/paragraph";

describe("ParagraphProvider", () => {
  it("should have correct mode id", () => {
    const provider = new ParagraphProvider();
    expect(provider.getModeId()).toBe("paragraphs");
  });

  it("should generate paragraph practice content with default config", async () => {
    const provider = new ParagraphProvider();
    const content = await provider.generate({
      mode: "paragraphs",
      language: "en",
    });

    expect(content.id).toContain("paragraphs-en-general-medium");
    expect(content.language).toBe("en");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
  });

  it("should generate paragraph practice content with specific config", async () => {
    const provider = new ParagraphProvider();
    const content = await provider.generate({
      mode: "paragraphs",
      language: "hi",
      category: "technology",
      paragraphLength: "long",
    });

    expect(content.id).toContain("paragraphs-hi-technology-long");
    expect(content.language).toBe("hi");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
  });
});
