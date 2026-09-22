import { cn } from "cn";

/**
 * THE GRID — player emblem.
 *
 * A hexagonal circuit-board sigil: chamfered neon plate, a slowly orbiting
 * bezel of 48 alternating ticks, eight orthogonal traces that fire pulses
 * outward into LED nodes, a diamond core plate carrying the operator's
 * initials. Every coordinate is a module-scope literal or derived once from
 * literals, so SSR and hydration agree exactly; every motion is a CSS
 * animation driven by the global `rift-*` keyframes (neutralised by the
 * global reduced-motion query). Purely presentational — no hooks, no state.
 */

type Props = {
  initials: string;
  className?: string;
  label?: string;
};

const CX = 100;
const CY = 100;

const fmt = (value: number): number => Math.round(value * 100) / 100;

function polar(deg: number, radius: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CX + Math.cos(rad) * radius, CY + Math.sin(rad) * radius];
}

function step(from: [number, number], to: [number, number], dist: number): [number, number] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  return [from[0] + (dx / len) * dist, from[1] + (dy / len) * dist];
}

/** Flat-top hexagon with every corner cut back — the site's chamfer language. */
function chamferHex(radius: number, cut: number): string {
  const corners = [0, 60, 120, 180, 240, 300].map((deg) => polar(deg, radius));
  const n = corners.length;
  const out: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const cur = corners[i];
    const a = step(cur, corners[(i + n - 1) % n], cut);
    const b = step(cur, corners[(i + 1) % n], cut);
    out.push(`${i === 0 ? "M" : "L"}${fmt(a[0])} ${fmt(a[1])}`, `L${fmt(b[0])} ${fmt(b[1])}`);
  }
  return `${out.join(" ")} Z`;
}

const PLATE = chamferHex(82, 15);
const PLATE_HAIRLINE = chamferHex(78, 14);
const RING_INNER = chamferHex(56, 10);
const CORE_HEX = chamferHex(32, 6);

/** 48 radial ticks — every other one long — swept as a single rotating group. */
const TICKS = Array.from({ length: 48 }, (_, i) => {
  const deg = i * 7.5;
  const long = i % 2 === 0;
  const [x1, y1] = polar(deg, long ? 58 : 63);
  const [x2, y2] = polar(deg, 68);
  return { x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2), long };
});

/** Eight orthogonal (90°-bend only) PCB traces running outward from the core. */
const TRACES: { d: string; led: [number, number]; via: [number, number]; dur: number; delay: number }[] = [
  { d: "M128 100 H140 V92 H144", led: [144, 92], via: [140, 100], dur: 7, delay: 0 },
  { d: "M120 120 H130 V130 H131", led: [131, 131], via: [130, 120], dur: 11, delay: 1.2 },
  { d: "M100 128 V140 H92 V144", led: [92, 144], via: [100, 140], dur: 9, delay: 2.4 },
  { d: "M80 120 H70 V130 H66", led: [66, 130], via: [70, 120], dur: 13, delay: 0.6 },
  { d: "M72 100 H60 V108 H55", led: [55, 108], via: [60, 100], dur: 6, delay: 3.1 },
  { d: "M80 80 H70 V70 H68", led: [68, 68], via: [70, 80], dur: 12, delay: 1.8 },
  { d: "M100 72 V60 H108 V56", led: [108, 56], via: [100, 60], dur: 8, delay: 4.2 },
  { d: "M120 80 H130 V70 H132", led: [132, 70], via: [130, 80], dur: 10, delay: 2.9 },
];

/** Corner registration brackets sitting in the four empty corners of the plate. */
const BRACKETS = ["M34 16 H16 V34", "M166 16 H184 V34", "M34 184 H16 V166", "M166 184 H184 V166"];

const MONO = "var(--font-mono)";
const HAIR = "color-mix(in oklab, var(--rift-a) 30%, transparent)";

