export interface RewardConfig {
  baseCoins: number;
  baseXp: number;
  positionMultipliers: number[]; // Index corresponds to position (0th = 1st place)
}

export const REWARD_CONFIG: RewardConfig = {
  baseCoins: 50,
  baseXp: 100,
  positionMultipliers: [2.0, 1.5, 1.2, 1.0, 0.8, 0.5, 0.2, 0.1], 
};

export function calculateRewards(position: number, baseMultiplier: number = 1) {
  const mult = REWARD_CONFIG.positionMultipliers[position - 1] || 0.1;
  return {
    coins: Math.floor(REWARD_CONFIG.baseCoins * mult * baseMultiplier),
    xp: Math.floor(REWARD_CONFIG.baseXp * mult * baseMultiplier),
  };
}
