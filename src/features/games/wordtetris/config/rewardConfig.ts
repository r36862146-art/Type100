export interface RewardConfig {
  pointsPerChar: number;
  comboBonusMultiplier: number; // Points = base * (1 + combo * multiplier)
  baseCoins: number;
  baseXp: number;
}

export const REWARD_CONFIG: RewardConfig = {
  pointsPerChar: 10,
  comboBonusMultiplier: 0.1, // +10% per combo step
  baseCoins: 10,
  baseXp: 50,
};

export function calculateScore(wordLength: number, combo: number): number {
  const base = wordLength * REWARD_CONFIG.pointsPerChar;
  return Math.floor(base * (1 + combo * REWARD_CONFIG.comboBonusMultiplier));
}