export function GridSigil({ initials, label, className }: Props) {
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <div className={cn("relative aspect-square", className)} {...a11y}>
      <svg viewBox="0 0 200 200" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient
            id="grid-sigil-plate"
            x1="14"
            y1="18"
            x2="186"
            y2="184"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--rift-a)", stopOpacity: 0.95 }} />
            <stop offset="0.5" style={{ stopColor: "var(--rift-b)", stopOpacity: 0.6 }} />
            <stop offset="1" style={{ stopColor: "var(--rift-c)", stopOpacity: 0.85 }} />
          </linearGradient>
          <radialGradient
            id="grid-sigil-core"
            cx="100"
            cy="100"
            r="54"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" style={{ stopColor: "var(--rift-a)", stopOpacity: 0.34 }} />
            <stop offset="0.58" style={{ stopColor: "var(--rift-b)", stopOpacity: 0.14 }} />
            <stop offset="1" style={{ stopColor: "var(--rift-b)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* ---- plate ---- */}
        <path
          d={PLATE}
          style={{
            fill: "color-mix(in oklab, var(--rift-a) 6%, transparent)",
            stroke: "url(#grid-sigil-plate)",
            strokeWidth: 1.5,
            strokeLinejoin: "round",
          }}
        />
        <path
          d={PLATE_HAIRLINE}
          style={{
            fill: "none",
            stroke: "color-mix(in oklab, var(--rift-c) 22%, transparent)",
            strokeWidth: 0.55,
          }}
        />

        {/* ---- field glow + bezel ---- */}
        <circle cx={100} cy={100} r={54} style={{ fill: "url(#grid-sigil-core)" }} />
        <circle
          cx={100}
          cy={100}
          r={70.5}
          style={{
            fill: "none",
            stroke: "color-mix(in oklab, var(--rift-b) 34%, transparent)",
            strokeWidth: 0.7,
            animation: "rift-glyph 7.5s ease-in-out infinite",
          }}
        />
        <path
          d={RING_INNER}
          style={{
            fill: "none",
            stroke: "color-mix(in oklab, var(--rift-c) 42%, transparent)",
            strokeWidth: 0.9,
          }}
        />

        {/* ---- orbiting tick ring ---- */}
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
            animation: "rift-orbit 64s linear infinite",
          }}
        >
          {TICKS.map((t) => (
            <line
              key={`${t.x1}-${t.y1}`}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              style={{
                stroke: t.long
                  ? "color-mix(in oklab, var(--rift-a) 60%, transparent)"
                  : "color-mix(in oklab, var(--rift-b) 34%, transparent)",
                strokeWidth: t.long ? 0.9 : 0.6,
              }}
            />
          ))}
        </g>

        {/* ---- circuit traces ---- */}
        {TRACES.map((t) => (
          <g key={t.d}>
            <path
              d={t.d}
              style={{ fill: "none", stroke: HAIR, strokeWidth: 1.1, strokeLinejoin: "miter" }}
            />
            <path
              d={t.d}
              style={{
                fill: "none",
                stroke: "var(--rift-a)",
                strokeWidth: 2,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeDasharray: "15 185",
                opacity: 0.9,
                animation: `rift-dash ${t.dur}s linear infinite ${t.delay}s`,
              }}
            />
            <circle
              cx={t.via[0]}
              cy={t.via[1]}
              r={2.3}
              style={{
                fill: "color-mix(in oklab, var(--rift-c) 26%, transparent)",
                stroke: "color-mix(in oklab, var(--rift-b) 62%, transparent)",
                strokeWidth: 0.7,
              }}
            />
            <circle
              cx={t.via[0]}
              cy={t.via[1]}
              r={0.85}
              style={{ fill: "color-mix(in oklab, var(--rift-a) 80%, transparent)" }}
            />
            <circle
              cx={t.led[0]}
              cy={t.led[1]}
              r={3.9}
              style={{ fill: "none", stroke: "color-mix(in oklab, var(--rift-c) 38%, transparent)", strokeWidth: 0.6 }}
            />
            <circle
              cx={t.led[0]}
              cy={t.led[1]}
              r={2.5}
              style={{
                fill: "var(--rift-a)",
                opacity: 0.85,
                animation: t.dur % 3 === 0 ? `rift-pulse ${5 + t.delay}s ease-in-out infinite` : undefined,
              }}
            />
          </g>
        ))}

        {/* ---- core: diamond plate + hex ring + initials ---- */}
        <path
          d="M100 74 L126 100 L100 126 L74 100 Z"
          style={{
            fill: "color-mix(in oklab, var(--rift-b) 12%, transparent)",
            stroke: "color-mix(in oklab, var(--rift-c) 46%, transparent)",
            strokeWidth: 0.9,
            strokeLinejoin: "round",
          }}
        />
        <path
          d="M100 84 L116 100 L100 116 L84 100 Z"
          style={{ fill: "none", stroke: "color-mix(in oklab, var(--rift-a) 20%, transparent)", strokeWidth: 0.5 }}
        />
        <path
          d={CORE_HEX}
          style={{
            fill: "none",
            stroke: "color-mix(in oklab, var(--rift-a) 52%, transparent)",
            strokeWidth: 1.1,
            strokeLinejoin: "round",
          }}
        />
        <text
          x={101}
          y={105}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: MONO,
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fill: "var(--rift-a)",
            opacity: 0.35,
          }}
        >
          {initials}
        </text>
        <text
          x={100}
          y={104}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: MONO,
            fontSize: 42,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fill: "var(--rift-a)",
          }}
        >
          {initials}
        </text>

        {/* ---- HUD corners: brackets + status chips ---- */}
        {BRACKETS.map((d) => (
          <path
            key={d}
            d={d}
            style={{
              fill: "none",
              stroke: "color-mix(in oklab, var(--rift-a) 46%, transparent)",
              strokeWidth: 1.2,
            }}
          />
        ))}
        <path
          d="M16 20 H26 M20 16 V22"
          style={{ fill: "none", stroke: "color-mix(in oklab, var(--rift-b) 40%, transparent)", strokeWidth: 0.7 }}
        />
        <path
          d="M184 180 H174 M180 184 V178"
          style={{ fill: "none", stroke: "color-mix(in oklab, var(--rift-b) 40%, transparent)", strokeWidth: 0.7 }}
        />

        <rect
          x={16}
          y={44}
          width={9}
          height={22}
          rx={1}
          style={{
            fill: "color-mix(in oklab, var(--rift-a) 10%, transparent)",
            stroke: "color-mix(in oklab, var(--rift-a) 38%, transparent)",
            strokeWidth: 0.7,
          }}
        />
        <rect
          x={18}
          y={47}
          width={5}
          height={4}
          rx={0.6}
          style={{ fill: "var(--rift-a)", animation: "rift-led 2.4s ease-in-out infinite 0.3s" }}
        />
        <rect
          x={18}
          y={54}
          width={5}
          height={2}
          style={{ fill: "color-mix(in oklab, var(--rift-c) 55%, transparent)" }}
        />
        <rect
          x={18}
          y={58}
          width={5}
          height={2}
          style={{ fill: "color-mix(in oklab, var(--rift-b) 45%, transparent)" }}
        />

        <rect
          x={175}
          y={134}
          width={9}
          height={22}
          rx={1}
          style={{
            fill: "color-mix(in oklab, var(--rift-b) 10%, transparent)",
            stroke: "color-mix(in oklab, var(--rift-b) 38%, transparent)",
            strokeWidth: 0.7,
          }}
        />
        <rect
          x={177}
          y={137}
          width={5}
          height={4}
          rx={0.6}
          style={{ fill: "var(--rift-b)", animation: "rift-led 3.1s ease-in-out infinite 1.4s" }}
        />
        <rect
          x={177}
          y={144}
          width={5}
          height={2}
          style={{ fill: "color-mix(in oklab, var(--rift-c) 55%, transparent)" }}
        />
        <rect
          x={177}
          y={148}
          width={5}
          height={2}
          style={{ fill: "color-mix(in oklab, var(--rift-a) 45%, transparent)" }}
        />
      </svg>
    </div>
  );
}
