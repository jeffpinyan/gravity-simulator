import { useCallback, useEffect, useState, useRef } from 'react';
import './App.css';
import * as CONSTANTS from './lib/jxphysics';
import { EARTH, MOON, SUN } from './lib/jxphysics/solar-system';
import { useMouse } from './lib/react-mouse';
import * as SVG from './lib/react-svg';
import { Vector2 } from './lib/vectors';

const NV = new Vector2 (0, 0);
const NOOP = () => null;

const systems = {
    sol: {
        G: 1,
        SCALE: 1,
        bodies: [
            { name: 'Sun',     m: 332000,    s: 109.19, p: new Vector2 (     0, 0), v: new Vector2 (0,  0), fill: 'yellow' },
            { name: 'Mercury', m:      0.06, s:   0.38, p: new Vector2 (   390, 0), v: new Vector2 (0, 27), fill: 'orange' },
            { name: 'Venus',   m:      0.82, s:   0.95, p: new Vector2 (   720, 0), v: new Vector2 (0, 21), fill: 'pink' },
            { name: 'Earth',   m:      1,    s:   1,    p: new Vector2 (  1000, 0), v: new Vector2 (0, 18), fill: 'green' },
            { name: 'Mars',    m:      0.11, s:   0.53, p: new Vector2 (  1520, 0), v: new Vector2 (0, 15), fill: 'red' },
            { name: 'Jupiter', m:    317.89, s:  11.19, p: new Vector2 (  5200, 0), v: new Vector2 (0,  8), fill: 'white' },
            { name: 'Saturn',  m:     95.15, s:   9.44, p: new Vector2 (  9540, 0), v: new Vector2 (0,  5.95), fill: 'purple' },
        ],
    },

    /*
    a = G * M / R^2
      = G * (M/F/F) / (R/F)^2
    27.322 days = 2360620.8 seconds
    F = 10000, t @ sqrt(F) = 23606.208 units, each tick is 100 seconds
    PERFECTION!
    */
    earthMoon: {
        G: CONSTANTS.G,
        SCALE: 10000 || 3600,
        bodies: [
            { name: 'Earth', m: EARTH.Mass, s: EARTH.Radius,   p: new Vector2 (0, 0), v: new Vector2 (0, 0),   t: [], fill: 'blue' },
            { name: 'Moon',  m: MOON.Mass,  s: MOON.Radius,  p: new Vector2 (EARTH.Distance.MOON.Perigee, 0), v: new Vector2 (0, 1.0839e3), fill: 'silver' },
        ]
    },

    earthISS: {
        G: CONSTANTS.G,
        SCALE: 1 || 10000 || 3600,
        bodies: [
            { name: 'Earth', m: EARTH.Mass, s: EARTH.Radius, p: new Vector2 (0, 0), v: new Vector2 (0, 0),   t: [], fill: 'blue' },
            { name: 'ISS',   m:    400000,  s: 1000,  p: new Vector2 (EARTH.Radius + 4.18e3, 0), v: new Vector2 (0, 7.66e3), fill: 'silver' },
        ]
    },

    /*
    * 1276 time units for one orbit (fudged to 1280 == 320 days)
    * after 4 "years", the two suns are at max separation
    * after 8 "years", the two suns are at min separation
    * Planet-Bluish range = min=2888 4year=2888 8year=3250 max=4103
    * Planet-Reddish range = min=2536 4year=4455 8year=2750 max=4455
    */
    try1: {
        G: 1,
        SCALE: 1,
        bodies: [
            { name: 'Bluish',  m:  800000,    s: 35, p: new Vector2 (-250, 0), v: new Vector2 (0,   0), fill: 'cyan' },
            { name: 'Reddish', m:  200000,    s: 25, p: new Vector2 ( 250, 0), v: new Vector2 (0, -55), fill: 'orange' },
            { name: 'Planet',  m:       0.23, s: 15, p: new Vector2 (3000, 0), v: new Vector2 (0, -30), fill: 'green' },    
        ],
    },

    /*
    * 776 time units for a "year" (where the two suns are at opposition)
    * 2 time units = 1 day, 388 days in a year
    */
    try2: {
        G: 1,
        SCALE: 1,
        bodies: [
            { name: 'Bluish',  m:  800000,    s: 35, p: new Vector2 (   0, 0), v: new Vector2 (0,   0), fill: 'cyan' },
            { name: 'Planet',  m:       0.23, s: 15, p: new Vector2 (2000, 0), v: new Vector2 (0, -20), fill: 'green' },    
            { name: 'Reddish', m:   50000,    s: 25, p: new Vector2 (6000, 0), v: new Vector2 (0, -11.9), fill: 'orange' },
        ],
    },

    magic1: {
        G: CONSTANTS.G,
        SCALE: 1000000,
        bodies: [
            { name: 'Blue',   m:   SUN.Mass*1.8, s: SUN.Radius*2.1,   p: new Vector2 (-SUN.Radius*3, 0),             v: new Vector2 (0, 0), fill: 'cyan' },
            { name: 'Red',    m:   SUN.Mass*0.5, s: SUN.Radius*0.8,   p: new Vector2 (SUN.Radius*3, 0),              v: new Vector2 (0, 2.9e5), fill: 'red' },
            { name: 'Planet', m: EARTH.Mass*0.6, s: SUN.Radius*0.8, p: new Vector2 (EARTH.Distance.SUN.Mean*1.5, 0), v: new Vector2 (0, 9.98e4), fill: 'green' },
        ],
    },

    // 446 days to a year
    magic2: {
        G: CONSTANTS.G,
        SCALE: 1000000,
        bodies: [
            { name: 'Blue',   m:   SUN.Mass*1.8, s: SUN.Radius*2.1,   p: new Vector2 (-SUN.Radius*8, 0),             v: new Vector2 (0, 0), fill: 'cyan' },
            { name: 'Red',    m:   SUN.Mass*0.5, s: SUN.Radius*1.7,   p: new Vector2 (SUN.Radius*8, 0),              v: new Vector2 (0, 1.9e5), fill: 'red' },
            { name: 'Planet', m: EARTH.Mass*0.6, s: SUN.Radius*0.8, p: new Vector2 (EARTH.Distance.SUN.Mean*1.5, 0), v: new Vector2 (0, 7.78e4), fill: 'green' },
        ],
    },

    magic3: {
        G: CONSTANTS.G,
        SCALE: 1000000,
        bodies: [
            { name: 'Blue',   m:   SUN.Mass*1.8, s: SUN.Radius*2.1,   p: new Vector2 (-SUN.Radius*3, 0),             v: new Vector2 (0, 0), fill: 'cyan' },
            { name: 'Red',    m:   SUN.Mass*0.5, s: SUN.Radius*0.8,   p: new Vector2 (SUN.Radius*3, 0),              v: new Vector2 (0, 2.9e5), fill: 'red' },
            { name: 'Planet', m: EARTH.Mass*0.6, s: SUN.Radius*0.8, p: new Vector2 (EARTH.Distance.SUN.Mean, 0), v: new Vector2 (0, 1.08e5), fill: 'green' },
        ],
    },

    // 448 days to orbit the suns - DONE
    // 32 days for the suns to orbit one another - DONE
    magic4: {
        G: CONSTANTS.G,
        SCALE: 60*60*60*60,
        bodies: [
            { name: 'SunBlue', m:   SUN.Mass*1.8, s: SUN.Radius*1.9,   p: new Vector2 (-SUN.Radius*9.98585, 0),             v: new Vector2 (0, 0), fill: 'cyan' },
            { name: 'SunRed',  m:   SUN.Mass*0.5, s: SUN.Radius*1.4,   p: new Vector2 (SUN.Radius*9.98585, 0),              v: new Vector2 (0, 1.9e5), fill: 'red' },
            { name: 'Planet',  m: EARTH.Mass*0.6, s: EARTH.Radius*0.8, p: new Vector2 (EARTH.Distance.SUN.Mean*1.50841, 0), v: new Vector2 (0, 7.78e4), fill: 'green' },
            { name: 'Moon1',   m:  MOON.Mass*0.4, s: MOON.Radius*0.7,  p: new Vector2 (EARTH.Distance.SUN.Mean*1.50841 + EARTH.Distance.MOON.Perigee/2, 0), v: new Vector2 (0, 7.9e4), fill: 'silver' },
        ],
    },

    // 22 days for the suns to orbit one another - DONE
    // 33 x 14 days to orbit the suns - CLOSE (462 earth days >> 28hr day = 396 day year)
    magic: {
        G: CONSTANTS.G,
        SCALE: 60*60*60*60,
        HOURS_PER_DAY: 28,
        DAYS_PER_YEAR: 396,
        bodies: [
            { name: 'SunBlue', m:   SUN.Mass*1.8, s: SUN.Radius*1.87,   p: new Vector2 (-SUN.Radius*9.544, 0),             v: new Vector2 (0, 0), fill: 'cyan' },
            { name: 'SunRed',  m:   SUN.Mass*0.5, s: SUN.Radius*1.53,   p: new Vector2 (SUN.Radius*9.544, 0),              v: new Vector2 (0, 1.895e5), fill: 'red' },
            { name: 'Planet',  m: EARTH.Mass*0.6, s: EARTH.Radius*0.8, p: new Vector2 (EARTH.Distance.SUN.Mean*1.50841, 0), v: new Vector2 (0, 7.79e4), fill: 'green' },
            // { name: 'Moon1',   m:  MOON.Mass*0.4, s: MOON.Radius*0.7,  p: new Vector2 (EARTH.Distance.SUN.Mean*1.50841 + EARTH.Distance.MOON.Perigee/2, 0), v: new Vector2 (0, 7.9e4), fill: 'silver' },
        ],
    },

};

