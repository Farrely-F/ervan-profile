import { cn } from "cn";

/**
 * THE GRID — full-bleed procedural backdrop for the neon world.
 *
 * Reads as an infrastructure control room seen from the aisle: a perspective
 * floor grid converging on a vanishing point, a depth-sorted silhouette row of
 * server racks (LED banks + spinning fans + patch cables), a network topology
 * overlay with packets sliding along its edges, floating chamfered glass shards
 * and a scanned, vignetted atmosphere.
 *
 * Pure presentation: no hooks, no state, no randomness, no JS animation. Every
 * motion is a CSS `animation` on one of the global `rift-*` keyframes (which the
 * reduced-motion media query already neutralises), and every node count /
 * geometry is a literal or derived once at module scope.
 */

const VIEW_W = 1440;
const VIEW_H = 900;
const VP_X = 720;
/** Horizon sits at 62% of the viewBox height. */
const HORIZON = 558;

/* ------------------------------------------------------------------ racks */

type Rack = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** depth shade — back racks read dimmer */
  o: number;
  leds: number;
  fans: number;
  fanR: number;
  /** patch cable dropping off the top of the unit toward the tray */
  cable: string;
};

const RACKS: Rack[] = [
  {
    x: 172,
    y: 456,
    w: 62,
    h: 96,
    o: 0.3,
    leds: 3,
    fans: 1,
    fanR: 9,
    cable: "M203 458 C203 418 216 400 266 392",
  },
  {
    x: 546,
    y: 444,
    w: 70,
    h: 112,
    o: 0.34,
    leds: 4,
    fans: 1,
    fanR: 10,
    cable: "M581 446 C581 402 568 380 516 370",
  },
  {
    x: 986,
    y: 450,
    w: 66,
    h: 104,
    o: 0.32,
    leds: 3,
    fans: 1,
    fanR: 9,
    cable: "M1019 452 C1019 408 1040 386 1092 378",
  },
  {
    x: 316,
    y: 402,
    w: 116,
    h: 214,
    o: 0.6,
    leds: 4,
    fans: 2,
    fanR: 13,
    cable: "M374 404 C374 352 350 326 292 316",
  },
  {
    x: 872,
    y: 392,
    w: 126,
    h: 232,
    o: 0.62,
    leds: 6,
    fans: 2,
    fanR: 14,
    cable: "M935 394 C935 340 984 310 1054 302",
  },
  {
    x: 28,
    y: 322,
    w: 196,
    h: 410,
    o: 0.88,
    leds: 6,
    fans: 2,
    fanR: 19,
    cable: "M126 324 C126 250 86 220 26 208",
  },
  {
    x: 1178,
    y: 336,
    w: 208,
    h: 396,
    o: 0.85,
    leds: 5,
    fans: 2,
    fanR: 20,
    cable: "M1282 338 C1282 266 1346 232 1424 220",
  },
];

