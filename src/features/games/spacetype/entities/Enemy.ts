import { Entity } from "../../engine/entities/Entity";
import { ENEMY_CONFIGS, EnemyType, EnemyConfig } from "../config/enemyConfig";

export class Enemy extends Entity {
  public word: string;
  public typed: string = "";
  public type: EnemyType;
  public config: EnemyConfig;
  public isTargeted: boolean = false;
  
  public maxHealth: number;
  public currentHealth: number;

  private pulsePhase: number = 0;

  constructor(x: number, y: number, word: string, speedMultiplier: number, type: EnemyType = "scout") {
    super(x, y, 60, 40);
    this.word = word;
    this.type = type;
    this.config = ENEMY_CONFIGS[type];
    
    // Set velocity based on config and wave multiplier
    this.velocityY = this.config.baseSpeed * speedMultiplier;
    
    // Health corresponds to word length
    this.maxHealth = word.length;
    this.currentHealth = word.length;

    // Set dimensions based on radius
    this.width = this.config.radius * 2;
    this.height = this.config.radius * 2;
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    this.pulsePhase += deltaTime * 0.005;
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    
    // Calculate dynamic width based on word length
    ctx.font = this.config.isBoss ? "bold 24px monospace" : "bold 16px monospace";
    const textWidth = ctx.measureText(this.word).width;
    const boxWidth = Math.max(this.width, textWidth + 30);
    const boxHeight = this.config.isBoss ? 80 : 40;
    
    // Dim if not targeted, but only if something else is targeted
    ctx.globalAlpha = 1.0;

    // Draw Glow if targeted
    if (this.isTargeted) {
      ctx.shadowColor = this.config.color;
      ctx.shadowBlur = 20 + Math.sin(this.pulsePhase) * 10;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
    } else {
      ctx.shadowBlur = 0;
      ctx.strokeStyle = this.config.color;
      ctx.lineWidth = 2;
      
      // If we are a normal enemy, we could be slightly dimmed if something else is targeted
      // We'll leave globalAlpha handling to the game loop or render it fully.
    }

    // Ship Body
    ctx.fillStyle = "rgba(15, 15, 20, 0.9)";
    ctx.beginPath();
    
    if (this.config.isBoss) {
       // Hexagon for boss
       const a = boxWidth/2;
       const b = boxHeight/2;
       ctx.moveTo(this.x, this.y - b);
       ctx.lineTo(this.x + a, this.y - b/2);
       ctx.lineTo(this.x + a, this.y + b/2);
       ctx.lineTo(this.x, this.y + b);
       ctx.lineTo(this.x - a, this.y + b/2);
       ctx.lineTo(this.x - a, this.y - b/2);
       ctx.closePath();
    } else {
       // Rounded pill shape
       ctx.roundRect(this.x - boxWidth/2, this.y - boxHeight/2, boxWidth, boxHeight, 12);
    }
    
    ctx.fill();
    ctx.stroke();

    // Shield visuals
    if (this.config.hasShield && this.typed.length === 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, boxWidth/2 + 10, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(45, 212, 191, 0.5)"; // teal
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Word Text Rendering
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    
    const startX = this.x - textWidth/2;
    
    // Draw untyped portion
    ctx.fillStyle = "#64748b"; // slate-500
    ctx.fillText(this.word, startX, this.y);
    
    // Draw typed portion
    if (this.typed.length > 0) {
      ctx.fillStyle = "#4ade80"; // green-400
      ctx.shadowColor = "rgba(74, 222, 128, 0.8)";
      ctx.shadowBlur = 10;
      ctx.fillText(this.typed, startX, this.y);
      ctx.shadowBlur = 0; // reset
    }

    ctx.restore();
  }
}
