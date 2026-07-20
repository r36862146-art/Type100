import { NumbersProvider } from "../providers/numbers";

describe("NumbersProvider", () => {
  it("should have correct mode id", () => {
    const provider = new NumbersProvider();
    expect(provider.getModeId()).toBe("numbers");
  });

  it("should generate numbers practice content with default config", async () => {
    const provider = new NumbersProvider();
    const content = await provider.generate({
      mode: "numbers",
      language: "en",
    });

    expect(content.id).toContain("numbers-mixed-20");
    expect(content.language).toBe("en");
    expect(typeof content.text).toBe("string");
    expect(content.text.length).toBeGreaterThan(0);
    expect(content.text.split(" ").length).toBe(20);
  });

  it("should generate numbers practice content with specific config", async () => {
    const provider = new NumbersProvider();
    const content = await provider.generate({
      mode: "numbers",
      language: "hi",
      numberType: "decimals",
      length: 10,
    });

    expect(content.id).toContain("numbers-decimals-10");
    expect(content.text.split(" ").length).toBe(10);
    expect(content.text).toMatch(/\d+\.\d{2}/); // Rough check for decimal presence
  });
});