/** Three spokes for a rack fan, drawn inside the fan's own bounding box. */
function blades(cx: number, cy: number, r: number): string {
  return [0, 120, 240]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x = cx + Math.cos(rad) * r * 0.76;
      const y = cy + Math.sin(rad) * r * 0.76;
      return `M ${cx} ${cy} L ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

const RACK_PARTS = RACKS.map((rack) => {
  const lw = Math.max(3.2, rack.w * 0.1);
  const lx = rack.x + rack.w - lw - rack.w * 0.14;
  const ltop = rack.y + rack.h * 0.12;
  const lstep = (rack.h * 0.74) / rack.leds;
  const lh = Math.max(2, lstep * 0.44);

  const leds = Array.from({ length: rack.leds }, (_, i) => ({
    i,
    x: Number(lx.toFixed(1)),
    y: Number((ltop + lstep * i).toFixed(1)),
    w: Number(lw.toFixed(1)),
    h: Number(lh.toFixed(1)),
    dur: Number((2 + ((i + rack.x) % 5) * 0.42).toFixed(2)),
    delay: Number((i * 0.31 + (rack.x % 9) * 0.07).toFixed(2)),
  }));

  const seams = Array.from({ length: 5 }, (_, i) =>
    Number((rack.y + (rack.h * (i + 1)) / 6).toFixed(1)),
  );

  const fans = Array.from({ length: rack.fans }, (_, i) => {
    const cx = rack.x + rack.w * (rack.fans === 1 ? 0.28 : i === 0 ? 0.24 : 0.62);
    const cy = rack.y + rack.h * 0.8;
    return {
      cx: Number(cx.toFixed(1)),
      cy: Number(cy.toFixed(1)),
      r: rack.fanR,
      dur: Number((3.4 + i * 1.7 + (rack.fanR % 5) * 0.4).toFixed(2)),
      blades: blades(cx, cy, rack.fanR),
    };
  });

  return { leds, seams, fans };
});

/* -------------------------------------------------------------- floor grid */

/** Rungs marching toward the horizon, then accelerating under the camera. */
const FLOOR_RUNGS = [572, 590, 618, 660, 718, 800, 900];
/** Rails converging on the vanishing point; spread well past both edges. */
const FLOOR_RAILS = [
  -900, -420, -140, 40, 200, 340, 470, 590, 720, 850, 970, 1100, 1240, 1400,
  1580, 1860, 2340,
];

/**
 * Aisle runway dashes: marks that ride the two hero rails toward the
 * vanishing point, sized by their distance from the camera.
 */
const AISLE_MARKS = [340, 1100].flatMap((railX) =>
  FLOOR_RUNGS.slice(2).map((y) => {
    const t = (y - HORIZON) / (VIEW_H + 40 - HORIZON);
    return {
      x: Number((VP_X + (railX - VP_X) * t).toFixed(1)),
      y: y + 4,
      w: Number((14 + t * 58).toFixed(1)),
    };
  }),
);

/* --------------------------------------------------------------- topology */

const NODES = [
  { x: 148, y: 138, r: 4.6, led: 3.1, delay: 0.0 },
  { x: 322, y: 86, r: 3.4, led: 2.4, delay: 0.6 },
  { x: 512, y: 196, r: 4.0, led: 3.6, delay: 1.1 },
  { x: 704, y: 104, r: 5.2, led: 2.8, delay: 0.3 },
  { x: 886, y: 204, r: 3.6, led: 3.4, delay: 1.5 },
  { x: 1066, y: 118, r: 4.2, led: 2.6, delay: 0.9 },
  { x: 1246, y: 232, r: 4.8, led: 3.0, delay: 0.2 },
  { x: 622, y: 318, r: 3.8, led: 3.8, delay: 1.3 },
  { x: 1014, y: 332, r: 4.4, led: 3.2, delay: 0.7 },
];

const EDGES = [
  { d: "M148 138 L236 96 L322 86", dur: 3.2, delay: 0 },
  { d: "M322 86 L432 132 L512 196", dur: 4.4, delay: 0.7 },
  { d: "M512 196 L606 132 L704 104", dur: 3.6, delay: 1.4 },
  { d: "M704 104 L800 162 L886 204", dur: 5.0, delay: 0.3 },
  { d: "M886 204 L976 138 L1066 118", dur: 3.0, delay: 1.9 },
  { d: "M1066 118 L1176 168 L1246 232", dur: 4.2, delay: 1.0 },
  { d: "M512 196 L566 258 L622 318", dur: 3.4, delay: 2.2 },
  { d: "M622 318 L818 300 L1014 332", dur: 5.4, delay: 0.5 },
  { d: "M1014 332 L1130 268 L1246 232", dur: 3.8, delay: 1.7 },
  { d: "M704 104 L652 218 L622 318", dur: 4.6, delay: 0.9 },
];

/** Comet packets: a short opaque dash on a long gap, offset-animated. */
const PACKETS = [
  { d: "M148 138 L236 96 L322 86", dash: "18 640", stroke: 3.6, dur: 4.2, delay: 0 },
  { d: "M886 204 L976 138 L1066 118", dash: "14 520", stroke: 3.0, dur: 5.2, delay: 1.4 },
  { d: "M622 318 L818 300 L1014 332", dash: "20 700", stroke: 4.0, dur: 6.2, delay: 2.3 },
  { d: "M704 104 L652 218 L622 318", dash: "12 440", stroke: 2.8, dur: 3.6, delay: 0.8 },
];

/* ----------------------------------------------------------------- shards */

/** A rectangle with all four corners cut — the chamfer language, in glass. */
function shard(x: number, y: number, w: number, h: number, cut: number): string {
  const pts: [number, number][] = [
    [x + cut, y],
    [x + w - cut, y],
    [x + w, y + cut],
    [x + w, y + h - cut],
    [x + w - cut, y + h],
    [x + cut, y + h],
    [x, y + h - cut],
    [x, y + cut],
  ];
  return pts.map(([px, py]) => `${px} ${py}`).join(" ");
}

const SHARDS = [
  { x: 86, y: 92, w: 132, h: 174, cut: 17, rot: -12, o: 0.26, hue: "a", dur: 7.4, delay: 0 },
  { x: 268, y: 226, w: 74, h: 96, cut: 10, rot: 18, o: 0.32, hue: "b", dur: 6.2, delay: 1.1 },
  { x: 424, y: 62, w: 58, h: 82, cut: 8, rot: 24, o: 0.24, hue: "a", dur: 8.1, delay: 2.4 },
  { x: 690, y: 178, w: 132, h: 76, cut: 12, rot: -9, o: 0.22, hue: "b", dur: 9.0, delay: 0.7 },
  { x: 890, y: 78, w: 66, h: 90, cut: 9, rot: 16, o: 0.3, hue: "a", dur: 6.8, delay: 3.1 },
  { x: 1092, y: 214, w: 152, h: 88, cut: 13, rot: -14, o: 0.26, hue: "b", dur: 7.8, delay: 1.8 },
  { x: 1286, y: 104, w: 52, h: 74, cut: 7, rot: 30, o: 0.34, hue: "a", dur: 5.6, delay: 2.7 },
  { x: 196, y: 402, w: 44, h: 60, cut: 6, rot: -26, o: 0.22, hue: "b", dur: 8.6, delay: 3.6 },
  { x: 1130, y: 452, w: 34, h: 48, cut: 5, rot: 22, o: 0.26, hue: "a", dur: 6.4, delay: 4.2 },
];

/* ------------------------------------------------------------- component */

type Props = {
  className?: string;
};

export function GridScene({ className }: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          {/* deep space wash */}
          <linearGradient id="gs-void" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="var(--void)" />
            <stop offset="46%" stopColor="color-mix(in oklab, var(--void) 78%, var(--rift-c))" />
            <stop offset="62%" stopColor="color-mix(in oklab, var(--void) 62%, var(--rift-a))" />
            <stop offset="100%" stopColor="var(--void)" />
          </linearGradient>

          {/* horizon bloom at the vanishing point */}
          <radialGradient id="gs-horizon" cx="0.5" cy="0.62" r="0.55">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-a) 45%, transparent)" />
            <stop offset="42%" stopColor="color-mix(in oklab, var(--rift-b) 18%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* floor falloff, drawn as a flat rect — no blur pass */}
          <linearGradient id="gs-floor" x1="0" y1="0.6" x2="0" y2="1">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-c) 16%, transparent)" />
            <stop offset="55%" stopColor="color-mix(in oklab, var(--rift-a) 7%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* edge vignettes + world-tinted side glows */}
          <radialGradient id="gs-vig" cx="0.5" cy="0.5" r="0.72">
            <stop offset="52%" stopColor="var(--void)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--void)" stopOpacity="0.88" />
          </radialGradient>
          <linearGradient id="gs-glow-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-a) 30%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="gs-glow-b" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-b) 30%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="gs-glow-c" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-c) 22%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* rack light pool on the glossed floor */}
          <radialGradient id="gs-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="color-mix(in oklab, var(--rift-a) 40%, transparent)" />
            <stop offset="55%" stopColor="color-mix(in oklab, var(--rift-c) 18%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* travelling scan band */}
          <linearGradient id="gs-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="color-mix(in oklab, var(--rift-a) 26%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* one-shot film grain */}
          <filter id="gs-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.86"
              numOctaves={2}
              stitchTiles="stitch"
              result="gs-noise"
            />
            <feColorMatrix
              in="gs-noise"
              type="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.62 0"
            />
          </filter>
        </defs>

        {/* 1 — deep space wash */}
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#gs-void)" />
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#gs-horizon)" opacity="0.7" />

        {/* 2 — perspective floor */}
        <rect
          x="0"
          y={HORIZON}
          width={VIEW_W}
          height={VIEW_H - HORIZON}
          fill="url(#gs-floor)"
        />
        <g style={{ animation: "rift-pulse 9s ease-in-out infinite" }} opacity="0.9">
          {FLOOR_RAILS.map((x) => (
            <line
              key={`rail-${x}`}
              x1={VP_X}
              y1={HORIZON}
              x2={x}
              y2={VIEW_H + 40}
              stroke={
                Math.abs(Math.abs(x - VP_X) - 380) < 1
                  ? "color-mix(in oklab, var(--rift-b) 78%, transparent)"
                  : "color-mix(in oklab, var(--rift-a) 58%, transparent)"
              }
              strokeWidth={Math.abs(Math.abs(x - VP_X) - 380) < 1 ? 1.4 : 1}
              strokeOpacity="0.72"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {FLOOR_RUNGS.map((y) => (
            <line
              key={`rung-${y}`}
              x1="-200"
              y1={y}
              x2={VIEW_W + 200}
              y2={y}
              stroke="color-mix(in oklab, var(--rift-a) 62%, transparent)"
              strokeWidth={y === HORIZON ? 1.4 : 1}
              strokeOpacity={Math.min(0.9, 0.34 + (y - HORIZON) / 380)}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* horizon seam */}
          <line
            x1="-200"
            y1={HORIZON}
            x2={VIEW_W + 200}
            y2={HORIZON}
            stroke="color-mix(in oklab, var(--rift-a) 80%, transparent)"
            strokeWidth="1.4"
            strokeOpacity="0.85"
            vectorEffect="non-scaling-stroke"
          />
          {AISLE_MARKS.map((mark, mi) => (
            <rect
              key={`mark-${mi}`}
              x={mark.x - mark.w / 2}
              y={mark.y}
              width={mark.w}
              height="2"
              rx="1"
              fill="var(--rift-b)"
              opacity="0.34"
            />
          ))}
        </g>

        {/* 3 — rack aisle silhouette, back to front */}
        <g>
          {/* overhead cable tray */}
          <line
            x1="-40"
            y1="330"
            x2={VIEW_W + 40}
            y2="330"
            stroke="color-mix(in oklab, var(--rift-a) 26%, transparent)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="-40"
            y1="336"
            x2={VIEW_W + 40}
            y2="336"
            stroke="color-mix(in oklab, var(--void) 70%, var(--rift-a))"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          {RACKS.map((rack, ri) => (
            <g key={`rack-${ri}`} opacity={rack.o}>
              {/* floor contact shadow + light pool */}
              <rect
                x={rack.x - 8}
                y={rack.y + rack.h - 3}
                width={rack.w + 16}
                height="12"
                rx="6"
                fill="var(--void)"
                opacity="0.6"
              />
              <ellipse
                cx={rack.x + rack.w / 2}
                cy={rack.y + rack.h + 9}
                rx={rack.w * 0.95}
                ry="12"
                fill="url(#gs-pool)"
                opacity={Math.min(1, rack.o + 0.18)}
              />
              {/* patch cable off the top */}
              <path
                d={rack.cable}
                fill="none"
                stroke={
                  ri % 2 === 0
                    ? "color-mix(in oklab, var(--rift-b) 55%, transparent)"
                    : "color-mix(in oklab, var(--rift-a) 55%, transparent)"
                }
                strokeWidth="1.4"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {/* chassis */}
              <rect
                x={rack.x}
                y={rack.y}
                width={rack.w}
                height={rack.h}
                rx="4"
                fill="color-mix(in oklab, var(--void) 84%, var(--rift-a))"
                stroke="color-mix(in oklab, var(--rift-a) 48%, transparent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* unit seams */}
              {RACK_PARTS[ri].seams.map((sy) => (
                <line
                  key={`seam-${ri}-${sy}`}
                  x1={rack.x + 3}
                  y1={sy}
                  x2={rack.x + rack.w - 3}
                  y2={sy}
                  stroke="color-mix(in oklab, var(--rift-a) 30%, transparent)"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* left vent slats */}
              {RACK_PARTS[ri].seams.map((sy, si) => (
                <line
                  key={`vent-${ri}-${si}`}
                  x1={rack.x + rack.w * 0.12}
                  y1={sy - 4}
                  x2={rack.x + rack.w * 0.46}
                  y2={sy - 4}
                  stroke="color-mix(in oklab, var(--foreground) 22%, transparent)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {/* LED bank */}
              {RACK_PARTS[ri].leds.map((led) => (
                <rect
                  key={`led-${ri}-${led.i}`}
                  x={led.x}
                  y={led.y}
                  width={led.w}
                  height={led.h}
                  rx="1"
                  fill={
                    led.i % 3 === 0
                      ? "var(--rift-b)"
                      : led.i % 3 === 1
                        ? "var(--rift-c)"
                        : "var(--rift-a)"
                  }
                  style={{
                    animation: `rift-led ${led.dur}s ease-in-out infinite ${led.delay}s`,
                  }}
                />
              ))}
              {/* fans */}
              {RACK_PARTS[ri].fans.map((fan, fi) => (
                <g
                  key={`fan-${ri}-${fi}`}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    animation: `rift-orbit ${fan.dur}s linear infinite`,
                  }}
                >
                  <circle
                    cx={fan.cx}
                    cy={fan.cy}
                    r={fan.r}
                    fill="color-mix(in oklab, var(--void) 80%, var(--rift-a))"
                    stroke="color-mix(in oklab, var(--rift-a) 45%, transparent)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={fan.blades}
                    fill="none"
                    stroke="color-mix(in oklab, var(--rift-a) 55%, transparent)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
              {/* faceplate status strip */}
              <rect
                x={rack.x + 4}
                y={rack.y + 4}
                width={Math.max(6, rack.w * 0.06)}
                height={rack.h - 8}
                rx="1.5"
                fill="color-mix(in oklab, var(--rift-a) 22%, transparent)"
                style={{ animation: `rift-pulse ${6 + ri}s ease-in-out infinite ${ri * 0.5}s` }}
              />
            </g>
          ))}
        </g>

        {/* 4 — network topology overlay */}
        <g>
          {EDGES.map((edge, ei) => (
            <path
              key={`edge-${ei}`}
              d={edge.d}
              fill="none"
              stroke="color-mix(in oklab, var(--rift-a) 42%, transparent)"
              strokeWidth="1"
              strokeDasharray="5 7"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `rift-dash ${edge.dur * 3}s linear infinite ${edge.delay}s`,
              }}
            />
          ))}
          {PACKETS.map((packet, pi) => (
            <path
              key={`packet-${pi}`}
              d={packet.d}
              fill="none"
              stroke="var(--rift-c)"
              strokeWidth={packet.stroke}
              strokeLinecap="round"
              strokeDasharray={packet.dash}
              vectorEffect="non-scaling-stroke"
              style={{ animation: `rift-dash ${packet.dur}s linear infinite ${packet.delay}s` }}
            />
          ))}
          {NODES.map((node, ni) => (
            <g key={`node-${ni}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 4}
                fill="none"
                stroke="color-mix(in oklab, var(--rift-b) 40%, transparent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                style={{
                  animation: `rift-pulse ${node.led * 1.6}s ease-in-out infinite ${node.delay}s`,
                }}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="var(--rift-a)"
                style={{
                  animation: `rift-led ${node.led}s ease-in-out infinite ${node.delay}s`,
                }}
              />
            </g>
          ))}
        </g>

        {/* 5 — floating chamfered glass shards */}
        <g>
          {SHARDS.map((s, si) => (
            <g
              key={`shard-${si}`}
              style={{ animation: `rift-float ${s.dur}s ease-in-out infinite ${s.delay}s` }}
            >
              <g transform={`rotate(${s.rot} ${s.x + s.w / 2} ${s.y + s.h / 2})`}>
                <polygon
                  points={shard(s.x, s.y, s.w, s.h, s.cut)}
                  fill={`color-mix(in oklab, var(--rift-${s.hue}) 42%, color-mix(in oklab, var(--void) 55%, transparent))`}
                  fillOpacity={Math.min(1, s.o * 1.6)}
                  stroke={`color-mix(in oklab, var(--rift-${s.hue}) 92%, transparent)`}
                  strokeOpacity="0.8"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  points={`${s.x + s.cut} ${s.y} ${s.x + s.w - s.cut} ${s.y}`}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeOpacity="0.45"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </g>
          ))}
        </g>

        {/* 6 — atmosphere */}
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill="url(#gs-glow-a)"
          opacity="0.5"
        />
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill="url(#gs-glow-b)"
          opacity="0.5"
        />
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill="url(#gs-glow-c)"
          opacity="0.45"
        />
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill="var(--void)"
          opacity="0.28"
        />
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "top",
            animation: "rift-scan 11s linear infinite",
          }}
        >
          <rect
            x="0"
            y="0"
            width={VIEW_W}
            height="96"
            fill="url(#gs-scan)"
            opacity="0.42"
          />
        </g>
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          fill="url(#gs-vig)"
        />
        <rect
          x="0"
          y="0"
          width={VIEW_W}
          height={VIEW_H}
          filter="url(#gs-grain)"
          opacity="0.07"
          style={{ mixBlendMode: "overlay" }}
        />
      </svg>
    </div>
  );
}
