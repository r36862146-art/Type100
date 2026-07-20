import { Entity } from "../../engine/entities/Entity";
import { FloorConfig, FloorType } from "../config/floorConfig";

export class TowerFloor extends Entity {
  public type: FloorType;
  public cracked: boolean;
  public targetY: number; // The y coordinate it should drop to
  public isPlaced: boolean = false;
  private config: FloorConfig;
  private dropSpeed: number = 500; // pixels per second

  constructor(x: number, startY: number, targetY: number, type: FloorType, cracked: boolean, config: FloorConfig) {
    super(x, startY, config.width, config.height);
    this.targetY = targetY;
    this.type = type;
    this.cracked = cracked;
    this.config = config;
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    
    if (!this.isPlaced) {
      this.y += this.dropSpeed * (deltaTime / 1000);
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.isPlaced = true;
      }
    }
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    const mainColor = this.config.colorMap[this.type];
    const accentColor = this.config.accentMap[this.type];

    // Main Block
    ctx.fillStyle = mainColor;
    if (this.type === 'golden') {
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 5;
    }

    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 4);
    ctx.fill();

    // Reset shadow for details
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Windows / Accents
    ctx.fillStyle = accentColor;
    const windowCount = 5;
    const windowWidth = 20;
    const windowHeight = 25;
    const spacing = (this.width - (windowCount * windowWidth)) / (windowCount + 1);

    for (let i = 0; i < windowCount; i++) {
      const wx = -this.width / 2 + spacing + (i * (windowWidth + spacing));
      ctx.fillRect(wx, -10, windowWidth, windowHeight);
    }

    // Cracks (if cracked)
    if (this.cracked) {
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-this.width * 0.3, -this.height * 0.4);
      ctx.lineTo(-this.width * 0.2, 0);
      ctx.lineTo(-this.width * 0.25, this.height * 0.3);
      
      ctx.moveTo(this.width * 0.1, -this.height * 0.2);
      ctx.lineTo(this.width * 0.3, this.height * 0.4);
      ctx.stroke();
    }

    ctx.restore();
  }
}
