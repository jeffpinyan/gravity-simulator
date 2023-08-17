import { MouseEvent, WheelEvent } from "react";
import { Vector2 } from "./classes/Vector/Vector2";

const pointCache = new Map<SVGSVGElement, SVGPoint>();

export const mouseToSvg = (
  svg: SVGSVGElement,
  event: MouseEvent | WheelEvent
) => {
  if (!pointCache.has(svg)) {
    console.warn(`creating new SVGPoint for`);
    pointCache.set(svg, svg.createSVGPoint());
  }
  const pt = pointCache.get(svg)!;
  pt.x = event.clientX;
  pt.y = event.clientY;
  const { x, y } = pt.matrixTransform(svg.getScreenCTM()!.inverse());
  return new Vector2(x, y);
};
