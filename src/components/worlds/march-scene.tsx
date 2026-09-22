import type { CSSProperties } from "react";
import { cn } from "cn";

/**
 * THE GREEN MARCH — full-bleed procedural backdrop scene.
 *
 * A warm storybook-fantasy valley for the back-end world: layered dusk sky,
 * receding ridges, a horizon citadel, drifting sky-islands and a foreground of
 * mushrooms and grass. Beneath the illustration runs the *systems* undercurrent
 * — a ley-line graph stitching the islands together, dashed flows, travelling
 * motes and breathing node rings. No text, no randomness: every position is a
 * literal, every motion is one of the global keyframes.
 */

type Ember = {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
  drift: number;
};

type Island = {
  x: number;
  y: number;
  s: number;
  dur: number;
  delay: number;
  tree: boolean;
};

type Tower = {
  pts: string;
  w: number;
};

type Mushroom = {
  x: number;
  y: number;
  s: number;
  dur: number;
  delay: number;
};

type Cluster = {
  x: number;
  y: number;
  s: number;
  dur: number;
  delay: number;
};

const ISLAND_BODY =
  "M-74 0 C-78 26 -44 48 0 48 C44 48 78 26 74 0 C50 -15 -50 -15 -74 0 Z";
const ISLAND_LIP = "M-72 -1 C-48 -14 48 -14 72 -1";
const ISLAND_ROOT = "M-17 44 C-11 72 -5 100 1 126 C8 98 11 70 15 44 Z";
const ISLAND_TREE_TRUNK = "M0 4 C-2 -10 -3 -20 -2 -30";
const ISLAND_TREE_CANOPY =
  "M-2 -26 C-18 -27 -23 -45 -4 -52 C3 -67 25 -62 23 -45 C36 -38 27 -23 5 -26 Z";

const ISLANDS: Island[] = [
  { x: 236, y: 262, s: 1.12, dur: 7.4, delay: 0, tree: true },
  { x: 520, y: 196, s: 0.78, dur: 9.2, delay: 1.6, tree: true },
  { x: 892, y: 226, s: 0.94, dur: 8.1, delay: 0.7, tree: true },
  { x: 1196, y: 320, s: 1.18, dur: 6.8, delay: 2.3, tree: true },
  { x: 690, y: 372, s: 0.66, dur: 10.4, delay: 3.1, tree: false },
];

const TOWERS: Tower[] = [
  { pts: "598 516 594 396 610 366 626 398 622 516", w: 0 },
  { pts: "634 516 630 424 644 402 658 426 654 516", w: 1 },
  { pts: "664 516 660 356 682 316 704 360 700 516", w: 2 },
  { pts: "712 516 708 408 722 386 736 410 732 516", w: 3 },
  { pts: "748 516 744 442 756 422 768 444 764 516", w: 4 },
];

const WINDOWS: { x: number; y: number; delay: number }[] = [
  { x: 603, y: 424, delay: 0.2 },
  { x: 612, y: 452, delay: 0.9 },
  { x: 640, y: 440, delay: 0.5 },
  { x: 648, y: 468, delay: 1.3 },
  { x: 672, y: 380, delay: 0.35 },
  { x: 690, y: 430, delay: 0.75 },
  { x: 680, y: 468, delay: 1.6 },
  { x: 716, y: 442, delay: 0.15 },
];

const NODES: { x: number; y: number; delay: number }[] = [
  { x: 236, y: 296, delay: 0 },
  { x: 520, y: 232, delay: 0.8 },
  { x: 892, y: 262, delay: 1.5 },
  { x: 1196, y: 356, delay: 0.4 },
  { x: 690, y: 404, delay: 2.1 },
];

