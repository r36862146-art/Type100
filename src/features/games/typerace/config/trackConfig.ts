export type TrackTheme = 'city' | 'cyber';

export interface TrackConfig {
  id: TrackTheme;
  name: string;
  roadColor: string;
  markingColor: string;
  shoulderColor: string;
  particleColor: string;
}

export const TRACK_THEMES: Record<TrackTheme, TrackConfig> = {
  city: {
    id: 'city',
    name: 'City Highway',
    roadColor: '#1e293b', // slate-800
    markingColor: '#cbd5e1', // slate-300
    shoulderColor: '#334155', // slate-700
    particleColor: '#ffffff',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber City',
    roadColor: '#0f172a', // slate-900
    markingColor: '#06b6d4', // cyan-500
    shoulderColor: '#1e1b4b', // indigo-950
    particleColor: '#a855f7', // purple-500
  }
};
