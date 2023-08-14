export const angSize = (a, b) => {
  const size = b.s;
  const dist = a.p.subtract(b.p).magnitude();
  return Math.round((1000 * Math.atan(size / dist) * 180) / Math.PI) / 1000;
};