const LEY_LINES: { d: string; dur: number; delay: number }[] = [
  { d: "M236 296 Q378 226 520 232", dur: 13, delay: 0 },
  { d: "M520 232 Q706 150 892 262", dur: 16, delay: 1.1 },
  { d: "M892 262 Q1046 232 1196 356", dur: 14.5, delay: 2.4 },
  { d: "M1196 356 Q942 456 690 404", dur: 18, delay: 0.6 },
  { d: "M690 404 Q426 434 236 296", dur: 15.5, delay: 1.8 },
  { d: "M520 232 Q606 352 690 404", dur: 12.5, delay: 3.0 },
];

const MOTES: { d: string; dur: number; delay: number }[] = [
  { d: "M520 232 Q706 150 892 262", dur: 5.6, delay: 0.4 },
  { d: "M1196 356 Q942 456 690 404", dur: 6.8, delay: 1.7 },
];

const MUSHROOMS: Mushroom[] = [
  { x: 118, y: 846, s: 1.0, dur: 6.4, delay: 0 },
  { x: 196, y: 864, s: 0.7, dur: 7.6, delay: 1.2 },
  { x: 1010, y: 872, s: 0.62, dur: 8.4, delay: 2.0 },
  { x: 1182, y: 838, s: 1.16, dur: 5.8, delay: 0.7 },
  { x: 1276, y: 862, s: 0.82, dur: 7.1, delay: 1.9 },
  { x: 374, y: 886, s: 0.9, dur: 6.9, delay: 2.6 },
];

const CLUSTERS: Cluster[] = [
  { x: 62, y: 862, s: 1.0, dur: 5.2, delay: 0 },
  { x: 306, y: 884, s: 0.82, dur: 6.3, delay: 1.4 },
  { x: 930, y: 870, s: 1.08, dur: 5.9, delay: 0.6 },
  { x: 1348, y: 876, s: 0.94, dur: 6.8, delay: 2.2 },
];

const EMBERS: Ember[] = [
  { x: 322, y: 782, r: 2.4, dur: 9.0, delay: 0, drift: 26 },
  { x: 420, y: 832, r: 1.8, dur: 11.0, delay: 1.4, drift: -18 },
  { x: 542, y: 762, r: 2.8, dur: 8.0, delay: 2.6, drift: 34 },
  { x: 660, y: 848, r: 1.6, dur: 12.0, delay: 0.8, drift: -24 },
  { x: 762, y: 800, r: 2.2, dur: 10.0, delay: 3.4, drift: 14 },
  { x: 882, y: 858, r: 2.0, dur: 9.5, delay: 1.9, drift: -30 },
  { x: 1004, y: 774, r: 2.6, dur: 8.6, delay: 4.2, drift: 22 },
  { x: 1110, y: 830, r: 1.7, dur: 12.5, delay: 2.2, drift: -12 },
  { x: 1222, y: 794, r: 2.3, dur: 10.6, delay: 5.0, drift: 30 },
  { x: 178, y: 808, r: 2.1, dur: 11.4, delay: 3.0, drift: -20 },
];

const BLADES = [
  "M0 0 C-6 -32 -14 -50 -25 -68",
  "M2 0 C0 -36 -4 -58 -8 -84",
  "M4 0 C8 -30 10 -46 18 -62",
  "M-2 0 C-16 -26 -28 -38 -42 -46",
  "M3 0 C14 -34 24 -52 40 -60",
];

const GLYPHS = [
  "M0 18 L0 0 M-5 6 L5 6",
  "M0 18 A9 9 0 0 1 1 -1",
  "M-1 0 L7 10 L-1 18",
  "M0 18 L0 2 L8 12",
  "M-6 18 L6 0 M-6 0 L6 18",
  "M0 0 A9 9 0 0 0 0 18 M-4 9 L4 9",
  "M-6 16 L0 0 L6 16",
  "M0 0 L0 18 M-4 4 L4 12",
  "M-6 2 L6 2 L-6 16 L6 16",
  "M0 10 L0 18 M0 4 L0 6",
];

const emberStyle = (e: Ember): CSSProperties =>
  ({
    animation: `rift-ember ${e.dur}s linear infinite ${e.delay}s`,
    "--drift-x": `${e.drift}px`,
  }) as CSSProperties;