const { G, SCALE, HOURS_PER_DAY, DAYS_PER_YEAR, bodies: initialBodies } = systems.magic;
const SEC_PER_DAY = HOURS_PER_DAY * 3600;
const SEC_PER_YEAR = HOURS_PER_DAY * 3600 * DAYS_PER_YEAR;

initialBodies.forEach((b) => {
    b.m /= Math.pow(SCALE, 2);
    b.s /= SCALE;
    b.p = b.p.scale(1/SCALE);
    b.v = b.v.scale(1/Math.sqrt(SCALE));
    b.t = [];
});

function App () {
    const mouse = useMouse();

    return (
        <div className="App" onMouseMove={mouse.update}>
            <Gravity mouse={mouse}/>
        </div>
    );
}

export default App;

const barycenter = (bodies) => {
    const totalMass = bodies.reduce((mass, { m }) => mass+m, 0);
    return bodies.reduce((pos, { m, p }) => pos.add(p.scale(m/totalMass)), NV);
};

const calculateBodies = (bodies, config, setConfig) => {
    const t = config.stepTime;

    for (let iters = 0; iters < config.stepIter; iters++) {
        bodies = bodies.map((b) => ({ ...b, p: b.p.copy(), v: b.v.copy(), t: b.t.length === 0 ? [ b.p ] : b.t.slice(-1000), a: NV, ra: [] }));
    
        // determine accelerations
        for (let i = 0; i < bodies.length; i++) {
            const M1 = bodies[i];
            for (let j = i+1; j < bodies.length; j++) {
                const m2 = bodies[j];

                const d = m2.p.subtract(M1.p);
                const r = d.magnitude();
                const A1 = G * m2.m / Math.pow(r,2);
                const a2 = G * M1.m / Math.pow(r,2);

                M1.ra[j] = d.scale(A1 / r);
                M1.a = M1.a.add(M1.ra[j]);

                m2.ra[i] = d.scale(a2 / r);
                m2.a = m2.a.subtract(m2.ra[i]);
            }
        }

        // update velocities and positions
        bodies.forEach((b) => {
            b.v = b.v.add(b.a.scale(t));
            b.p = b.p.add(b.v.scale(t));
        });

        // adjust positions based on fixed point
        const fixed = config.fixed ? bodies[config.fixed - 1] : { p: barycenter(bodies) };
        if (config.fixed >= 0) {
            bodies.filter((b) => b !== fixed).forEach((b) => b.p = b.p.subtract(fixed.p));
            fixed.p = NV;
        }
    }

    const fixed = config.fixed && bodies[config.fixed - 1];
    bodies.filter((b) => b !== fixed).forEach((b) => b.t.push(b.p));

    setConfig((config) => ({ ...config, elapsed: config.elapsed + config.stepIter * t, iterations: config.iterations + 1 }));
    
    if (config.focus > 0) {
        setConfig((config) => ({ ...config, center: bodies[config.focus-1].p }));
    }
    else if (config.focus === 0) {
        setConfig((config) => ({ ...config, center: barycenter(bodies) }));
    }

    return bodies;
}

