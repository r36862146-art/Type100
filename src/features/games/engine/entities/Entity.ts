export abstract class Entity {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public velocityX: number;
  public velocityY: number;
  public alive: boolean;
  public visible: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.id = Math.random().toString(36).substring(2, 9);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.alive = true;
    this.visible = true;
  }

  public update(deltaTime: number): void {
    if (!this.alive) return;
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  public abstract render(ctx: CanvasRenderingContext2D): void;
  
  public destroy(): void {
    this.alive = false;
  }
}
