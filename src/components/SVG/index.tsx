import React, { LegacyRef, PropsWithChildren } from "react";
import { Vector2 } from "../../classes/Vector/Vector2";

type num2 = Vector2;

const x0y0: num2 = new Vector2(0, 0);

type xyProp = {
  xy: num2;
};

type sizeProp = {
  size: num2;
};

type fromProp = {
  start: num2;
};

type toProp = {
  finish: num2;
};

type rProp = {
  r: number;
};

type rxProp = {
  rx: number;
};

type hrefProp = {
  href: string;
};

export function SVG({
  children,
  width = "100%",
  height = "100%",
  forwardRef,
  ...props
}: React.SVGProps<SVGSVGElement> & { forwardRef: LegacyRef<SVGSVGElement> }) {
  return (
    <svg
      ref={forwardRef}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      {...props}
    >
      {children}
    </svg>
  );
}

export function Defs({ children, ...props }: React.SVGProps<SVGDefsElement> & PropsWithChildren) {
  return <defs {...props}>{children}</defs>;
}

export function G({ children, ...props }: React.SVGProps<SVGGElement> & PropsWithChildren) {
  return <g {...props}>{children}</g>;
}

export function Use({ href, xy = x0y0, ...props }: React.SVGProps<SVGUseElement> & xyProp & hrefProp) {
  return <use href={href} x={xy.x} y={xy.y} {...props} />;
}

export function Pattern({ xy = x0y0, size, children, ...props }: React.SVGProps<SVGPatternElement> & xyProp & sizeProp) {
  return (
    <pattern x={xy.x} y={xy.y} width={size.x} height={size.y} {...props}>
      {children}
    </pattern>
  );
}

export function Line({ start, finish, ...props }: React.SVGProps<SVGLineElement> & fromProp & toProp) {
  return <line x1={start.x} y1={start.y} x2={finish.x} y2={finish.y} {...props} />;
}

export function Polyline({ ...props }: React.SVGProps<SVGPolylineElement>) {
  return <polyline {...props} />;
}

export function Polygon({ ...props }: React.SVGProps<SVGPolygonElement>) {
  return <polygon {...props} />;
}

type RectProps = PropsWithChildren & xyProp & sizeProp & rProp & rxProp;

export function Rect({ xy = x0y0, size, r, ...props }: RectProps) {
  if (r) {
    props.rx = r;
  }
  return (
    <rect x={xy.x} y={xy.y} width={size.x} height={size.y} {...props} />
  );
}

export function Circle({ xy = x0y0, r, ...props }: React.SVGProps<SVGCircleElement> & xyProp & rProp) {
  return <circle cx={xy.x} cy={xy.y} r={r} {...props} />;
}

export function Mask({ children, ...props }: React.SVGProps<SVGMaskElement>) {
  return <mask {...props}>{children}</mask>;
}

export function Path({ ...props }: React.SVGProps<SVGPathElement>) {
  return <path {...props} />;
}

export function ClipPath({ children, ...props }: React.SVGProps<SVGClipPathElement>) {
  return <clipPath {...props}>{children}</clipPath>;
}

export function Text({ xy = x0y0, children, ...props }: React.SVGProps<SVGTextElement> & xyProp) {
  return (
    <text x={xy.x} y={xy.y} {...props}>
      {children}
    </text>
  );
}
