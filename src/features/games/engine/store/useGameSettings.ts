import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface GameSettingsState {
  // Audio
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  
  // Visuals
  quality: QualityPreset;
  reducedMotion: boolean;
  
  // Actions
  setMasterVolume: (val: number) => void;
  setSfxVolume: (val: number) => void;
  setMusicVolume: (val: number) => void;
  setQuality: (val: QualityPreset) => void;
  setReducedMotion: (val: boolean) => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  masterVolume: 1.0,
  sfxVolume: 1.0,
  musicVolume: 1.0,
  quality: 'high' as QualityPreset,
  reducedMotion: false,
};

export const useGameSettings = create<GameSettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setMasterVolume: (val) => set({ masterVolume: val }),
      setSfxVolume: (val) => set({ sfxVolume: val }),
      setMusicVolume: (val) => set({ musicVolume: val }),
      setQuality: (val) => set({ quality: val }),
      setReducedMotion: (val) => set({ reducedMotion: val }),
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'type100-game-settings',
    }
  )
);
