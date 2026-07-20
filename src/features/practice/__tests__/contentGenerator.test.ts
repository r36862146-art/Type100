import { contentGenerator } from "../../../services/contentGenerator";

describe("ContentGenerator", () => {
  it("should generate words text based on language and difficulty", async () => {
    const text = await contentGenerator.generateWordsText("en", "easy", 10);
    const words = text.split(" ");
    expect(words.length).toBe(10);
  });

  it("should generate paragraph text based on language and category", async () => {
    const text = await contentGenerator.generateParagraphText("en", "general", "short");
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("should fallback to 'medium' difficulty if an invalid difficulty is provided (or if it doesn't exist)", async () => {
    // In TS we force difficulty, but we can cast to any to simulate bad config
    const text = await contentGenerator.generateWordsText("en", "invalid_difficulty" as any, 5);
    const words = text.split(" ");
    expect(words.length).toBe(5);
  });

  it("should fallback to 'general' category if an invalid category is provided", async () => {
    const text = await contentGenerator.generateParagraphText("en", "invalid_category" as any, "short");
    expect(typeof text).toBe("string");
    expect(text.length).toBeGreaterThan(0);
  });

  it("should generate quote based on language and category", async () => {
    const quote = await contentGenerator.generateQuote("en", "science");
    expect(quote.text).toBeDefined();
    expect(quote.author).toBeDefined();
    expect(quote.source).toBeDefined();
  });

  it("should fallback to 'motivational' quote if an invalid quote category is provided", async () => {
    const quote = await contentGenerator.generateQuote("en", "invalid_category" as any);
    expect(quote.text).toBeDefined();
  });

  it("should generate numbers text correctly", () => {
    const integers = contentGenerator.generateNumbersText("integers", 5);
    expect(integers.split(" ").length).toBe(5);

    const currency = contentGenerator.generateNumbersText("currency", 3);
    expect(currency).toContain("$");
  });

  it("should generate punctuation text correctly", () => {
    const basic = contentGenerator.generatePunctuationText("basic", 10);
    expect(basic.split(" ").length).toBe(10);
    expect(basic).toMatch(/^[,\.?!;:'" ]+$/);
  });
});
