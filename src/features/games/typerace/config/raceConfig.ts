export type RaceMode = 'sprint' | 'circuit' | 'marathon';

export interface RaceModeConfig {
  id: RaceMode;
  name: string;
  durationSeconds: number;
  aiOpponentCount: number;
}

export const RACE_MODES: Record<RaceMode, RaceModeConfig> = {
  sprint: {
    id: 'sprint',
    name: 'Sprint',
    durationSeconds: 30,
    aiOpponentCount: 3,
  },
  circuit: {
    id: 'circuit',
    name: 'Circuit',
    durationSeconds: 60,
    aiOpponentCount: 5,
  },
  marathon: {
    id: 'marathon',
    name: 'Marathon',
    durationSeconds: 120,
    aiOpponentCount: 7,
  }
};
