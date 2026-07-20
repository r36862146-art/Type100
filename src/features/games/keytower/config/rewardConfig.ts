export interface RewardConfig {
  pointsPerFloor: number;
  goldenMultiplier: number;
  comboBonusMultiplier: number; 
  baseCoins: number;
  baseXp: number;
}

export const REWARD_CONFIG: RewardConfig = {
  pointsPerFloor: 100,
  goldenMultiplier: 3.0,
  comboBonusMultiplier: 0.05, // +5% score per combo step
  baseCoins: 20,
  baseXp: 100,
};