const _minMagCache = new Map ();
const minMag = (a, b) => {
    const cache = _minMagCache;
    const m = a.p.subtract(b.p).magnitude() * SCALE / EARTH.Distance.SUN.Mean;
    if (! cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) > m) cache.set(`${a.name}:${b.name}`, m);
    return cache.get(`${a.name}:${b.name}`);
};

const _maxMagCache = new Map ();
const maxMag = (a, b) => {
    const cache = _maxMagCache;
    const m = a.p.subtract(b.p).magnitude() * SCALE / EARTH.Distance.SUN.Mean;
    if (! cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) < m) cache.set(`${a.name}:${b.name}`, m);
    return cache.get(`${a.name}:${b.name}`);
};

const _minAngSizeCache = new Map ();
const minAngSize = (a, b) => {
    const cache = _minAngSizeCache;
    const m = angSize(a, b);
    if (! cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) > m) cache.set(`${a.name}:${b.name}`, m);
    return cache.get(`${a.name}:${b.name}`);
};

const _maxAngSizeCache = new Map ();
const maxAngSize = (a, b) => {
    const cache = _maxAngSizeCache;
    const m = angSize(a, b);
    if (! cache.has(`${a.name}:${b.name}`) || cache.get(`${a.name}:${b.name}`) < m) cache.set(`${a.name}:${b.name}`, m);
    return cache.get(`${a.name}:${b.name}`);
};

