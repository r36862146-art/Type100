import { Entity } from "../../engine/entities/Entity";

export abstract class Car extends Entity {
  public speed: number = 0;
  public lane: number = 0; // -1, 0, 1
  public distanceTraveled: number = 0;
  
  public isNitroActive: boolean = false;
  protected nitroAmount: number = 0;
  protected color: string;

  constructor(lane: number, color: string) {
    super(0, 0, 30, 60); // Car dimensions
    this.lane = lane;
    this.color = color;
  }

  public override update(deltaTime: number): void {
    if (!this.alive) return;
    super.update(deltaTime);
    
    // Update distance based on speed
    // Speed is considered as units per millisecond (approx), so speed * deltaTime gives distance.
    this.distanceTraveled += this.speed * deltaTime;
  }

  public override render(ctx: CanvasRenderingContext2D): void {
    if (!this.alive || !this.visible) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Car Body (Top down flat look)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(-this.width/2, -this.height/2, this.width, this.height, 8);
    ctx.fill();

    // Windshield
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.beginPath();
    ctx.roundRect(-this.width/2 + 4, -this.height/2 + 12, this.width - 8, 12, 4);
    ctx.fill();

    // Rear window
    ctx.beginPath();
    ctx.roundRect(-this.width/2 + 4, this.height/2 - 14, this.width - 8, 8, 2);
    ctx.fill();

    // Nitro Effects
    if (this.isNitroActive) {
      // Blue exhaust flames
      ctx.fillStyle = "#38bdf8"; // sky-400
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;
      
      const flameLength = 20 + Math.random() * 10;
      
      // Left exhaust
      ctx.beginPath();
      ctx.moveTo(-this.width/2 + 6, this.height/2);
      ctx.lineTo(-this.width/2 + 10, this.height/2 + flameLength);
      ctx.lineTo(-this.width/2 + 14, this.height/2);
      ctx.fill();

      // Right exhaust
      ctx.beginPath();
      ctx.moveTo(this.width/2 - 14, this.height/2);
      ctx.lineTo(this.width/2 - 10, this.height/2 + flameLength);
      ctx.lineTo(this.width/2 - 6, this.height/2);
      ctx.fill();
    }

    ctx.restore();
  }
}
