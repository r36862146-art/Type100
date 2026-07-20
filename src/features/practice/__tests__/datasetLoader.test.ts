import { datasetLoader } from "../../../services/datasetLoader";

describe("DatasetLoader", () => {
  beforeEach(() => {
    datasetLoader.clearCache();
  });

  it("should load words dataset for 'en' and cache it", async () => {
    const dataset = await datasetLoader.loadWordsDataset("en");
    expect(dataset.easy).toBeDefined();
    
    // Check if it caches
    const cachedDataset = await datasetLoader.loadWordsDataset("en");
    expect(cachedDataset).toBe(dataset); // Reference equality check
  });

  it("should load words dataset for 'hi'", async () => {
    const dataset = await datasetLoader.loadWordsDataset("hi");
    expect(dataset.easy).toBeDefined();
  });

  it("should load paragraphs dataset for 'en' and cache it", async () => {
    const dataset = await datasetLoader.loadParagraphsDataset("en");
    expect(dataset.general).toBeDefined();
    
    // Check if it caches
    const cachedDataset = await datasetLoader.loadParagraphsDataset("en");
    expect(cachedDataset).toBe(dataset); // Reference equality check
  });

  it("should load paragraphs dataset for 'hi'", async () => {
    const dataset = await datasetLoader.loadParagraphsDataset("hi");
    expect(dataset.general).toBeDefined();
  });

  it("should load quotes dataset for 'en' and cache it", async () => {
    const dataset = await datasetLoader.loadQuotesDataset("en");
    expect(dataset.motivational).toBeDefined();
    
    // Check if it caches
    const cachedDataset = await datasetLoader.loadQuotesDataset("en");
    expect(cachedDataset).toBe(dataset); // Reference equality check
  });

  it("should load quotes dataset for 'hi'", async () => {
    const dataset = await datasetLoader.loadQuotesDataset("hi");
    expect(dataset.motivational).toBeDefined();
  });
});
