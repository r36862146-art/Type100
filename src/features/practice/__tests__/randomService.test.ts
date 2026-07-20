import { randomService } from "../../../services/randomService";

describe("RandomService", () => {
  it("should return a random index within the bounds", () => {
    const index = randomService.getRandomIndex(10);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(10);
  });

  it("should return 0 when max is 0 or less", () => {
    expect(randomService.getRandomIndex(0)).toBe(0);
    expect(randomService.getRandomIndex(-5)).toBe(0);
  });

  it("should return a random item from the array", () => {
    const items = ["a", "b", "c"];
    const item = randomService.getRandomItem(items);
    expect(items).toContain(item);
  });

  it("should throw an error when getting a random item from an empty array", () => {
    expect(() => randomService.getRandomItem([])).toThrow("Cannot get random item from an empty array.");
  });

  it("should return an array of random items of the specified count", () => {
    const items = ["a", "b", "c"];
    const result = randomService.getRandomItems(items, 5);
    expect(result.length).toBe(5);
    result.forEach(item => expect(items).toContain(item));
  });

  it("should return an empty array if count is 0 or less", () => {
    const items = ["a", "b", "c"];
    expect(randomService.getRandomItems(items, 0)).toEqual([]);
    expect(randomService.getRandomItems(items, -2)).toEqual([]);
  });

  it("should throw an error when getting random items from an empty array", () => {
    expect(() => randomService.getRandomItems([], 5)).toThrow("Cannot get random items from an empty array.");
  });
});
