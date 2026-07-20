export class RandomService {
  /**
   * Returns a random integer between 0 and max (exclusive).
   */
  public getRandomIndex(max: number): number {
    if (max <= 0) return 0;
    return Math.floor(Math.random() * max);
  }

  /**
   * Returns a random item from the array.
   */
  public getRandomItem<T>(items: T[]): T {
    if (!items || items.length === 0) {
      throw new Error("Cannot get random item from an empty array.");
    }
    const index = this.getRandomIndex(items.length);
    return items[index];
  }

  /**
   * Returns an array of randomly selected items from the provided array.
   * Items can be repeated since practice modes often select with replacement.
   */
  public getRandomItems<T>(items: T[], count: number): T[] {
    if (!items || items.length === 0) {
      throw new Error("Cannot get random items from an empty array.");
    }
    if (count <= 0) return [];

    const selected: T[] = [];
    for (let i = 0; i < count; i++) {
      selected.push(this.getRandomItem(items));
    }
    return selected;
  }
}

// Export a singleton instance
export const randomService = new RandomService();
