import { Car } from "./Car";
import { AICarProfile } from "../config/carConfig";

export class AICar extends Car {
  public profile: AICarProfile;
  private timeSinceLastAction: number = 0;
  private currentTargetSpeed: number = 0;

  constructor(lane: number, profile: AICarProfile) {
    super(lane, profile.color);
    this.profile = profile;
    this.currentTargetSpeed = profile.baseSpeed;
    this.speed = 0;
  }

  public override update(deltaTime: number): void {
    this.timeSinceLastAction += deltaTime;

    // Simulate typing events
    if (this.timeSinceLastAction > 1000) {
      this.timeSinceLastAction = 0;
      
      const rand = Math.random();
      if (rand < this.profile.mistakeRate) {
        // AI made a mistake, slow down heavily
        this.currentTargetSpeed = this.profile.baseSpeed * 0.3;
      } else {
        // AI is typing correctly
        const consistencyBonus = this.profile.consistency * 0.2;
        this.currentTargetSpeed = this.profile.baseSpeed + consistencyBonus;
      }

      // Random nitro logic (if they have high boost probability and they are typing well)
      if (rand < this.profile.boostProbability * 0.05) {
        this.isNitroActive = true;
        this.nitroAmount = 2000; // 2 seconds of nitro
      }
    }

    if (this.isNitroActive) {
      this.nitroAmount -= deltaTime;
      if (this.nitroAmount <= 0) {
        this.isNitroActive = false;
      }
    }

    // Smoothly accelerate or decelerate to target speed
    const actualTargetSpeed = this.isNitroActive ? this.currentTargetSpeed * 1.5 : this.currentTargetSpeed;
    this.speed += (actualTargetSpeed - this.speed) * 0.05;

    super.update(deltaTime);
  }
}
