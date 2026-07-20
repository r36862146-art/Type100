export type EnemyType = 
  | "scout" 
  | "fighter" 
  | "tank" 
  | "splitter" 
  | "kamikaze" 
  | "shield" 
  | "elite" 
  | "boss";

export interface EnemyConfig {
  type: EnemyType;
  baseSpeed: number;
  wordLengthMin: number;
  wordLengthMax: number;
  color: string;
  points: number;
  radius: number;
  isBoss: boolean;
  hasShield?: boolean;
}

export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  scout: {
    type: "scout",
    baseSpeed: 0.08,
    wordLengthMin: 3,
    wordLengthMax: 5,
    color: "#38bdf8", // light blue
    points: 100,
    radius: 15,
    isBoss: false,
  },
  fighter: {
    type: "fighter",
    baseSpeed: 0.06,
    wordLengthMin: 5,
    wordLengthMax: 7,
    color: "#a78bfa", // purple
    points: 150,
    radius: 20,
    isBoss: false,
  },
  tank: {
    type: "tank",
    baseSpeed: 0.03,
    wordLengthMin: 8,
    wordLengthMax: 12,
    color: "#fb923c", // orange
    points: 300,
    radius: 30,
    isBoss: false,
  },
  splitter: {
    type: "splitter",
    baseSpeed: 0.04,
    wordLengthMin: 6,
    wordLengthMax: 9,
    color: "#facc15", // yellow
    points: 250,
    radius: 25,
    isBoss: false,
  },
  kamikaze: {
    type: "kamikaze",
    baseSpeed: 0.12,
    wordLengthMin: 4,
    wordLengthMax: 6,
    color: "#ef4444", // red
    points: 200,
    radius: 12,
    isBoss: false,
  },
  shield: {
    type: "shield",
    baseSpeed: 0.05,
    wordLengthMin: 6,
    wordLengthMax: 10,
    color: "#2dd4bf", // teal
    points: 350,
    radius: 25,
    isBoss: false,
    hasShield: true,
  },
  elite: {
    type: "elite",
    baseSpeed: 0.07,
    wordLengthMin: 10,
    wordLengthMax: 15,
    color: "#f43f5e", // rose
    points: 500,
    radius: 28,
    isBoss: false,
  },
  boss: {
    type: "boss",
    baseSpeed: 0.02,
    wordLengthMin: 15,
    wordLengthMax: 25,
    color: "#dc2626", // strong red
    points: 2000,
    radius: 60,
    isBoss: true,
  }
};
