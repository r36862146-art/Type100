import { Entity } from "../../engine/entities/Entity";

export class Laser extends Entity {
  public targetId: string;
  private glowColor: string = "#22d3ee"; // cyan-400
  
  constructor(x: number, y: number, targetX: number, targetY: number, targetId: string) {
    super(x, y, 4, 20);
    this.targetId = targetId;
    
    // Calculate velocity towards target
    const dx = targetX - x;
    const dy = targetY - y;
    const angle = Math.atan2(dy, dx);
    const speed = 1.5; // Very fast
    
    this.velocityX = Math.cos(angle) * speed;
    this.velocityY = Math.sin(angle) * speed;
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    
    // Rotate laser to face velocity direction
    const angle = Math.atan2(this.velocityY, this.velocityX);
    ctx.translate(this.x, this.y);
    ctx.rotate(angle);
    
    // Draw Laser (Neon style)
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffffff";
    
    ctx.beginPath();
    ctx.roundRect(-this.height/2, -this.width/2, this.height, this.width, 2);
    ctx.fill();
    
    // Inner core
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-this.height/2 + 2, -this.width/2 + 1, this.height - 4, this.width - 2, 1);
    ctx.fill();

    ctx.restore();
  }
}
