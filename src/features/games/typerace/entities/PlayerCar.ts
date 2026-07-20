import { Car } from "./Car";
import { PLAYER_CAR_CONFIG } from "../config/carConfig";

export class PlayerCar extends Car {
  public nitroMeter: number = 0;
  
  constructor() {
    super(0, PLAYER_CAR_CONFIG.color); // Player typically stays in center lane (0)
  }

  public override update(deltaTime: number): void {
    super.update(deltaTime);

    if (this.isNitroActive) {
      this.nitroMeter -= PLAYER_CAR_CONFIG.nitroDepleteRate * (deltaTime / 1000);
      if (this.nitroMeter <= 0) {
        this.nitroMeter = 0;
        this.isNitroActive = false;
      }
    }
  }

  public activateNitro() {
    if (this.nitroMeter >= 100) {
      this.isNitroActive = true;
    }
  }

  public addNitro(amount: number) {
    if (!this.isNitroActive) {
      this.nitroMeter = Math.min(100, this.nitroMeter + amount);
    }
  }
}
