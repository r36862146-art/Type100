export class Time {
  private lastTime: number = 0;
  private _deltaTime: number = 0;
  private _elapsedTime: number = 0;

  public update(currentTime: number): void {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    
    // Calculate delta time in seconds
    this._deltaTime = (currentTime - this.lastTime) / 1000;
    
    // Cap delta time to prevent physics explosions on lag spikes or tab switches
    if (this._deltaTime > 0.1) {
      this._deltaTime = 0.1;
    }
    
    this._elapsedTime += this._deltaTime;
    this.lastTime = currentTime;
  }

  public get deltaTime(): number {
    return this._deltaTime;
  }

  public get elapsedTime(): number {
    return this._elapsedTime;
  }

  public reset(): void {
    this.lastTime = 0;
    this._deltaTime = 0;
    this._elapsedTime = 0;
  }
}
