import { LegacyRef, PropsWithChildren, ReactNode } from "react";

const x0y0 = [0, 0];

export const SVG = ({
  children,
  width = "100%",
  height = "100%",
  forwardRef,
  ...props
}: {
  children: ReactNode;
  width: string;
  height: string;
  forwardRef: LegacyRef<SVGSVGElement>;
}) => {
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
};

export const Defs = ({ children, ...props }: PropsWithChildren) => {
  return <defs {...props}>{children}</defs>;
};

export const G = ({ children, ...props }: PropsWithChildren) => {
  return <g {...props}>{children}</g>;
};

export const Use = ({
  href,
  xy = x0y0,
  ...props
}: PropsWithChildren & { href: string; xy: number[] }) => {
  return <use href={href} x={xy[0]} y={xy[1]} {...props} />;
};

export const Pattern = ({
  xy = x0y0,
  size,
  children,
  ...props
}: PropsWithChildren & { xy: number[]; size: number[] }) => {
  return (
    <pattern x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props}>
      {children}
    </pattern>
  );
};

export const Line = ({
  from = x0y0,
  to,
  ...props
}: PropsWithChildren & { from: number[]; to: number[] }) => {
  return <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} {...props} />;
};

export const Polyline = ({ ...props }: PropsWithChildren) => {
  return <polyline {...props} />;
};

export const Polygon = ({ ...props }: PropsWithChildren) => {
  return <polygon {...props} />;
};

export const Rect = ({
  xy = x0y0,
  size,
  ...props
}: PropsWithChildren & { xy: number[]; size: number[]; r?: any; rx?: any }) => {
  if (props.r) {
    props.rx = props.r;
    delete props.r;
  }
  return (
    <rect x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props} />
  );
};

export const Circle = ({
  xy = x0y0,
  r,
  ...props
}: PropsWithChildren & { xy: number[]; r: number }) => {
  return <circle cx={xy[0]} cy={xy[1]} r={r} {...props} />;
};

export const Mask = ({ children, ...props }: PropsWithChildren) => {
  return <mask {...props}>{children}</mask>;
};

export const Path = ({ ...props }: PropsWithChildren) => {
  return <path {...props} />;
};

export const ClipPath = ({ children, ...props }: PropsWithChildren) => {
  return <clipPath {...props}>{children}</clipPath>;
};

export const Text = ({
  xy = x0y0,
  children,
  ...props
}: PropsWithChildren & { xy: number[] }) => {
  return (
    <text x={xy[0]} y={xy[1]} {...props}>
      {children}
    </text>
  );
};
