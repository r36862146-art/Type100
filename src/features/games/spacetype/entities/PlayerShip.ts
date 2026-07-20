import { Entity } from "../../engine/entities/Entity";
import { PowerupType, POWERUP_CONFIGS } from "../config/powerupConfig";

export class PlayerShip extends Entity {
  private pulsePhase: number = 0;
  private recoilOffset: number = 0;
  
  public activePowerup: PowerupType | null = null;
  
  constructor(x: number, y: number) {
    super(x, y, 60, 40);
  }

  public fireRecoil(): void {
    this.recoilOffset = 10;
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    this.pulsePhase += deltaTime * 0.003;
    
    if (this.recoilOffset > 0) {
      this.recoilOffset = Math.max(0, this.recoilOffset - deltaTime * 0.05);
    }
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    // Apply recoil
    ctx.translate(this.x, this.y + this.recoilOffset);

    // Active Powerup Shield Effect
    if (this.activePowerup === "shield") {
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(this.width, this.height) + 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)"; // blue-500
      ctx.strokeStyle = "rgba(59, 130, 246, 0.8)";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    } else if (this.activePowerup) {
      // General powerup aura
      const config = POWERUP_CONFIGS[this.activePowerup];
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 20;
    }

    // Engine Glow
    const engineGlow = Math.abs(Math.sin(this.pulsePhase));
    ctx.shadowColor = `rgba(56, 189, 248, ${0.5 + engineGlow * 0.5})`; // sky-400
    if (!this.activePowerup) {
      ctx.shadowBlur = 15;
    }
    
    // Draw Engine Jet
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.moveTo(-15, this.height/2);
    ctx.lineTo(0, this.height/2 + 15 + engineGlow * 10);
    ctx.lineTo(15, this.height/2);
    ctx.closePath();
    ctx.fill();

    // Reset shadow for ship body
    ctx.shadowBlur = 0;

    // Main Ship Body (Modern geometric)
    ctx.fillStyle = "#1e293b"; // slate-800
    
    // Outline based on powerup
    if (this.activePowerup) {
      ctx.strokeStyle = POWERUP_CONFIGS[this.activePowerup].color;
    } else {
      ctx.strokeStyle = "#94a3b8"; // slate-400
    }
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, -this.height/2); // Nose
    ctx.lineTo(this.width/2, this.height/2); // Right wing
    ctx.lineTo(0, this.height/2 - 10); // Inner center
    ctx.lineTo(-this.width/2, this.height/2); // Left wing
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cockpit
    ctx.fillStyle = "#38bdf8"; // sky-400
    ctx.beginPath();
    ctx.moveTo(0, -this.height/2 + 10);
    ctx.lineTo(10, 0);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
