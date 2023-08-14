import { EARTH } from "./lib/jxphysics/solar-system";

const _minMagCache = new Map();

export const minMag = (a, b) => {
  const cache = _minMagCache;
  const m = (a.p.subtract(b.p).magnitude() * SCALE) / EARTH.Distance.SUN.Mean;
  if (!cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) > m)
    cache.set(`${a.name}:${b.name}`, m);
  return cache.get(`${a.name}:${b.name}`);
};
