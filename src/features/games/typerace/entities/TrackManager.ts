import { Entity } from "../../engine/entities/Entity";
import { TrackConfig } from "../config/trackConfig";

export class TrackManager extends Entity {
  private config: TrackConfig;
  private scrollOffset: number = 0;
  
  constructor(config: TrackConfig) {
    super(0, 0, 0, 0); // Dimensions not strictly used
    this.config = config;
  }

  public setScrollSpeed(speed: number, deltaTime: number) {
    // Scroll visually based on player speed
    // Speed units are abstract, so scale it to look good on screen
    this.scrollOffset += (speed * deltaTime * 1.5);
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Background Shoulder
    ctx.fillStyle = this.config.shoulderColor;
    ctx.fillRect(0, 0, width, height);

    // Main Road (Centered)
    const roadWidth = width * 0.6;
    const roadX = (width - roadWidth) / 2;
    
    ctx.fillStyle = this.config.roadColor;
    ctx.fillRect(roadX, 0, roadWidth, height);

    // Track Borders
    ctx.strokeStyle = this.config.markingColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(roadX, 0);
    ctx.lineTo(roadX, height);
    ctx.moveTo(roadX + roadWidth, 0);
    ctx.lineTo(roadX + roadWidth, height);
    ctx.stroke();

    // Dashed Lane Markings (assuming 3 lanes for now)
    const laneWidth = roadWidth / 3;
    const dashHeight = 40;
    const gapHeight = 40;
    const loopSize = dashHeight + gapHeight;
    
    const offset = this.scrollOffset % loopSize;
    
    ctx.fillStyle = this.config.markingColor;
    
    for (let lane = 1; lane < 3; lane++) {
      const lineX = roadX + lane * laneWidth;
      
      // Draw lines starting from above screen down to bottom
      for (let y = -loopSize; y < height + loopSize; y += loopSize) {
        ctx.fillRect(lineX - 2, y + offset, 4, dashHeight);
      }
    }
  }
}