const swayStyle = (deg: number) =>
  ({ animation: `rift-sway ${deg}s ease-in-out infinite` }) as CSSProperties;

export function MarchScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="ms-sky-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--rift-a)" stopOpacity={0.3} />
            <stop offset="0.6" stopColor="var(--rift-c)" stopOpacity={0.22} />
            <stop offset="1" stopColor="var(--rift-c)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="ms-sky-2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--rift-c)" stopOpacity={0} />
            <stop offset="0.45" stopColor="var(--rift-c)" stopOpacity={0.24} />
            <stop offset="1" stopColor="var(--rift-b)" stopOpacity={0.16} />
          </linearGradient>
          <linearGradient id="ms-sky-3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--rift-b)" stopOpacity={0} />
            <stop offset="0.5" stopColor="var(--rift-b)" stopOpacity={0.18} />
            <stop offset="1" stopColor="var(--void)" stopOpacity={0.96} />
          </linearGradient>
          <radialGradient id="ms-sun">
            <stop offset="0" stopColor="var(--rift-a)" stopOpacity={0.95} />
            <stop offset="0.3" stopColor="var(--rift-c)" stopOpacity={0.5} />
            <stop offset="0.68" stopColor="var(--rift-c)" stopOpacity={0.14} />
            <stop offset="1" stopColor="var(--rift-c)" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="ms-vig-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--void)" stopOpacity={0.72} />
            <stop offset="1" stopColor="var(--void)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ms-vig-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--void)" stopOpacity={0} />
            <stop offset="1" stopColor="var(--void)" stopOpacity={0.82} />
          </linearGradient>
          <linearGradient id="ms-vig-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--void)" stopOpacity={0.6} />
            <stop offset="0.28" stopColor="var(--void)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ms-vig-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--void)" stopOpacity={0} />
            <stop offset="0.72" stopColor="var(--void)" stopOpacity={0} />
            <stop offset="1" stopColor="var(--void)" stopOpacity={0.62} />
          </linearGradient>
          <linearGradient id="ms-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--rift-c)" stopOpacity={0.95} />
            <stop offset="1" stopColor="var(--rift-b)" stopOpacity={0.55} />
          </linearGradient>
          <linearGradient id="ms-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--rift-c)" stopOpacity={0} />
            <stop offset="0.5" stopColor="var(--rift-c)" stopOpacity={0.2} />
            <stop offset="1" stopColor="var(--rift-c)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* ── 1. sky wash ─────────────────────────────────────────────── */}
        <rect x="0" y="0" width="1440" height="900" fill="var(--void)" />
        <rect x="0" y="0" width="1440" height="430" fill="url(#ms-sky-1)" />
        <rect x="0" y="300" width="1440" height="330" fill="url(#ms-sky-2)" />
        <rect x="0" y="500" width="1440" height="400" fill="url(#ms-sky-3)" />

        <circle
          cx="392"
          cy="424"
          r="212"
          fill="url(#ms-sun)"
          style={{ animation: "rift-pulse 7.6s ease-in-out infinite" }}
        />
        <circle
          cx="392"
          cy="424"
          r="56"
          fill="var(--rift-a)"
          style={{ animation: "rift-pulse 7.6s ease-in-out infinite 1.2s" }}
        />

        {/* cloud slivers */}
        <g opacity="0.5">
          <path
            d="M180 250 C240 236 316 240 372 252 C320 262 232 262 180 250 Z"
            fill="color-mix(in oklab, var(--rift-a) 16%, transparent)"
          />
          <path
            d="M760 186 C826 172 916 176 978 190 C916 202 818 202 760 186 Z"
            fill="color-mix(in oklab, var(--rift-c) 14%, transparent)"
          />
          <path
            d="M1040 300 C1096 290 1168 292 1216 302 C1166 312 1094 312 1040 300 Z"
            fill="color-mix(in oklab, var(--rift-a) 12%, transparent)"
          />
        </g>

        {/* horizon haze */}
        <rect x="0" y="418" width="1440" height="96" fill="url(#ms-haze)" />

        {/* ── 2. receding ridges ──────────────────────────────────────── */}
        <path
          d="M0 486 C180 448 320 500 470 468 C620 436 762 498 932 474 C1102 452 1244 500 1440 468 L1440 900 L0 900 Z"
          fill="color-mix(in oklab, var(--rift-b) 20%, var(--void))"
        />
        <path
          d="M0 486 C180 448 320 500 470 468 C620 436 762 498 932 474 C1102 452 1244 500 1440 468"
          fill="none"
          stroke="color-mix(in oklab, var(--rift-a) 34%, transparent)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "rift-pulse 9s ease-in-out infinite" }}
        />
        <path
          d="M0 568 C160 522 300 588 470 552 C640 516 782 594 962 560 C1142 526 1292 592 1440 556 L1440 900 L0 900 Z"
          fill="color-mix(in oklab, var(--rift-b) 12%, var(--void))"
        />
        <path
          d="M0 568 C160 522 300 588 470 552 C640 516 782 594 962 560 C1142 526 1292 592 1440 556"
          fill="none"
          stroke="color-mix(in oklab, var(--rift-a) 30%, transparent)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "rift-pulse 11s ease-in-out infinite 0.8s" }}
        />
        <path
          d="M0 674 C200 620 380 704 562 662 C744 620 900 710 1092 668 C1252 634 1362 704 1440 674 L1440 900 L0 900 Z"
          fill="color-mix(in oklab, var(--rift-c) 7%, var(--void))"
        />
        <path
          d="M0 674 C200 620 380 704 562 662 C744 620 900 710 1092 668 C1252 634 1362 704 1440 674"
          fill="none"
          stroke="color-mix(in oklab, var(--rift-a) 26%, transparent)"
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
          style={{ animation: "rift-pulse 8.2s ease-in-out infinite 1.6s" }}
        />

        {/* ── 3. horizon citadel ──────────────────────────────────────── */}
        <g>
          <g opacity="0.4">
            <path
              d="M520 516 L520 462 L556 440 L592 462 L592 516 Z"
              fill="color-mix(in oklab, var(--void) 70%, var(--rift-b))"
            />
            <path
              d="M842 516 L842 470 L874 452 L906 470 L906 516 Z"
              fill="color-mix(in oklab, var(--void) 70%, var(--rift-b))"
            />
          </g>
          {TOWERS.map((t) => (
            <g key={t.pts}>
              <polygon
                points={t.pts}
                fill={
                  t.w === 2
                    ? "color-mix(in oklab, var(--rift-c) 12%, var(--void))"
                    : "color-mix(in oklab, var(--rift-b) 8%, var(--void))"
                }
                stroke="color-mix(in oklab, var(--rift-a) 26%, transparent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          <path
            d="M682 316 L682 276"
            stroke="color-mix(in oklab, var(--rift-a) 60%, transparent)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M644 402 L644 372"
            stroke="color-mix(in oklab, var(--rift-a) 50%, transparent)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <g style={{ transformOrigin: "682px 278px" }}>
            <path
              d="M682 278 L712 286 L682 302 Z"
              fill="color-mix(in oklab, var(--rift-c) 62%, transparent)"
              style={swayStyle(6.4)}
            />
          </g>
          <g style={{ transformOrigin: "644px 372px" }}>
            <path
              d="M644 372 L670 379 L644 393 Z"
              fill="color-mix(in oklab, var(--rift-b) 58%, transparent)"
              style={swayStyle(7.8)}
            />
          </g>
          {WINDOWS.map((w) => (
            <rect
              key={`${w.x}-${w.y}`}
              x={w.x}
              y={w.y}
              width="3"
              height="5"
              rx="0.5"
              fill="var(--rift-a)"
              style={{
                animation: `rift-led ${3.4 + w.delay}s ease-in-out infinite ${w.delay}s`,
              }}
            />
          ))}
        </g>

        {/* ── 4. floating islands ─────────────────────────────────────── */}
        {ISLANDS.map((island) => (
          <g key={`${island.x}-${island.y}`} transform={`translate(${island.x} ${island.y})`}>
            <g
              style={{
                animation: `rift-float ${island.dur}s ease-in-out infinite ${island.delay}s`,
              }}
            >
              <g transform={`scale(${island.s})`}>
                <path
                  d={ISLAND_ROOT}
                  fill="color-mix(in oklab, var(--rift-c) 12%, var(--void))"
                  opacity="0.75"
                />
                <path
                  d={ISLAND_BODY}
                  fill={
                    island.s > 1
                      ? "color-mix(in oklab, var(--rift-b) 22%, var(--void))"
                      : "color-mix(in oklab, var(--rift-b) 14%, var(--void))"
                  }
                />
                <path
                  d={ISLAND_LIP}
                  fill="none"
                  stroke="color-mix(in oklab, var(--rift-a) 48%, transparent)"
                  strokeWidth="1.1"
                  vectorEffect="non-scaling-stroke"
                />
                {island.tree ? (
                  <g>
                    <path
                      d={ISLAND_TREE_TRUNK}
                      fill="none"
                      stroke="color-mix(in oklab, var(--rift-c) 55%, var(--void))"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={ISLAND_TREE_CANOPY}
                      fill="color-mix(in oklab, var(--rift-b) 40%, transparent)"
                      stroke="color-mix(in oklab, var(--rift-a) 30%, transparent)"
                      strokeWidth="0.9"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                ) : null}
              </g>
            </g>
          </g>
        ))}

        {/* ── 5. ley-line undercurrent ────────────────────────────────── */}
        <g fill="none" strokeLinecap="round">
          {LEY_LINES.map((line) => (
            <path
              key={line.d}
              d={line.d}
              pathLength={1000}
              stroke="color-mix(in oklab, var(--rift-b) 52%, transparent)"
              strokeWidth="1.1"
              strokeDasharray="7 20"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `rift-dash ${line.dur}s linear infinite ${line.delay}s`,
              }}
            />
          ))}
          {LEY_LINES.map((line) => (
            <path
              key={`halo-${line.d}`}
              d={line.d}
              pathLength={1000}
              stroke="color-mix(in oklab, var(--rift-a) 18%, transparent)"
              strokeWidth="3.2"
              strokeDasharray="3 30"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `rift-pulse ${line.dur}s ease-in-out infinite ${line.delay}s` }}
            />
          ))}
          {MOTES.map((mote) => (
            <path
              key={`mote-${mote.d}`}
              d={mote.d}
              pathLength={1000}
              stroke="var(--rift-a)"
              strokeWidth="2.4"
              strokeDasharray="14 986"
              vectorEffect="non-scaling-stroke"
              opacity="0.9"
              style={{
                animation: `rift-dash ${mote.dur}s linear infinite ${mote.delay}s`,
              }}
            />
          ))}
        </g>
        {NODES.map((node) => (
          <g key={`node-${node.x}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="9"
              fill="none"
              stroke="color-mix(in oklab, var(--rift-a) 55%, transparent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `rift-pulse ${5 + node.delay}s ease-in-out infinite ${node.delay}s`,
              }}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="3.4"
              fill="none"
              stroke="color-mix(in oklab, var(--rift-b) 60%, transparent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={node.x} cy={node.y} r="1.3" fill="var(--rift-a)" />
          </g>
        ))}

        {/* ── 6. foreground ───────────────────────────────────────────── */}
        <path
          d="M0 782 C220 758 430 800 660 786 C900 772 1130 806 1440 780 L1440 900 L0 900 Z"
          fill="color-mix(in oklab, var(--rift-c) 5%, var(--void))"
          opacity="0.9"
        />

        {CLUSTERS.map((c) => (
          <g key={`grass-${c.x}`} transform={`translate(${c.x} ${c.y})`}>
            <g
              style={{
                animation: `rift-sway ${c.dur}s ease-in-out infinite ${c.delay}s`,
                transformOrigin: "0px 0px",
              }}
            >
              <g transform={`scale(${c.s})`}>
                {BLADES.map((blade, i) => (
                  <path
                    key={blade}
                    d={blade}
                    fill="none"
                    stroke={
                      i % 2 === 0
                        ? "color-mix(in oklab, var(--rift-b) 62%, transparent)"
                        : "color-mix(in oklab, var(--rift-c) 52%, transparent)"
                    }
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            </g>
          </g>
        ))}

        {MUSHROOMS.map((m, i) => (
          <g key={`shroom-${m.x}`} transform={`translate(${m.x} ${m.y})`}>
            <g
              style={
                i % 2 === 0
                  ? {
                      animation: `rift-sway ${m.dur}s ease-in-out infinite ${m.delay}s`,
                      transformOrigin: "0px 34px",
                    }
                  : undefined
              }
            >
              <g transform={`scale(${m.s})`}>
                <rect
                  x="-5"
                  y="-4"
                  width="10"
                  height="38"
                  rx="4"
                  fill="color-mix(in oklab, var(--rift-a) 42%, var(--void))"
                />
                <path
                  d="M-23 0 C-23 -17 -9 -28 0 -28 C9 -28 23 -17 23 0 Z"
                  fill="url(#ms-cap)"
                  stroke="color-mix(in oklab, var(--rift-a) 55%, transparent)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M-23 0 C-12 5 12 5 23 0"
                  fill="none"
                  stroke="color-mix(in oklab, var(--rift-a) 40%, transparent)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="-9" cy="-14" r="2.3" fill="var(--rift-a)" opacity="0.85" />
                <circle cx="7" cy="-18" r="1.8" fill="var(--rift-a)" opacity="0.7" />
                <circle cx="-1" cy="-8" r="1.4" fill="var(--rift-a)" opacity="0.6" />
              </g>
            </g>
          </g>
        ))}

        {/* ── 7. atmosphere ───────────────────────────────────────────── */}
        {EMBERS.map((e) => (
          <circle
            key={`ember-${e.x}-${e.y}`}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill={e.drift > 0 ? "var(--rift-a)" : "var(--rift-c)"}
            style={emberStyle(e)}
          />
        ))}

        <g
          transform="translate(148 748)"
          fill="none"
          stroke="color-mix(in oklab, var(--rift-a) 60%, transparent)"
          strokeWidth="1"
          strokeLinecap="round"
          style={{ animation: "rift-glyph 8.4s ease-in-out infinite" }}
        >
          {GLYPHS.map((g, i) => (
            <path key={g} d={g} transform={`translate(${i * 27} 0)`} />
          ))}
        </g>
        <g
          transform="translate(1186 196)"
          fill="none"
          stroke="color-mix(in oklab, var(--rift-c) 45%, transparent)"
          strokeWidth="0.9"
          strokeLinecap="round"
          style={{ animation: "rift-glyph 11.2s ease-in-out infinite 2.4s" }}
        >
          {GLYPHS.slice(0, 7).map((g, i) => (
            <path key={g} d={g} transform={`translate(${i * 24} 0)`} />
          ))}
        </g>

        <rect x="0" y="0" width="1440" height="260" fill="url(#ms-vig-top)" />
        <rect x="0" y="620" width="1440" height="280" fill="url(#ms-vig-bottom)" />
        <rect x="0" y="0" width="360" height="900" fill="url(#ms-vig-left)" />
        <rect x="1080" y="0" width="360" height="900" fill="url(#ms-vig-right)" />
      </svg>

      <div className="scanlines absolute inset-0 opacity-[0.18]" />
      <div className="rift-grain absolute inset-0" />
    </div>
  );
}
