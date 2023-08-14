import { Vector2 } from "../Vector/Vector2";

export class Body {
  mass: number;
  radius: number;
  position: Vector2;

  constructor(mass: number, radius: number, position: Vector2) {
    this.mass = mass;
    this.radius = radius;
    this.position = position;
  }
}
