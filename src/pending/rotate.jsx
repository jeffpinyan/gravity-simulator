import { SEC_PER_YEAR, SEC_PER_DAY } from "./initialize";

export const rotate = (x, y, l, time) => {
  const dayOfYear = Math.floor((time % SEC_PER_YEAR) / SEC_PER_DAY);
  const r = time % SEC_PER_DAY;
  const t = r / SEC_PER_DAY;
  const theta = 360 * t + (360 * (dayOfYear % DAYS_PER_YEAR)) / DAYS_PER_YEAR;

  let fx = Math.cos((180 + theta) * (Math.PI / 180));
  let fy = -Math.sin(theta * (Math.PI / 180));
  // console.log({ dayOfYear, theta, fx, fy })
  return [x + l * fx, y + l * fy];
};
