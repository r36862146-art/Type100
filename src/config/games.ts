import { 
  Rocket, 
  Car, 
  Blocks, 
  Castle,
} from "lucide-react";

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon
  difficulty: string;
  playTime: string;
  enabled: boolean;
  color: string;
  iconColor: string;
}

export const GAMES_CONFIG: GameConfig[] = [
  {
    id: "spacetype",
    title: "SpaceType",
    description: "Classic space shooter. Destroy descending enemy ships by typing the displayed words before they reach you.",
    icon: Rocket,
    difficulty: "Medium",
    playTime: "2-5 mins",
    enabled: false,
    color: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-500",
  },
  {
    id: "typerace",
    title: "Type Race",
    description: "Race against scripted computer opponents. Maintain high WPM and accuracy to keep your car at top speed.",
    icon: Car,
    difficulty: "Hard",
    playTime: "1-3 mins",
    enabled: true,
    color: "from-red-500/20 to-orange-500/20",
    iconColor: "text-red-500",
  },
  {
    id: "wordtetris",
    title: "Word Tetris",
    description: "Blocks are falling words. Type them correctly to clear the board and build massive combos.",
    icon: Blocks,
    difficulty: "Hard",
    playTime: "Endless",
    enabled: false,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-500",
  },
  {
    id: "keytower",
    title: "KeyTower",
    description: "Build the tallest tower through accurate typing. Each mistake weakens the structural integrity.",
    icon: Castle,
    difficulty: "Easy",
    playTime: "3-5 mins",
    enabled: true,
    color: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-500",
  },
];
