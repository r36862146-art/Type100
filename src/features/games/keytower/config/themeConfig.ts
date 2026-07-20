export interface BackgroundMilestone {
  floor: number;
  topColor: string;
  bottomColor: string;
}

export const BACKGROUND_MILESTONES: BackgroundMilestone[] = [
  { floor: 0, topColor: '#7dd3fc', bottomColor: '#bbf7d0' },     // Sky & Grass
  { floor: 20, topColor: '#38bdf8', bottomColor: '#7dd3fc' },    // High Sky
  { floor: 50, topColor: '#0ea5e9', bottomColor: '#38bdf8' },    // Stratosphere
  { floor: 100, topColor: '#312e81', bottomColor: '#0ea5e9' },   // Sunset/Twilight
  { floor: 150, topColor: '#1e1b4b', bottomColor: '#312e81' },   // Night Sky
  { floor: 200, topColor: '#020617', bottomColor: '#1e1b4b' },   // Deep Space
];

export function getBackgroundColors(floor: number) {
  let lower = BACKGROUND_MILESTONES[0];
  let upper = BACKGROUND_MILESTONES[BACKGROUND_MILESTONES.length - 1];

  for (let i = 0; i < BACKGROUND_MILESTONES.length - 1; i++) {
    if (floor >= BACKGROUND_MILESTONES[i].floor && floor < BACKGROUND_MILESTONES[i+1].floor) {
      lower = BACKGROUND_MILESTONES[i];
      upper = BACKGROUND_MILESTONES[i+1];
      break;
    }
  }
  
  if (floor >= upper.floor) {
    return { top: upper.topColor, bottom: upper.bottomColor, progress: 1 };
  }

  const range = upper.floor - lower.floor;
  const progress = (floor - lower.floor) / range;
  
  return { top: upper.topColor, bottom: lower.topColor, progress }; // Mix lower top and upper top to simulate climbing
}
