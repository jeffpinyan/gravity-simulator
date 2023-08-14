import { Body } from "./classes/Body";
import { NV } from "./initialize";

export function barycenter (bodies: Body[]) {
  const totalMass = bodies.reduce((total, { mass }) => total + mass, 0);
  return bodies.reduce((pos, { mass, position }) => pos.add(position.scale(mass / totalMass)), NV);
};
