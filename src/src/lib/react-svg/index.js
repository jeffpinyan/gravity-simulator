import React from 'react';

const x0y0 = [ 0, 0 ];

export const SVG = ({ children, width="100%", height="100%", forwardRef, ...props }) => {
    return <svg
        ref={forwardRef}
        xmlns="http://www.w3.org/2000/svg" version="1.1"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={width} height={height}
        {...props}
    >
        {children}
    </svg>;
};


export const Defs = ({ children, ...props }) => {
    return <defs {...props}>
        {children}
    </defs>;
};


export const G = ({ children, ...props }) => {
    return <g {...props}>
        {children}
    </g>;
};


export const Use = ({ href, xy = x0y0, ...props }) => {
    return <use href={href} x={xy[0]} y={xy[1]} {...props}/>;
};


export const Pattern = ({ xy = x0y0, size, children, ...props }) => {
    return <pattern x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props}>
        {children}
    </pattern>;
};


export const Line = ({ from = x0y0, to, ...props}) => {
    return <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} {...props}/>;
};


export const Polyline = ({ ...props }) => {
    return <polyline {...props}/>;
};


export const Polygon = ({ ...props }) => {
    return <polygon {...props}/>;
};


export const Rect = ({ xy = x0y0, size, ...props }) => {
    if (props.r) {
        props.rx = props.r;
        delete props.r;
    }
    return <rect x={xy[0]} y={xy[1]} width={size[0]} height={size[1]} {...props}/>;
};


export const Circle = ({ xy = x0y0, r, ...props}) => {
    return <circle cx={xy[0]} cy={xy[1]} r={r} {...props}/>;
};


export const Mask = ({ children, ...props }) => {
    return <mask {...props}>
        {children}
    </mask>;
};


export const Path = ({ ...props }) => {
    return <path {...props}/>;
};


export const ClipPath = ({ children, ...props }) => {
    return <clipPath {...props}>
        {children}
    </clipPath>;
};


export const Text = ({ xy = x0y0, children, ...props }) => {
    return <text x={xy[0]} y={xy[1]} {...props}>
        {children}
    </text>;
};