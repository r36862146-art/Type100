export interface AICarProfile {
  name: string;
  color: string;
  baseSpeed: number;     // base generic speed
  consistency: number;   // 0-1, higher means fewer mistakes
  mistakeRate: number;   // probability of slowing down per second
  boostProbability: number; // probability of using nitro when available
}

export const AI_PROFILES: AICarProfile[] = [
  { name: 'Rookie AI', color: '#64748b', baseSpeed: 1.0, consistency: 0.6, mistakeRate: 0.05, boostProbability: 0.2 },
  { name: 'Standard AI', color: '#10b981', baseSpeed: 1.2, consistency: 0.7, mistakeRate: 0.03, boostProbability: 0.4 },
  { name: 'Pro AI', color: '#f59e0b', baseSpeed: 1.4, consistency: 0.85, mistakeRate: 0.01, boostProbability: 0.7 },
  { name: 'Elite AI', color: '#ef4444', baseSpeed: 1.6, consistency: 0.95, mistakeRate: 0.005, boostProbability: 0.9 },
  { name: 'Nemesis', color: '#8b5cf6', baseSpeed: 1.7, consistency: 0.98, mistakeRate: 0.002, boostProbability: 0.95 },
];

export const PLAYER_CAR_CONFIG = {
  color: '#0ea5e9', // sky-500
  nitroColor: '#38bdf8',
  maxNitro: 100,
  nitroDepleteRate: 40, // per second
  nitroBoostMultiplier: 1.5,
  wpmToSpeedMultiplier: 0.02, // how much speed 1 WPM gives
};
