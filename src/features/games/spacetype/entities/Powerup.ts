import { Entity } from "../../engine/entities/Entity";
import { POWERUP_CONFIGS, PowerupType, PowerupConfig } from "../config/powerupConfig";

export class Powerup extends Entity {
  public type: PowerupType;
  public config: PowerupConfig;
  public word: string; // The character or word to type to collect it
  public typed: string = "";
  public isTargeted: boolean = false;
  
  private pulsePhase: number = 0;

  constructor(x: number, y: number, type: PowerupType, word: string) {
    super(x, y, 30, 30);
    this.type = type;
    this.config = POWERUP_CONFIGS[type];
    this.word = word;
    this.velocityY = 0.05; // Fall slowly
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    this.pulsePhase += deltaTime * 0.005;
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    
    // Pulse effect
    const scale = 1 + Math.sin(this.pulsePhase) * 0.1;
    
    // Draw Box
    ctx.translate(this.x, this.y);
    ctx.scale(scale, scale);
    
    ctx.shadowColor = this.config.color;
    ctx.shadowBlur = this.isTargeted ? 20 : 10;
    
    ctx.fillStyle = "rgba(15, 15, 20, 0.9)";
    ctx.strokeStyle = this.isTargeted ? "#ffffff" : this.config.color;
    ctx.lineWidth = this.isTargeted ? 3 : 2;
    
    // Diamond shape
    ctx.beginPath();
    ctx.moveTo(0, -this.height/2);
    ctx.lineTo(this.width/2, 0);
    ctx.lineTo(0, this.height/2);
    ctx.lineTo(-this.width/2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Render Symbol
    ctx.shadowBlur = 0;
    ctx.fillStyle = this.config.color;
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.config.symbol, 0, -4);
    
    // Render Word underneath
    ctx.font = "bold 12px monospace";
    ctx.fillStyle = "#64748b";
    
    // Word untyped
    const startX = -ctx.measureText(this.word).width / 2;
    ctx.textAlign = "left";
    ctx.fillText(this.word, startX, this.height/2 + 10);
    
    // Word typed
    if (this.typed.length > 0) {
      ctx.fillStyle = "#4ade80";
      ctx.fillText(this.typed, startX, this.height/2 + 10);
    }
    
    ctx.restore();
  }
}
