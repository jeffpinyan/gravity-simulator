
// these should be defined elsewhere

import { Vector2 } from "./classes/Vector/Vector2";

export const NV = new Vector2(0, 0);
export const NOOP = () => null;
const SCALE = 1;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365.24;

export const SEC_PER_DAY = HOURS_PER_DAY * 3600;
export const SEC_PER_YEAR = HOURS_PER_DAY * 3600 * DAYS_PER_YEAR;

// initialBodies.forEach((b) => {
//   b.m /= Math.pow(SCALE, 2);
//   b.s /= SCALE;
//   b.p = b.p.scale(1 / SCALE);
//   b.v = b.v.scale(1 / Math.sqrt(SCALE));
//   b.t = [];
// });
