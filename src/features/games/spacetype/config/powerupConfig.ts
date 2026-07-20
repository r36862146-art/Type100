export type PowerupType = 
  | "rapid_fire" 
  | "shield" 
  | "slow_time" 
  | "smart_bomb" 
  | "freeze" 
  | "double_score";

export interface PowerupConfig {
  type: PowerupType;
  durationMs: number;
  color: string;
  symbol: string;
  dropWeight: number; // For weighted random selection
}

export const POWERUP_CONFIGS: Record<PowerupType, PowerupConfig> = {
  rapid_fire: {
    type: "rapid_fire",
    durationMs: 10000,
    color: "#f59e0b", // amber
    symbol: "R",
    dropWeight: 20
  },
  shield: {
    type: "shield",
    durationMs: 15000,
    color: "#3b82f6", // blue
    symbol: "S",
    dropWeight: 15
  },
  slow_time: {
    type: "slow_time",
    durationMs: 8000,
    color: "#8b5cf6", // violet
    symbol: "T",
    dropWeight: 15
  },
  smart_bomb: {
    type: "smart_bomb",
    durationMs: 0, // Instant
    color: "#ef4444", // red
    symbol: "B",
    dropWeight: 5
  },
  freeze: {
    type: "freeze",
    durationMs: 5000,
    color: "#06b6d4", // cyan
    symbol: "F",
    dropWeight: 10
  },
  double_score: {
    type: "double_score",
    durationMs: 15000,
    color: "#10b981", // emerald
    symbol: "X",
    dropWeight: 20
  }
};
