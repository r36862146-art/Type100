const HISTORY_KEY = "type100_content_history";

export function getPlayedHistory(): string[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(id: string) {
  try {
    const history = getPlayedHistory();
    if (!history.includes(id)) {
      history.push(id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (e) {
    console.warn("Failed to save history", e);
  }
}

export function clearHistoryForGroup(ids: string[]) {
  try {
    let history = getPlayedHistory();
    history = history.filter(hId => !ids.includes(hId));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn("Failed to clear history", e);
  }
}

/**
 * Selects a random item from a list of candidates, ensuring it hasn't been played yet.
 * If all candidates have been played, it clears their history and picks from the full pool again.
 */
export function selectUnplayedItem<T extends { id: string }>(candidates: T[]): T | null {
  if (candidates.length === 0) return null;

  const history = getPlayedHistory();
  let available = candidates.filter(c => !history.includes(c.id));

  // If all have been played, clear history for this specific subset and reset
  if (available.length === 0) {
    const candidateIds = candidates.map(c => c.id);
    clearHistoryForGroup(candidateIds);
    available = candidates;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  const selected = available[randomIndex];
  
  addToHistory(selected.id);
  
  return selected;
}
