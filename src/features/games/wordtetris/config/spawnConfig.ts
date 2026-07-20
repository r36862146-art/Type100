export interface SpawnConfig {
  minSpawnIntervalMs: number; // Don't spawn faster than this
  baseSpawnIntervalMs: number; // Base spawn rate at level 1
  spawnIntervalMultiplierPerLevel: number; // Decrease interval per level
  horizontalPadding: number; // Pixels from edge of screen to avoid spawning
  verticalSpacing: number; // Minimum vertical distance between newly spawned words
}

export const SPAWN_CONFIG: SpawnConfig = {
  minSpawnIntervalMs: 500,
  baseSpawnIntervalMs: 2500,
  spawnIntervalMultiplierPerLevel: 0.95, // 5% faster spawns each level
  horizontalPadding: 50,
  verticalSpacing: 60,
};
