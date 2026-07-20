import { create } from 'zustand';

export interface TypingState {
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  combo: number;
  longestCombo: number;
  wpm: number;
  accuracy: number;
  startTime: number | null;
  endTime: number | null;
}

interface TypingStore extends TypingState {
  startSession: () => void;
  endSession: () => void;
  registerKeystroke: (isValid: boolean) => void;
  updateMetrics: () => void;
  reset: () => void;
}

const initialState: TypingState = {
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  incorrectKeystrokes: 0,
  combo: 0,
  longestCombo: 0,
  wpm: 0,
  accuracy: 100,
  startTime: null,
  endTime: null,
};

export const useTypingEngine = create<TypingStore>((set, get) => ({
  ...initialState,
  
  startSession: () => {
    set({ ...initialState, startTime: Date.now() });
  },

  endSession: () => {
    set({ endTime: Date.now() });
    get().updateMetrics();
  },

  registerKeystroke: (isValid: boolean) => {
    const { startTime, combo, longestCombo, correctKeystrokes, incorrectKeystrokes } = get();
    
    // Auto-start if not started
    let actualStartTime = startTime;
    if (!actualStartTime) {
      actualStartTime = Date.now();
      set({ startTime: actualStartTime });
    }

    if (isValid) {
      const newCombo = combo + 1;
      set({
        correctKeystrokes: correctKeystrokes + 1,
        totalKeystrokes: get().totalKeystrokes + 1,
        combo: newCombo,
        longestCombo: Math.max(longestCombo, newCombo)
      });
    } else {
      set({
        incorrectKeystrokes: incorrectKeystrokes + 1,
        totalKeystrokes: get().totalKeystrokes + 1,
        combo: 0
      });
    }

    get().updateMetrics();
  },

  updateMetrics: () => {
    const { startTime, correctKeystrokes, totalKeystrokes } = get();
    if (!startTime) return;

    const elapsedMinutes = (Date.now() - startTime) / 60000;
    
    let wpm = 0;
    if (elapsedMinutes > 0) {
      wpm = Math.round((correctKeystrokes / 5) / elapsedMinutes);
    }
    
    let accuracy = 100;
    if (totalKeystrokes > 0) {
      accuracy = Math.round((correctKeystrokes / totalKeystrokes) * 100);
    }

    set({ wpm, accuracy });
  },

  reset: () => {
    set(initialState);
  }
}));
