export type GameState = "LOADING" | "READY" | "PLAYING" | "PAUSED" | "COMPLETED" | "GAME_OVER";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Vector2, Size {}
