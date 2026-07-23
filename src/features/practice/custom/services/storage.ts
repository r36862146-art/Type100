export interface SavedCustomText {
  id: string;
  text: string;
  title: string;
  lastUsedAt: number;
}

const STORAGE_KEY = 'type100x_recent_custom_texts';
const MAX_RECENT_TEXTS = 10;

export function getRecentTexts(): SavedCustomText[] {
  if (typeof window === 'undefined') return [];
  try {
    const oldKey = 'type100_recent_custom_texts';
    const oldData = localStorage.getItem(oldKey);
    if (oldData && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, oldData);
      localStorage.removeItem(oldKey);
    }
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load recent custom texts from storage:", error);
    return [];
  }
}

export function saveRecentText(text: string): SavedCustomText {
  const current = getRecentTexts();
  
  // Create a short title from the text (first 30 chars)
  const title = text.slice(0, 30).replace(/\n/g, ' ') + (text.length > 30 ? '...' : '');

  // Check if text already exists, remove it so it can be added to the top
  const existingIndex = current.findIndex(t => t.text === text);
  if (existingIndex !== -1) {
    current.splice(existingIndex, 1);
  }

  const newItem: SavedCustomText = {
    id: crypto.randomUUID(),
    text,
    title,
    lastUsedAt: Date.now()
  };

  const updated = [newItem, ...current].slice(0, MAX_RECENT_TEXTS);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save recent custom text to storage:", error);
    }
  }

  return newItem;
}

export function clearRecentTexts(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
