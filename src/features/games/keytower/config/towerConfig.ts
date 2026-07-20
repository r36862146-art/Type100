export interface TowerConfig {
  maxStability: number;
  drainPerSecond: number; // Base drain rate
  drainIncreasePerLevel: number; // How much drain increases per 20 floors
  mistakePenalty: number; // Stability lost per typo
  correctRecovery: number; // Stability recovered per correct word
  crackThreshold: number; // Stability % below which tower shakes and gets cracks
  cameraSmoothness: number;
}

export const TOWER_CONFIG: TowerConfig = {
  maxStability: 100,
  drainPerSecond: 2.0, // Base 2% drain per second
  drainIncreasePerLevel: 0.5,
  mistakePenalty: 15.0, // Large penalty for mistakes
  correctRecovery: 10.0, // Recovery on correct word
  crackThreshold: 30.0, // Shakes/cracks under 30%
  cameraSmoothness: 0.05,
};
