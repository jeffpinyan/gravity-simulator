export class Vector2 {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  negate() {
    return new Vector2(-this.x, -this.y);
  }

  subtract(v: Vector2) {
    return this.add(v.negate());
  }

  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y;
  }

  get magnitude() {
    return Math.sqrt(this.dot(this));
  }

  scale(scale: number) {
    return new Vector2(this.x * scale, this.y * scale);
  }

  divide(scale: number) {
    return this.scale(scale && 1 / scale);
  }

  get normalize() {
    return this.divide(this.magnitude);
  }

  angleBetween(v: Vector2) {
    return Math.acos(this.dot(v) / (this.magnitude * v.magnitude));
  }
}
