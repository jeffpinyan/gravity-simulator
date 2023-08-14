import { NV } from "./initialize";
import { barycenter } from "./barycenter";

export const calculateBodies = (bodies, config, setConfig) => {
  const t = config.stepTime;

  for (let iters = 0; iters < config.stepIter; iters++) {
    bodies = bodies.map((b) => ({
      ...b,
      p: b.p.copy(),
      v: b.v.copy(),
      t: b.t.length === 0 ? [b.p] : b.t.slice(-1000),
      a: NV,
      ra: [],
    }));

    // determine accelerations
    for (let i = 0; i < bodies.length; i++) {
      const M1 = bodies[i];
      for (let j = i + 1; j < bodies.length; j++) {
        const m2 = bodies[j];

        const d = m2.p.subtract(M1.p);
        const r = d.magnitude();
        const A1 = (G * m2.m) / Math.pow(r, 2);
        const a2 = (G * M1.m) / Math.pow(r, 2);

        M1.ra[j] = d.scale(A1 / r);
        M1.a = M1.a.add(M1.ra[j]);

        m2.ra[i] = d.scale(a2 / r);
        m2.a = m2.a.subtract(m2.ra[i]);
      }
    }

    // update velocities and positions
    bodies.forEach((b) => {
      b.v = b.v.add(b.a.scale(t));
      b.p = b.p.add(b.v.scale(t));
    });

    // adjust positions based on fixed point
    const fixed = config.fixed
      ? bodies[config.fixed - 1]
      : { p: barycenter(bodies) };
    if (config.fixed >= 0) {
      bodies
        .filter((b) => b !== fixed)
        .forEach((b) => (b.p = b.p.subtract(fixed.p)));
      fixed.p = NV;
    }
  }

  const fixed = config.fixed && bodies[config.fixed - 1];
  bodies.filter((b) => b !== fixed).forEach((b) => b.t.push(b.p));

  setConfig((config) => ({
    ...config,
    elapsed: config.elapsed + config.stepIter * t,
    iterations: config.iterations + 1,
  }));

  if (config.focus > 0) {
    setConfig((config) => ({ ...config, center: bodies[config.focus - 1].p }));
  } else if (config.focus === 0) {
    setConfig((config) => ({ ...config, center: barycenter(bodies) }));
  }

  return bodies;
};
