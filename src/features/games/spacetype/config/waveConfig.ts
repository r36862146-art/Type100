import { EnemyType } from "./enemyConfig";

export interface WaveComposition {
  type: EnemyType;
  count: number;
}

export interface WaveConfig {
  waveIndex: number;
  composition: WaveComposition[];
  spawnIntervalMs: number;
  hasBoss: boolean;
  powerupDropChance: number; // 0 to 1
}

export const WAVE_CONFIGS: WaveConfig[] = [
  {
    waveIndex: 1,
    composition: [{ type: "scout", count: 5 }],
    spawnIntervalMs: 1500,
    hasBoss: false,
    powerupDropChance: 0.1
  },
  {
    waveIndex: 2,
    composition: [
      { type: "scout", count: 4 },
      { type: "fighter", count: 2 }
    ],
    spawnIntervalMs: 1200,
    hasBoss: false,
    powerupDropChance: 0.15
  },
  {
    waveIndex: 3,
    composition: [
      { type: "fighter", count: 5 },
      { type: "kamikaze", count: 2 }
    ],
    spawnIntervalMs: 1000,
    hasBoss: false,
    powerupDropChance: 0.2
  },
  {
    waveIndex: 4,
    composition: [
      { type: "scout", count: 8 },
      { type: "tank", count: 1 }
    ],
    spawnIntervalMs: 900,
    hasBoss: false,
    powerupDropChance: 0.2
  },
  {
    waveIndex: 5,
    composition: [],
    spawnIntervalMs: 2000,
    hasBoss: true, // Boss wave
    powerupDropChance: 0.5
  },
  // We can procedurally generate waves past 5
];

export function getWaveConfig(waveIndex: number): WaveConfig {
  if (waveIndex <= WAVE_CONFIGS.length) {
    return WAVE_CONFIGS[waveIndex - 1];
  }
  
  // Procedural wave generation for endless
  const difficultyMultiplier = waveIndex / 5;
  const hasBoss = waveIndex % 5 === 0;
  
  const composition: WaveComposition[] = [];
  
  if (!hasBoss) {
    composition.push({ type: "scout", count: Math.floor(4 * difficultyMultiplier) });
    composition.push({ type: "fighter", count: Math.floor(3 * difficultyMultiplier) });
    
    if (waveIndex > 6) composition.push({ type: "kamikaze", count: Math.floor(2 * difficultyMultiplier) });
    if (waveIndex > 7) composition.push({ type: "tank", count: Math.floor(1.5 * difficultyMultiplier) });
    if (waveIndex > 8) composition.push({ type: "splitter", count: Math.floor(1 * difficultyMultiplier) });
    if (waveIndex > 10) composition.push({ type: "shield", count: Math.floor(1 * difficultyMultiplier) });
    if (waveIndex > 12) composition.push({ type: "elite", count: Math.floor(0.5 * difficultyMultiplier) });
  }

  return {
    waveIndex,
    composition,
    spawnIntervalMs: Math.max(400, 1500 - (waveIndex * 50)),
    hasBoss,
    powerupDropChance: Math.min(0.4, 0.1 + (waveIndex * 0.02))
  };
}
