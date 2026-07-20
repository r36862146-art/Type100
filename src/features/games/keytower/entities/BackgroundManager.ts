import { Entity } from "../../engine/entities/Entity";
import { getBackgroundColors } from "../config/themeConfig";

export class BackgroundManager extends Entity {
  public currentFloor: number = 0;

  constructor() {
    super(0, 0, 0, 0); // Fills screen
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    const colors = getBackgroundColors(this.currentFloor);

    // We create a vertical gradient
    // bottomColor is at the bottom of the screen, topColor is at the top
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    // To make it smooth, we mix based on the progress
    // If progress is 0, we just show lower milestone colors
    // As progress goes to 1, it shifts.
    
    gradient.addColorStop(0, colors.top);
    gradient.addColorStop(1, colors.bottom);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Render simple stars if we are high up
    if (this.currentFloor > 100) {
      const starOpacity = Math.min(1, (this.currentFloor - 100) / 50);
      ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
      
      // Static "stars" based on screen coordinates (pseudo-random but stable for current frame)
      // For a real game we'd want them to scroll, but static is fine for a minimal backdrop.
      for (let i = 0; i < 50; i++) {
        const sx = (Math.sin(i * 123.45) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 678.90) * 0.5 + 0.5) * height;
        ctx.fillRect(sx, sy, 2, 2);
      }
    }
  }
}
