import { Entity } from "../../engine/entities/Entity";
import { ThemeConfig } from "../config/themeConfig";

export class FallingWord extends Entity {
  public text: string;
  public typedIndex: number = 0;
  public fallSpeed: number;
  public isTargeted: boolean = false;
  private theme: ThemeConfig;
  private cardWidth: number = 0;
  private scale: number = 0; // For spawn animation

  constructor(x: string | number, y: string | number, text: string, fallSpeed: number, theme: ThemeConfig) {
    super(typeof x === 'number' ? x : 0, typeof y === 'number' ? y : 0, 0, 40); // Initial dimensions
    this.text = text;
    this.fallSpeed = fallSpeed;
    this.theme = theme;
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);
    
    // Spawn animation
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + deltaTime / 200);
    }

    // Fall downwards
    this.y += this.fallSpeed * (deltaTime / 1000);
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.scale < 1) {
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.scale;
    }

    // Prepare font to measure text width
    ctx.font = "bold 20px monospace";
    if (this.cardWidth === 0) {
      this.cardWidth = ctx.measureText(this.text).width + 30; // Add padding
      this.width = this.cardWidth;
    }

    // Draw Card Background
    ctx.fillStyle = this.theme.wordCardColor;
    if (this.isTargeted) {
      ctx.shadowColor = this.theme.typedTextColor;
      ctx.shadowBlur = 15;
    } else {
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
    }
    
    ctx.beginPath();
    ctx.roundRect(-this.cardWidth / 2, -this.height / 2, this.cardWidth, this.height, 8);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowBlur = 0;

    // Draw Text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Split text into typed and untyped parts
    const typedText = this.text.substring(0, this.typedIndex);
    const untypedText = this.text.substring(this.typedIndex);

    const typedWidth = ctx.measureText(typedText).width;
    const totalWidth = ctx.measureText(this.text).width;
    
    // Starting X position for left-aligned text within the centered card
    const startX = -totalWidth / 2;

    // Draw Typed Text
    ctx.fillStyle = this.theme.typedTextColor;
    ctx.fillText(typedText, startX + typedWidth / 2, 2); // +2 for visual centering with lowercase letters

    // Draw Untyped Text
    ctx.fillStyle = this.theme.wordTextColor;
    ctx.fillText(untypedText, startX + typedWidth + ctx.measureText(untypedText).width / 2, 2);

    ctx.restore();
  }
}
