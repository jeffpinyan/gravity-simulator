import { angSize } from "./angSize";

const _maxAngSizeCache = new Map();
export const maxAngSize = (a, b) => {
  const cache = _maxAngSizeCache;
  const m = angSize(a, b);
  if (!cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) < m)
    cache.set(`${a.name}:${b.name}`, m);
  return cache.get(`${a.name}:${b.name}`);
};
