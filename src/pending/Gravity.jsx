import { useCallback, useEffect, useRef, useState } from "react";
import { EARTH } from "./lib/jxphysics/solar-system";
import * as SVG from "./lib/react-svg";
import { Vector2 } from "./lib/vectors";
import { mouseToSvg } from "./mouseToSvg";
import { time2str } from "./time2str";
import { Body } from "./Body";
import { NV } from "./initialize";
import { barycenter } from "./barycenter";
import { calculateBodies } from "./calculateBodies";
import { maxMag } from "./maxMag";
import { minMag } from "./minMag";
import { minAngSize } from "./minAngSize";
import { maxAngSize } from "./maxAngSize";
import { angSize } from "./angSize";

export const Gravity = ({ mouse }) => {
  const [bodies, setBodies] = useState(
    ((bodies) => {
      const bary = barycenter(bodies);
      return bodies.map((b) => ({ ...b, p: b.p.subtract(bary) }));
    })(initialBodies)
  );
  const [play, setPlay] = useState(false);
  const [dragging, setDragging] = useState(false);

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

  const [stepTime, setStepTime] = useState(config.stepTime);
  const [stepIter, setStepIter] = useState(config.stepIter);
  const [stepInterval, setStepInterval] = useState(config.stepInterval);

  const viewBox = [
    config.center.x - config.dimensions.x / 2,
    config.center.y - config.dimensions.y / 2,
    config.dimensions.x,
    config.dimensions.y,
  ];
  const step = useCallback(
    () => setBodies(calculateBodies(bodies, config, setConfig)),
    [bodies, config]
  );
  const run = useRef();
  const svg = useRef();

  const panViewBox = useCallback((config, { start, center }, current) => {
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

  const zoomViewBox = useCallback((config, event) => {
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

  useEffect(() => {
    clearInterval(run.current);
    if (play) run.current = setInterval(step, config.stepInterval);
  }, [play, step, config]);

  useEffect(() => {
    setBodies((bodies) => {
      if (config.fixed > 0) {
        const fixed = bodies[config.fixed - 1];
        return bodies.map((b) => ({
          ...b,
          p: b === fixed ? NV : b.p.subtract(fixed.p),
        }));
      }
      return bodies;
    });
  }, [config.fixed]);

  useEffect(() => {
    if (config.focus > 0) {
      setBodies((bodies) => {
        setConfig((config) => ({
          ...config,
          center: bodies[config.focus - 1].p,
        }));
        return bodies;
      });
    } else if (config.focus === 0) {
      setBodies((bodies) => {
        setConfig((config) => ({ ...config, center: barycenter(bodies) }));
        return bodies;
      });
    }
  }, [config.fixed, config.focus]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ margin: 4 }}>
              Ticks per Step:{" "}
              <input
                value={stepTime}
                size={6}
                style={{ textAlign: "right" }}
                onChange={(ev) => setStepTime(ev.target.value)}
                onBlur={() => setConfig((config) => ({
                  ...config,
                  stepTime: parseFloat(stepTime),
                }))} />{" "}
              x {Math.sqrt(SCALE)} seconds
            </div>
            <div style={{ margin: 4 }}>
              Steps per Iteration:{" "}
              <input
                value={stepIter}
                size={6}
                style={{ textAlign: "right" }}
                onChange={(ev) => setStepIter(ev.target.value)}
                onBlur={() => setConfig((config) => ({
                  ...config,
                  stepIter: parseInt(stepIter),
                }))} />
            </div>
            <div style={{ margin: 4 }}>
              Iteration Timing:{" "}
              <input
                value={stepInterval}
                size={6}
                style={{ textAlign: "right" }}
                onChange={(ev) => setStepInterval(ev.target.value)}
                onBlur={() => setConfig((config) => ({
                  ...config,
                  stepInterval: parseInt(stepInterval),
                }))} />{" "}
              milliseconds
            </div>
          </div>
          <div>
            <div style={{ margin: 4, display: "inline-block" }}>
              Focus on:{" "}
              <select
                value={config.focus}
                onChange={(ev) => setConfig((config) => ({
                  ...config,
                  focus: parseInt(ev.target.value),
                }))}
              >
                <option value={-1}>Custom</option>
                <option value={0}>Barycenter</option>
                {bodies.map((b, i) => (
                  <option key={i} value={i + 1}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ margin: 4, display: "inline-block" }}>
              Relative to:{" "}
              <select
                value={config.fixed}
                onChange={(ev) => {
                  setConfig((config) => ({
                    ...config,
                    fixed: parseInt(ev.target.value),
                  }));
                  setBodies((bodies) => bodies.map((b) => ({ ...b, t: [] })));
                }}
              >
                <option value={-1}>(0, 0)</option>
                <option value={0}>Barycenter</option>
                {bodies.map((b, i) => (
                  <option key={i} value={i + 1}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button style={{ margin: 4 }} onClick={() => step()}>
              Step
            </button>
            <button style={{ margin: 4 }} onClick={() => setPlay((p) => !p)}>
              {play ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div>
          <div>Model Elapsed Time: {parseInt(config.elapsed)} ticks</div>
          <div>
            Actual Elapsed Time:{" "}
            <pre style={{ display: "inline" }}>
              {time2str(config.elapsed * Math.sqrt(SCALE))}
            </pre>
          </div>
          <div>Iterations: {config.iterations}</div>
          {bodies[2] && (
            <div>
              Angle Blue/Red{" "}
              {parseInt(
                (100 *
                  bodies[0].p
                    .subtract(bodies[2].p)
                    .angleBetween(bodies[1].p.subtract(bodies[2].p)) *
                  180) /
                Math.PI
              ) / 100}
            </div>
          )}
        </div>
        <div style={{ fontSize: "smaller" }}>
          <table>
            <thead>
              <tr>
                <th>(Ang Size)</th>
                {bodies.map((b, i) => (
                  <th key={i}>{b.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodies.map((b, i) => (
                <tr key={i}>
                  <td>{b.name}</td>
                  {bodies.map((bb, ii) => (
                    <td key={ii}>
                      {bb === b ? (
                        "n/a"
                      ) : (
                        <>
                          <small>{minAngSize(b, bb)}</small> {angSize(b, bb)}{" "}
                          <small>{maxAngSize(b, bb)}</small>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: "smaller" }}>
          <table>
            <thead>
              <tr>
                <th>(Distance)</th>
                {bodies.map((b, i) => (
                  <th key={i}>{b.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodies.map((b, i) => (
                <tr key={i}>
                  <td>{b.name}</td>
                  {bodies.map((bb, ii) => (
                    <td key={ii}>
                      {bb === b ? (
                        <>
                          <small>
                            {Math.round(
                              100 *
                              minMag(b, {
                                p: barycenter(bodies),
                                name: "Bary",
                              })
                            ) / 100}
                          </small>{" "}
                          {Math.round(
                            (100 *
                              b.p.subtract(barycenter(bodies)).magnitude() *
                              SCALE) /
                            EARTH.Distance.SUN.Mean
                          ) / 100}{" "}
                          <small>
                            {Math.round(
                              100 *
                              maxMag(b, {
                                p: barycenter(bodies),
                                name: "Bary",
                              })
                            ) / 100}
                          </small>
                        </>
                      ) : (
                        <>
                          <small>{Math.round(100 * minMag(b, bb)) / 100}</small>{" "}
                          {Math.round(
                            (100 * b.p.subtract(bb.p).magnitude() * SCALE) /
                            EARTH.Distance[(b.name.match(/Planet/) &&
                              bb.name.match(/Moon/)) ||
                              (b.name.match(/Moon/) &&
                                bb.name.match(/Planet/))
                              ? "MOON"
                              : "SUN"].Mean
                          ) / 100}{" "}
                          <small>{Math.round(100 * maxMag(b, bb)) / 100}</small>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SVG.SVG
        width="100%"
        height={800}
        viewBox={viewBox}
        style={{ backgroundColor: "black" }}
        onMouseDown={(ev) => setDragging({ start: ev, center: config.center })}
        onMouseUp={() => setDragging(false)}
        onMouseMove={(ev) => dragging && panViewBox(config, dragging, ev)}
        onWheel={(ev) => zoomViewBox(config, ev)}
        forwardRef={svg}
      >
        <SVG.G>
          {false && (
            <SVG.Polyline
              fill="none"
              strokeWidth={300}
              stroke="lime"
              strokeDasharray="20 20"
              points={bodies.map((b) => `${b.p.x},${b.p.y}`).join(" ")} />
          )}
          {bodies[2] && (
            <SVG.Polyline
              fill="none"
              strokeWidth={10 / config.zoom}
              stroke={bodies[0].fill}
              strokeOpacity={1 / 4}
              points={[bodies[0], bodies[2]]
                .map((b) => `${b.p.x},${b.p.y}`)
                .join(" ")} />
          )}
          {bodies[2] && (
            <SVG.Polyline
              fill="none"
              strokeWidth={10 / config.zoom}
              stroke={bodies[1].fill}
              strokeOpacity={1 / 4}
              points={[bodies[1], bodies[2]]
                .map((b) => `${b.p.x},${b.p.y}`)
                .join(" ")} />
          )}
          {bodies.map(({ m, s, p, v, a, ra, ...props }, i) => (
            <Body
              key={i}
              size={s}
              position={p}
              zoom={config.zoom}
              time={config.elapsed * Math.sqrt(SCALE)}
              {...props}
              onClick={() => setConfig((config) => ({ ...config, focus: i + 1 }))} />
          ))}
        </SVG.G>
      </SVG.SVG>
    </div>
  );
};
