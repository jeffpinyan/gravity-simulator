export * as SolarSystem from './solar-system';

// units m * m * m / kg / s / s
export const G = 6.674e-11;

export const accelerationDueToGravity = (mass: number, distance: number) => G * mass / Math.pow(distance, 2);

export const forceOfGravity = (mass1: number, mass2: number, distance: number) => mass2 * accelerationDueToGravity(mass1, distance);
