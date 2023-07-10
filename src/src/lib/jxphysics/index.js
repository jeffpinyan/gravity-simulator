export * as SolarSystem from './solar-system';

// units m * m * m / kg / s / s
export const G = 6.674e-11;

export const accelerationDueToGravity = (m, r) => G * m / (r * r);

export const forceOfGravity = (m1, m2, r) => m2 * accelerationDueToGravity(m1, r);
export class Body {
    constructor (m, r, [x, y]) {
        this.m = m;
        this.r = r;
        [this.x, this.y] = [x, y];
    }
};