import React, {
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  SetStateAction,
  WheelEvent,
  WheelEventHandler,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import { Body, accelerationDueToGravity } from "./classes/Body";
import { Vector2 } from "./classes/Vector/Vector2";
import { Circle, G, Line, SVG } from "./components/SVG";
import {
  MouseContext,
  MouseContextType,
  MouseProvider,
} from "./contexts/MouseProvider";
import { NV } from "./initialize";
import { mouseToSvg } from "./mouseToSvg";

// type ReactState<T> = [T, React.Dispatch<SetStateAction<T>>];

export function App() {
  return (
    <MouseProvider>
      <Test />
    </MouseProvider>
  );
}

function Test() {
  const mouse = useContext(MouseContext);
  const svgRef = useRef<SVGSVGElement>(null!);

  const [display, setDisplay] = useDisplay(3000, 3000, mouse, svgRef);

  return (
    <>
      <SVG
        width="100%"
        height="800"
        viewBox={display.viewBox}
        style={{ backgroundColor: "black" }}
        onMouseDown={display.dragStart}
        onMouseUp={display.dragStop}
        onMouseMove={display.mouseMove}
        onWheel={display.onWheel}
        onClick={display.onClick}
        
        forwardRef={svgRef}
      >
        {display.bodies.map((body: Body) => (
          <GravitationalBody key={body.id} body={body} display={display} />
        ))}
      </SVG>
      <div>
        <kbd>{JSON.stringify(mouse, null, 4)}</kbd>
      </div>
      <div>
        <kbd>
          {JSON.stringify(
            {
              zoom: display.zoom,
              center: display.center,
              dimensions: display.dimensions,
            },
            null,
            4
          )}
        </kbd>
      </div>
      <div>
        <kbd>{JSON.stringify(display.bodies, null, 4)}</kbd>
      </div>
    </>
  );
}

type DraggingState = {
  start: MouseEvent;
  center: Vector2;
};

type DisplayConfig = {
  center: Vector2;
  dimensions: Vector2;
  zoom: number;
  bodies: Body[];
  keepCenteredOn: number; // AKA focus
  frameOfReference: number; // AKA fixed
  clicking: boolean;
  dragging?: DraggingState;
};

type DisplayConfigExtras = {
  viewBox: string;
  panViewBox: (
    svg: SVGSVGElement,
    dragging: DraggingState,
    current: MouseEvent
  ) => void;
  zoomViewBox: (svg: SVGSVGElement, event: WheelEvent) => void;
  dragStart: MouseEventHandler<SVGSVGElement>;
  dragStop: MouseEventHandler<SVGSVGElement>;
  mouseMove: MouseEventHandler<SVGSVGElement>;
  onWheel: WheelEventHandler<SVGSVGElement>;
  onClick: MouseEventHandler<SVGSVGElement>;
};

type DisplayConfigFull = DisplayConfig & DisplayConfigExtras;

function useDisplay(
  width: number,
  height: number,
  mouse: MouseContextType,
  svg: MutableRefObject<SVGSVGElement>
): [DisplayConfigFull, React.Dispatch<SetStateAction<DisplayConfig>>] {
  const [display, setDisplay] = useState<DisplayConfig>({
    center: new Vector2(0, 0),
    dimensions: new Vector2(width, height),
    zoom: 1,
    bodies: [],
    keepCenteredOn: -1,
    frameOfReference: -1,
    clicking: false,
  });

  const viewBox: string = `${display.center.x - display.dimensions.x / 2} ${
    display.center.y - display.dimensions.y / 2
  } ${display.dimensions.x} ${display.dimensions.y}`;

  const panViewBox = useCallback(
    function (
      svg: SVGSVGElement,
      dragging: DraggingState,
      current: MouseEvent
    ): void {
      setDisplay(function (config): DisplayConfig {
        const w = svg.clientWidth;
        const h = svg.clientHeight;
        const d = config.dimensions;
        const ratio = d.x > d.y ? d.x / w : d.y / h;
        const delta = new Vector2(
          dragging.start.clientX - current.clientX,
          dragging.start.clientY - current.clientY
        );

        return {
          ...config,
          clicking: false,
          center: dragging.center.add(delta.scale(ratio)),
          keepCenteredOn: -1,
        };
      });
    },
    [setDisplay]
  );

  const zoomViewBox = useCallback(
    function (svg: SVGSVGElement, event: WheelEvent): void {
      setDisplay(function (config) {
        const pos = mouseToSvg(svg, event);
        const delta =
          config.keepCenteredOn === -1 ? pos.subtract(config.center) : NV;

        const factor = 1.2;

        // zoom out
        if (event.deltaY > 0) {
          return {
            ...config,
            center: config.center.subtract(delta.scale(factor - 1)),
            dimensions: config.dimensions.scale(factor),
            zoom: config.zoom / factor,
          };
        }

        // zoom in
        else if (event.deltaY < 0) {
          return {
            ...config,
            center: config.center.add(delta.scale((factor - 1) / factor)),
            dimensions: config.dimensions.scale(1 / factor),
            zoom: config.zoom * factor,
          };
        }

        return config;
      });
    },
    [setDisplay]
  );

  const dragStart = useCallback(
    function (event: MouseEvent): void {
      setDisplay(function (config): DisplayConfig {
        return {
          ...config,
          clicking: true,
          dragging: { center: config.center, start: event },
        };
      });
    },
    [setDisplay]
  );

  const dragStop = useCallback(
    function (): void {
      setDisplay(function ({ dragging, ...config }): DisplayConfig {
        return config;
      });
    },
    [setDisplay]
  );

  const mouseMove = useCallback(
    function (ev: MouseEvent) {
      display.dragging && panViewBox(svg.current, display.dragging, ev);
    },
    [display.dragging, panViewBox]
  );

  const onWheel = useCallback(
    function (ev: WheelEvent): void {
      zoomViewBox(svg.current, ev);
    },
    [zoomViewBox]
  );

  const onClick = useCallback(
    function (ev: MouseEvent): void {
      if (!display.clicking) {
        return;
      }
      setDisplay(function (display): DisplayConfig {
        const body = new Body(1e15, 50, mouseToSvg(svg.current, ev));
        return { ...display, bodies: [...display.bodies, body] };
      });
    },
    [display.clicking, mouse, setDisplay]
  );

  return [
    {
      ...display,
      viewBox,
      panViewBox,
      zoomViewBox,
      dragStart,
      dragStop,
      mouseMove,
      onWheel,
      onClick,
    },
    setDisplay,
  ];
}

// const [config, setConfig] = useState({
//   stepTime: 1,
//   stepIter: 1,
//   stepInterval: 10,

//   elapsed: 0,
//   iterations: 0,
// });

function GravitationalBody({
  body,
  display,
}: {
  body: Body;
  display: DisplayConfigFull;
}) {
  const accels: Vector2[] = useMemo(() => {
    const accels = display.bodies
      .filter((b) => b.id !== body.id)
      .map((b) => {
        const d = b.position.subtract(body.position);
        const r = d.magnitude;
        const a = accelerationDueToGravity(b.mass, r);
        return d.scale(a / r);
      });
    return accels;
  }, [body, display.bodies]);

  const totalAccel = useMemo(
    () => accels.reduce((total, acc) => total.add(acc), new Vector2(0, 0)),
    [accels]
  );

  return (
    <G>
      <Circle
        r={body.radius}
        xy={body.position}
        fill={body.color}
        stroke={body.outline}
        strokeOpacity={1}
        strokeWidth={body.radius / 10}
      />
      {accels.map((accel, i) => {
        return (
          <Line
            key={i}
            start={body.position}
            finish={body.position.add(accel.scale(500))}
            strokeOpacity={1}
            strokeWidth={body.radius / 10}
            stroke={body.outline}
          />
        );
      })}
      <Line
        start={body.position}
        finish={body.position.add(totalAccel.scale(500))}
        strokeOpacity={1}
        strokeWidth={body.radius / 6}
        stroke="green"
      />
      <Line
        start={body.position}
        finish={body.position.add(body.velocity.scale(1000))}
        strokeOpacity={1}
        strokeWidth={body.radius / 3}
        stroke="cyan"
      />
    </G>
  );
}
