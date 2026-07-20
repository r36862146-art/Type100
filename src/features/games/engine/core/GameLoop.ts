import { Time } from "./Time";

export class GameLoop {
  private time: Time;
  private animationFrameId: number = 0;
  private isRunning: boolean = false;
  
  private updateCallback: (deltaTime: number) => void;
  private renderCallback: () => void;

  constructor(updateCallback: (deltaTime: number) => void, renderCallback: () => void) {
    this.time = new Time();
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.time.reset();
    this.loop(performance.now());
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private loop = (timestamp: number) => {
    if (!this.isRunning) return;

    this.time.update(timestamp);
    
    // Clamp delta time to 50ms (20fps equivalent minimum) to prevent physics explosions 
    // when tab is inactive or browser hangs
    const clampedDt = Math.min(this.time.deltaTime, 50);

    // Physics & Game Logic Update
    this.updateCallback(clampedDt);
    
    // Visual Render
    this.renderCallback();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
