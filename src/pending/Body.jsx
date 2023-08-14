import * as SVG from "./lib/react-svg";
import { rotate } from "./rotate";
import { NOOP } from "./initialize";

export const Body = ({ size, position, zoom, time, onClick = NOOP, ...props }) => {
  return (
    <>
      <SVG.Polyline
        fill="none"
        strokeWidth={10 / zoom}
        strokeOpacity={1 / 3}
        stroke={props.stroke || props.fill}
        points={props.t.map((p) => `${p.x},${p.y}`).join(" ")} />
      <SVG.G>
        <SVG.Circle
          xy={[position.x, position.y]}
          r={size}
          {...props}
          onClick={onClick} />
        {props.name.match(/Planet/) && (
          <SVG.G>
            <SVG.Line
              from={[position.x, position.y]}
              to={rotate(position.x, position.y, size, time)}
              strokeOpacity={1}
              strokeWidth={size / 10}
              stroke="yellow" />
            {/* <SVG.Line from={[position.x, position.y]} to={rotate(position.x, position.y, size, time)} strokeOpacity={1} strokeWidth={size/10} stroke="yellow"/> */}
            {/* <SVG.Line from={[position.x, position.y]} to={rotate(position.x, position.y, size, time)} strokeOpacity={1} strokeWidth={size/10} stroke="yellow"/> */}
          </SVG.G>
        )}
      </SVG.G>
    </>
  );
};
