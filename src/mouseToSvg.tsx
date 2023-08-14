import { MutableRefObject } from "react";
import { Vector2 } from "./classes/Vector/Vector2";

const pointCache = new Map<SVGSVGElement, SVGPoint>();

export const mouseToSvg = (
  svg: MutableRefObject<SVGSVGElement>,
  event: MouseEvent
) => {
  if (!pointCache.has(svg.current)) {
    console.warn(`creating new SVGPoint for`);
    pointCache.set(svg.current, svg.current.createSVGPoint());
  }
  const pt = pointCache.get(svg.current)!;
  pt.x = event.clientX;
  pt.y = event.clientY;
  const { x, y } = pt.matrixTransform(svg.current.getScreenCTM()!.inverse());
  return new Vector2(x, y);
};
