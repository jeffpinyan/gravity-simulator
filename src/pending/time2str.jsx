import { SEC_PER_YEAR, SEC_PER_DAY } from "./initialize";

/*
  const ratio = grid.viewBox[2] > grid.viewBox[3] ? (grid.viewBox[2] / config.width) : (grid.viewBox[3] / config.height);
  const xRatio = (x) => x * ratio + grid.viewBox[0];
  const yRatio = (y) => y * ratio + grid.viewBox[1];
 
  grid.xyToGridXY = ({x, y}) => {
    return (x !== null && y !== null) ? [ grid.xRatio(x), grid.yRatio(y) ] : [ null, null ];
  }
*/
export const time2str = (seconds) => {
  let time = seconds;
  const yr = Math.floor(time / SEC_PER_YEAR);
  time -= yr * SEC_PER_YEAR;
  const days = Math.floor(time / SEC_PER_DAY);
  time -= days * SEC_PER_DAY;
  const hr = Math.floor(time / 3600);
  time -= hr * 3600;
  const min = Math.floor(time / 60);
  time -= min * 60;
  const sec = parseInt(time);

  return `${yr} years, ${days} days, ${hr}:${min}:${sec}`.replace(
    /(?<=(?:days |:))(\d)(?!\d)/g,
    "0$1"
  );
};