const angSize = (a, b) => {
    const size = b.s;
    const dist = a.p.subtract(b.p).magnitude();
    return Math.round(1000 * Math.atan(size/dist) * 180 / Math.PI) / 1000;
};

const Gravity = ({ mouse }) => {
    const [ bodies, setBodies ] = useState(((bodies) => {
        const bary = barycenter(bodies);
        return bodies.map((b) => ({ ...b, p: b.p.subtract(bary) }));
    })(initialBodies));
    const [ play, setPlay ] = useState(false);
    const [ dragging, setDragging ] = useState(false);

    const [ config, setConfig ] = useState({
        stepTime: 1,
        stepIter: 1,
        stepInterval: 10,
        focus: 0,
        fixed: 0,
        center: barycenter(bodies),
        dimensions: new Vector2 (3000, 3000),
        zoom: 1,
        elapsed: 0,
        iterations: 0,
    });

    const [ stepTime, setStepTime ] = useState(config.stepTime);
    const [ stepIter, setStepIter ] = useState(config.stepIter);
    const [ stepInterval, setStepInterval ] = useState(config.stepInterval);

    const viewBox = [ config.center.x - config.dimensions.x/2, config.center.y - config.dimensions.y/2, config.dimensions.x, config.dimensions.y ];
    const step = useCallback(() => setBodies(calculateBodies(bodies, config, setConfig)), [bodies, config]);
    const run = useRef();
    const svg = useRef();

    const panViewBox = useCallback((config, { start, center }, current) => {
        const w = svg.current.clientWidth;
        const h = svg.current.clientHeight;
        const d = config.dimensions;
        const ratio = d.x > d.y ? (d.x / w) : (d.y / h);
        const delta = new Vector2 (start.clientX - current.clientX, start.clientY - current.clientY);

        setConfig((config) => ({ ...config, center: center.add(delta.scale(ratio)), focus: -1 }));
    }, []);

    const zoomViewBox = useCallback((config, event) => {
        const pos = mouseToSvg(svg, event);
        const delta = config.focus === -1 ? pos.subtract(config.center) : NV;

        const factor = 1.2;

        // zoom out
        if (event.deltaY > 0) {
            setConfig((config) => ({ ...config, center: config.center.subtract(delta.scale(factor-1)), dimensions: config.dimensions.scale(factor), zoom: config.zoom / factor }));
        }

        // zoom in
        else if (event.deltaY < 0) {
            setConfig((config) => ({ ...config, center: config.center.add(delta.scale((factor-1)/factor)), dimensions: config.dimensions.scale(1/factor), zoom: config.zoom * factor }));
        }
    }, []);

    useEffect(() => {
        clearInterval(run.current);
        if (play) run.current = setInterval(step, config.stepInterval);
    }, [play, step, config]);

    useEffect(() => {
        setBodies((bodies) => {
            if (config.fixed > 0) {
                const fixed = bodies[config.fixed-1];
                return bodies.map((b) => ({ ...b, p: (b === fixed) ? NV : b.p.subtract(fixed.p) }));
            }
            return bodies;
        });
    }, [config.fixed]);

    useEffect(() => {
        if (config.focus > 0) {
            setBodies((bodies) => {
                setConfig((config) => ({ ...config, center: bodies[config.focus-1].p }));
                return bodies;
            });
        }
        else if (config.focus === 0) {
            setBodies((bodies) => {
                setConfig((config) => ({ ...config, center: barycenter(bodies) }));
                return bodies;
            });
        }
    }, [config.fixed, config.focus]);

    return <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{margin: 4}}>Ticks per Step: <input value={stepTime} size={6} style={{textAlign: 'right'}} onChange={(ev) => setStepTime(ev.target.value)} onBlur={() => setConfig((config) => ({ ...config, stepTime: parseFloat(stepTime) }))} /> x {Math.sqrt(SCALE)} seconds</div>
                    <div style={{margin: 4}}>Steps per Iteration: <input value={stepIter} size={6} style={{textAlign: 'right'}} onChange={(ev) => setStepIter(ev.target.value)} onBlur={() => setConfig((config) => ({ ...config, stepIter: parseInt(stepIter) }))} /></div>
                    <div style={{margin: 4}}>Iteration Timing: <input value={stepInterval} size={6} style={{textAlign: 'right'}} onChange={(ev) => setStepInterval(ev.target.value)} onBlur={() => setConfig((config) => ({ ...config, stepInterval: parseInt(stepInterval) }))} /> milliseconds</div>
                </div>
                <div>
                    <div style={{margin: 4, display: 'inline-block'}}>Focus on: <select value={config.focus} onChange={(ev) => setConfig((config) => ({ ...config, focus: parseInt(ev.target.value) }))}>
                        <option value={-1}>Custom</option>
                        <option value={0}>Barycenter</option>
                        {bodies.map((b, i) => <option key={i} value={i+1}>{b.name}</option>)}
                    </select></div>
                    <div style={{margin: 4, display: 'inline-block'}}>Relative to: <select value={config.fixed} onChange={(ev) => {
                        setConfig((config) => ({ ...config, fixed: parseInt(ev.target.value) }));
                        setBodies((bodies) => bodies.map((b) => ({ ...b, t: [] })));
                    }}>
                        <option value={-1}>(0, 0)</option>
                        <option value={0}>Barycenter</option>
                        {bodies.map((b, i) => <option key={i} value={i+1}>{b.name}</option>)}
                    </select></div>
                </div>
                <div>
                    <button style={{margin: 4}} onClick={() => step()}>Step</button>
                    <button style={{margin: 4}} onClick={() => setPlay((p) => !p)}>{play ? "Pause" : "Play"}</button>
                </div>
            </div>
            <div>
                <div>Model Elapsed Time: {parseInt(config.elapsed)} ticks</div>
                <div>Actual Elapsed Time: <pre style={{display: 'inline'}}>{time2str(config.elapsed * Math.sqrt(SCALE))}</pre></div>
                <div>Iterations: {config.iterations}</div>
                {bodies[2] && <div>Angle Blue/Red {parseInt(100*bodies[0].p.subtract(bodies[2].p).angleBetween(bodies[1].p.subtract(bodies[2].p)) * 180 / Math.PI)/100}</div>}
            </div>
            <div style={{fontSize: 'smaller'}}>
                <table>
                    <thead>
                        <tr>
                            <th>(Ang Size)</th>
                            {bodies.map((b, i) => <th key={i}>{b.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {bodies.map((b, i) => <tr key={i}>
                            <td>{b.name}</td>
                            {bodies.map((bb, ii) => <td key={ii}>{bb === b ? 'n/a' : <><small>{minAngSize(b, bb)}</small> {angSize(b,bb)} <small>{maxAngSize(b, bb)}</small></>}</td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div style={{fontSize: 'smaller'}}>
                <table>
                    <thead>
                        <tr>
                            <th>(Distance)</th>
                            {bodies.map((b, i) => <th key={i}>{b.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {bodies.map((b, i) => <tr key={i}>
                            <td>{b.name}</td>
                            {bodies.map((bb, ii) => <td key={ii}>{bb === b ?
                                <><small>{Math.round(100*minMag(b, { p: barycenter(bodies), name: 'Bary' }))/100}</small> {Math.round(100*b.p.subtract(barycenter(bodies)).magnitude() * SCALE / EARTH.Distance.SUN.Mean)/100} <small>{Math.round(100*maxMag(b, { p: barycenter(bodies), name: 'Bary' }))/100}</small></>
                              : <><small>{Math.round(100*minMag(b, bb))/100}</small> {Math.round(100*b.p.subtract(bb.p).magnitude() * SCALE / EARTH.Distance[((b.name.match(/Planet/) && bb.name.match(/Moon/)) || (b.name.match(/Moon/) && bb.name.match(/Planet/))) ? 'MOON' : 'SUN'].Mean)/100} <small>{Math.round(100*maxMag(b, bb))/100}</small></>}
                            </td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
        <SVG.SVG width="100%" height={800} viewBox={viewBox} style={{backgroundColor: 'black'}}
            onMouseDown={(ev) => setDragging({ start: ev, center: config.center })}
            onMouseUp={() => setDragging(false)}
            onMouseMove={(ev) => dragging && panViewBox(config, dragging, ev)}
            onWheel={(ev) => zoomViewBox(config, ev)}
            forwardRef={svg}
        >
            <SVG.G>
                {false && <SVG.Polyline fill="none" strokeWidth={300} stroke='lime' strokeDasharray="20 20" points={bodies.map((b) => `${b.p.x},${b.p.y}`).join(' ')} />}
                {bodies[2] && <SVG.Polyline fill="none" strokeWidth={10 / config.zoom} stroke={bodies[0].fill} strokeOpacity={1/4} points={[bodies[0],bodies[2]].map((b) => `${b.p.x},${b.p.y}`).join(' ')} />}
                {bodies[2] && <SVG.Polyline fill="none" strokeWidth={10 / config.zoom} stroke={bodies[1].fill} strokeOpacity={1/4} points={[bodies[1],bodies[2]].map((b) => `${b.p.x},${b.p.y}`).join(' ')} />}
                {bodies.map(({ m, s, p, v, a, ra, ...props }, i) => <Body key={i} size={s} position={p} zoom={config.zoom} time={config.elapsed * Math.sqrt(SCALE)} {...props} onClick={() => setConfig((config) => ({ ...config, focus: i+1 }))} />)}
            </SVG.G>
        </SVG.SVG>
    </div>;
};

const Body = ({ size, position, zoom, time, onClick = NOOP, ...props }) => {
    return <>
        <SVG.Polyline fill="none" strokeWidth={10 / zoom} strokeOpacity={1/3} stroke={props.stroke || props.fill} points={props.t.map((p) => `${p.x},${p.y}`).join(" ")} />
        <SVG.G>
            <SVG.Circle xy={[position.x, position.y]} r={size} {...props} onClick={onClick} />
            {props.name.match(/Planet/) && <SVG.G>
                <SVG.Line from={[position.x, position.y]} to={rotate(position.x, position.y, size, time)} strokeOpacity={1} strokeWidth={size/10} stroke="yellow"/>
                {/* <SVG.Line from={[position.x, position.y]} to={rotate(position.x, position.y, size, time)} strokeOpacity={1} strokeWidth={size/10} stroke="yellow"/> */}
                {/* <SVG.Line from={[position.x, position.y]} to={rotate(position.x, position.y, size, time)} strokeOpacity={1} strokeWidth={size/10} stroke="yellow"/> */}
            </SVG.G>}
        </SVG.G>
    </>
};


const rotate = (x, y, l, time) => {
    const dayOfYear = Math.floor((time % SEC_PER_YEAR) / SEC_PER_DAY);
    const r = time % SEC_PER_DAY;
    const t = r / SEC_PER_DAY;
    const theta = (360 * t) + (360 * (dayOfYear % DAYS_PER_YEAR) / DAYS_PER_YEAR);

    let fx = Math.cos((180 + theta) * (Math.PI/180));
    let fy = -Math.sin(theta * (Math.PI/180));
    // console.log({ dayOfYear, theta, fx, fy })

    return [ x + l * fx, y + l * fy ];
};

/*
  const ratio = grid.viewBox[2] > grid.viewBox[3] ? (grid.viewBox[2] / config.width) : (grid.viewBox[3] / config.height);
  const xRatio = (x) => x * ratio + grid.viewBox[0];
  const yRatio = (y) => y * ratio + grid.viewBox[1];
 
  grid.xyToGridXY = ({x, y}) => {
    return (x !== null && y !== null) ? [ grid.xRatio(x), grid.yRatio(y) ] : [ null, null ];
  }
*/

const time2str = (seconds) => {
    let time = seconds;
    const yr = Math.floor(time / SEC_PER_YEAR);
    time -= yr * SEC_PER_YEAR;
    const days = Math.floor(time / SEC_PER_DAY);
    time -= days * SEC_PER_DAY;
    const hr = Math.floor(time / 3600);
    time -= hr * 3600;
    const min = Math.floor(time / 60);
    time -= min * 60;
    const sec = parseInt(time);

    return `${yr} years, ${days} days, ${hr}:${min}:${sec}`.replace(/(?<=(?:days |:))(\d)(?!\d)/g, '0$1');
};

const mouseToSvg = (svg, event) => {
    if (! svg.current._point) svg.current.__p = svg.current.createSVGPoint();
    svg.current.__p.x = event.clientX;
    svg.current.__p.y = event.clientY;
    const { x, y } = svg.current.__p.matrixTransform(svg.current.getScreenCTM().inverse());
    return new Vector2 (x, y);
};