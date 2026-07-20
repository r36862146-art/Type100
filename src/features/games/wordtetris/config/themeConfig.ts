export type TetrisTheme = 'dark_neon' | 'cyberpunk';

export interface ThemeConfig {
  id: TetrisTheme;
  backgroundColor: string;
  wordCardColor: string;
  wordTextColor: string;
  typedTextColor: string;
  dangerZoneColor: string;
  particleColor: string;
}

export const THEME_CONFIGS: Record<TetrisTheme, ThemeConfig> = {
  dark_neon: {
    id: 'dark_neon',
    backgroundColor: '#09090b', // zinc-950
    wordCardColor: '#18181b', // zinc-900
    wordTextColor: '#71717a', // zinc-500
    typedTextColor: '#22c55e', // green-500
    dangerZoneColor: 'rgba(239, 68, 68, 0.2)', // red-500/20
    particleColor: '#ffffff',
  },
  cyberpunk: {
    id: 'cyberpunk',
    backgroundColor: '#0f172a', // slate-900
    wordCardColor: '#1e1b4b', // indigo-950
    wordTextColor: '#6366f1', // indigo-500
    typedTextColor: '#06b6d4', // cyan-500
    dangerZoneColor: 'rgba(217, 70, 239, 0.2)', // fuchsia-500/20
    particleColor: '#f472b6', // pink-400
  }
};
