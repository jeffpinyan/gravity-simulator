import { useCallback, useContext, useMemo, useRef, useState } from "react";
import "./App.css";
import { MouseContext, MouseProvider } from "./contexts/MouseProvider";
import * as SVG from "./components/SVG";
import { barycenter } from "./barycenter";
import { Vector2 } from "./classes/Vector/Vector2";
import { mouseToSvg } from "./mouseToSvg";
import { NV } from "./initialize";
import { Body } from "./classes/Body";

export function App() {
  return (
    <MouseProvider>
      <Test />
    </MouseProvider>
  );
}

function Test() {
  const mouse = useContext(MouseContext);
  const svg = useRef<SVGSVGElement>(null!);

  const [bodies, setBodies] = useState<Body[]>([]);

  const [dragging, setDragging] = useState<false | {}>(false);

  const [config, setConfig] = useState({
    stepTime: 1,
    stepIter: 1,
    stepInterval: 10,
    focus: 0,
    fixed: 0,
    center: barycenter(bodies),
    dimensions: new Vector2(3000, 3000),
    zoom: 1,
    elapsed: 0,
    iterations: 0,
  });

  const viewBox: string = useMemo(
    () =>
      [
        config.center.x - config.dimensions.x / 2,
        config.center.y - config.dimensions.y / 2,
        config.dimensions.x,
        config.dimensions.y,
      ].join(" "),
    [config]
  );

  const panViewBox = useCallback((config: any, { start, center }: any, current: any) => {
    const w = svg.current.clientWidth;
    const h = svg.current.clientHeight;
    const d = config.dimensions;
    const ratio = d.x > d.y ? d.x / w : d.y / h;
    const delta = new Vector2(
      start.clientX - current.clientX,
      start.clientY - current.clientY
    );

    setConfig((config) => ({
      ...config,
      center: center.add(delta.scale(ratio)),
      focus: -1,
    }));
  }, []);

  const zoomViewBox = useCallback((config: any, event: WheelEvent) => {
    const pos = mouseToSvg(svg, event);
    const delta = config.focus === -1 ? pos.subtract(config.center) : NV;

    const factor = 1.2;

    // zoom out
    if (event.deltaY > 0) {
      setConfig((config) => ({
        ...config,
        center: config.center.subtract(delta.scale(factor - 1)),
        dimensions: config.dimensions.scale(factor),
        zoom: config.zoom / factor,
      }));
    }


    // zoom in
    else if (event.deltaY < 0) {
      setConfig((config) => ({
        ...config,
        center: config.center.add(delta.scale((factor - 1) / factor)),
        dimensions: config.dimensions.scale(1 / factor),
        zoom: config.zoom * factor,
      }));
    }
  }, []);


  return (
    <SVG.SVG
      width="100%"
      height="800"
      viewBox={viewBox}
      style={{ backgroundColor: "black" }}
      onMouseDown={(ev: MouseEvent) => setDragging({ start: ev, center: config.center })}
      onMouseUp={() => setDragging(false)}
      onMouseMove={(ev: MouseEvent) => dragging && panViewBox(config, dragging, ev)}
      onWheel={(ev: WheelEvent) => zoomViewBox(config, ev)}
      forwardRef={svg}
    ></SVG.SVG>
  );
}
