import { LegacyRef, PropsWithChildren, ReactNode } from "react";

type num2 = [number, number];

const x0y0: num2 = [0, 0];

type xyProp = {
  xy: num2;
};

type sizeProp = {
  size: num2;
};

type fromProp = {
  from: num2;
};

type toProp = {
  to: num2;
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

type SVGProps = {
  width: string;
  height: string;
  forwardRef: LegacyRef<SVGSVGElement>;
  [key: string]: any;
};

export function SVG({
  children,
  width = "100%",
  height = "100%",
  forwardRef,
  ...props
}: SVGProps & PropsWithChildren) {
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

export function Defs({ children, ...props }: PropsWithChildren) {
  return <defs {...props}>{children}</defs>;
}

export function G({ children, ...props }: PropsWithChildren) {
  return <g {...props}>{children}</g>;
}

type UseProps = PropsWithChildren & xyProp & hrefProp;

export function Use({ href, xy = x0y0, ...props }: UseProps) {
  return <use href={href} x={xy[0]} y={xy[1]} {...props} />;
}

type PatternProps = PropsWithChildren & xyProp & sizeProp;

export function Pattern({ xy = x0y0, size, children, ...props }: PatternProps) {
  return (
    <pattern x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props}>
      {children}
    </pattern>
  );
}

type LineProps = PropsWithChildren & fromProp & toProp;

export function Line({ from = x0y0, to, ...props }: LineProps) {
  return <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} {...props} />;
}

export function Polyline({ ...props }: PropsWithChildren) {
  return <polyline {...props} />;
}

export function Polygon({ ...props }: PropsWithChildren) {
  return <polygon {...props} />;
}

type RectProps = PropsWithChildren & xyProp & sizeProp & rProp & rxProp;

export function Rect({ xy = x0y0, size, r, ...props }: RectProps) {
  if (r) {
    props.rx = r;
  }
  return (
    <rect x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props} />
  );
}

type CircleProps = PropsWithChildren & xyProp & rProp;

export function Circle({ xy = x0y0, r, ...props }: CircleProps) {
  return <circle cx={xy[0]} cy={xy[1]} r={r} {...props} />;
}

export function Mask({ children, ...props }: PropsWithChildren) {
  return <mask {...props}>{children}</mask>;
}

export function Path({ ...props }: PropsWithChildren) {
  return <path {...props} />;
}

export function ClipPath({ children, ...props }: PropsWithChildren) {
  return <clipPath {...props}>{children}</clipPath>;
}

type TextProps = PropsWithChildren & xyProp;

export function Text({ xy = x0y0, children, ...props }: TextProps) {
  return (
    <text x={xy[0]} y={xy[1]} {...props}>
      {children}
    </text>
  );
}
