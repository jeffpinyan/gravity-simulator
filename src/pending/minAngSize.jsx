import { angSize } from "./angSize";

const _minAngSizeCache = new Map();
export const minAngSize = (a, b) => {
  const cache = _minAngSizeCache;
  const m = angSize(a, b);
  if (!cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) > m)
    cache.set(`${a.name}:${b.name}`, m);
  return cache.get(`${a.name}:${b.name}`);
};
