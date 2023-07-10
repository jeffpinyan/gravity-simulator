export class Vector2 {
    x = 0;
    y = 0;

    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    copy () {
        return new Vector2 (this.x, this.y);
    }

    toString () {
        return `(${this.x}, ${this.y})`;
    }

    add (v) {
        return new Vector2 (this.x + v.x, this.y + v.y);
    }

    negate () {
        return new Vector2 (-this.x, -this.y);
    }

    subtract (v) {
        return this.add(v.negate());
    }

    dot (v) {
        return this.x * v.x + this.y * v.y;
    }

    magnitude () {
        return Math.sqrt(this.dot(this));
    }

    scale (scale) {
        return new Vector2 (this.x * scale, this.y * scale);
    }

    divide (scale) {
        return this.multiply(scale && 1/scale);
    }

    normalize () {
        return this.divide(this.magnitude());
    }

    angleBetween (v) {
        return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
    }
};