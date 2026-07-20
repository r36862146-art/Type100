export type FloorType = 'normal' | 'golden' | 'glass';

export interface FloorConfig {
  width: number;
  height: number;
  colorMap: Record<FloorType, string>;
  accentMap: Record<FloorType, string>;
}

export const FLOOR_CONFIG: FloorConfig = {
  width: 280,
  height: 60,
  colorMap: {
    normal: '#e2e8f0', // slate-200
    golden: '#fcd34d', // amber-300
    glass: '#bae6fd', // sky-200
  },
  accentMap: {
    normal: '#94a3b8', // slate-400
    golden: '#d97706', // amber-600
    glass: '#38bdf8', // sky-400
  }
};
