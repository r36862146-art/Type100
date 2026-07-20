import { Entity } from "../entities/Entity";
import { Rect, Vector2 } from "../types";

export class Collision {
  public static checkRect(a: Rect, b: Rect): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public static checkEntity(a: Entity, b: Entity): boolean {
    if (!a.alive || !a.visible || !b.alive || !b.visible) return false;
    return this.checkRect(a, b);
  }

  public static checkPointInRect(point: Vector2, rect: Rect): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }
}
