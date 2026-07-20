export class WordManager {
  private dictionary: string[];
  
  constructor(dictionary: string[]) {
    this.dictionary = dictionary;
  }

  public getRandomWord(minLength: number = 3, maxLength: number = 10): string {
    const filtered = this.dictionary.filter(w => w.length >= minLength && w.length <= maxLength);
    if (filtered.length === 0) return "word"; // Fallback
    
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  public getWords(count: number, minLength: number = 3, maxLength: number = 10): string[] {
    const words: string[] = [];
    for (let i = 0; i < count; i++) {
      words.push(this.getRandomWord(minLength, maxLength));
    }
    return words;
  }
}
