import { cn } from "cn"

/**
 * MarchSigil — an engraved astrolabe / compass-rose portrait emblem for the
 * "THE GREEN MARCH" world. Gold rings carry thirty-six punched rune ticks, a
 * compass rose crowns a graticule of great-circle meridians, and emerald nodes
 * mark where the mapping lines meet the outer ring.
 *
 * All geometry below is fixed literal data (no randomness, no time) so the
 * emblem is identical on the server and after hydration. Motion is expressed
 * only through the global `rift-*` keyframes, which the global reduced-motion
 * media query already neutralises.
 */

type Tick = readonly [number, number, number, number, number, number]
type Node2 = readonly [number, number]
type Line = readonly [number, number, number, number]

const GOLD = "var(--rift-a)"
const EMERALD = "var(--rift-b)"
const COPPER = "var(--rift-c)"

/** Outer ring: 36 punched marks (long sticks, short sticks, arcs and pin dots). */
const TICKS_A: readonly Tick[] = [
  [115.14, 14.12, 115.73, 10.78, 0.85, 0.5], [142.8, 25.87, 146.15, 20.07, 1.6, 0.85],
  [156.05, 33.2, 158.24, 30.6, 0.85, 0.5], [174.13, 57.2, 179.93, 53.85, 1.6, 0.85],
  [181.94, 70.18, 185.14, 69.01, 0.85, 0.5], [185.88, 115.14, 189.22, 115.73, 0.85, 0.5],
  [174.13, 142.8, 179.93, 146.15, 1.6, 0.85], [166.8, 156.05, 169.4, 158.24, 0.85, 0.5],
  [142.8, 174.13, 146.15, 179.93, 1.6, 0.85], [129.82, 181.94, 130.99, 185.14, 0.85, 0.5],
  [84.86, 185.88, 84.27, 189.22, 0.85, 0.5], [57.2, 174.13, 53.85, 179.93, 1.6, 0.85],
  [43.95, 166.8, 41.76, 169.4, 0.85, 0.5], [25.87, 142.8, 20.07, 146.15, 1.6, 0.85],
  [18.06, 129.82, 14.86, 130.99, 0.85, 0.5], [14.12, 84.86, 10.78, 84.27, 0.85, 0.5],
  [25.87, 57.2, 20.07, 53.85, 1.6, 0.85], [33.2, 43.95, 30.6, 41.76, 0.85, 0.5],
  [57.2, 25.87, 53.85, 20.07, 1.6, 0.85], [70.18, 18.06, 69.01, 14.86, 0.85, 0.5],
]

/** Outer ring: four engraved arc glyphs sitting between the ticks. */
const ARCS_A: readonly string[] = [
  "M 100 13.8 A 3.4 3.4 0 0 1 100 8.2", "M 186.2 100 A 3.4 3.4 0 0 1 191.8 100",
  "M 100 186.2 A 3.4 3.4 0 0 1 100 191.8", "M 13.8 100 A 3.4 3.4 0 0 1 8.2 100",
]

/** Outer ring: pin dots between the short ticks. */
const DOTS_A: readonly Node2[] = [
  [130.41, 16.46], [168.1, 42.86], [187.55, 84.56], [183.54, 130.41],
  [157.14, 168.1], [115.44, 187.55], [69.59, 183.54], [31.9, 157.14],
  [12.45, 115.44], [16.46, 69.59], [42.86, 31.9], [84.56, 12.45],
]

/** Counter-rotating inner ring: 24 finer graduation marks. */
const TICKS_B: readonly Tick[] = [
  [109.61, 27.03, 110.23, 22.27, 1.3, 0.8], [128.62, 30.89, 129.54, 28.68, 0.7, 0.42],
  [159.34, 54.46, 161.25, 53, 0.7, 0.42], [168, 71.83, 172.43, 70, 1.3, 0.8],
  [174.16, 90.24, 176.54, 89.92, 0.7, 0.42], [169.11, 128.62, 171.32, 129.54, 0.7, 0.42],
  [158.39, 144.8, 162.2, 147.73, 1.3, 0.8], [145.54, 159.34, 147, 161.25, 0.7, 0.42],
  [109.76, 174.16, 110.08, 176.54, 0.7, 0.42], [90.39, 172.97, 89.77, 177.73, 1.3, 0.8],
  [71.38, 169.11, 70.46, 171.32, 0.7, 0.42], [40.66, 145.54, 38.75, 147, 0.7, 0.42],
  [32, 128.17, 27.57, 130, 1.3, 0.8], [25.84, 109.76, 23.46, 110.08, 0.7, 0.42],
  [30.89, 71.38, 28.68, 70.46, 0.7, 0.42], [41.61, 55.2, 37.8, 52.27, 1.3, 0.8],
  [54.46, 40.66, 53, 38.75, 0.7, 0.42], [90.24, 25.84, 89.92, 23.46, 0.7, 0.42],
]

/** Counter-rotating inner ring: emerald micro-dots. */
const DOTS_B: readonly Node2[] = [
  [146.27, 39.71], [175.35, 109.92], [129.08, 170.21],
  [53.73, 160.29], [24.65, 90.08], [70.92, 29.79],
]

/** Graticule: four great-circle meridians meeting the outer ring (r = 86). */
const GRATICULE: readonly string[] = [
  "M 14 100 C 71.33 130 128.67 130 186 100", "M 14 100 C 71.33 70 128.67 70 186 100",
  "M 100 14 C 70 71.33 70 128.67 100 186", "M 100 14 C 130 71.33 130 128.67 100 186",
]

/** Graticule: the two measured (dashed) meridians. */
const GRATICULE_DASHED: readonly string[] = [
  "M 14 100 C 71.33 138 128.67 138 186 100",
  "M 100 14 C 62 71.33 62 128.67 100 186",
]

/** Compass rose: four long cardinal points. */
const ROSE_CARDINAL: readonly string[] = [
  "M 100 28 L 106 50 L 100 66 L 94 50 Z", "M 172 100 L 150 106 L 134 100 L 150 94 Z",
  "M 100 172 L 94 150 L 100 134 L 106 150 Z", "M 28 100 L 50 94 L 66 100 L 50 106 Z",
]

/** Compass rose: four short intercardinal points. */
const ROSE_INTERCARDINAL: readonly string[] = [
  "M 139.6 60.4 L 134.22 72 L 124.04 75.96 L 128 65.78 Z", "M 139.6 139.6 L 128 134.22 L 124.04 124.04 L 134.22 128 Z",
  "M 60.4 139.6 L 65.78 128 L 75.96 124.04 L 72 134.22 Z", "M 60.4 60.4 L 72 65.78 L 75.96 75.96 L 65.78 72 Z",
]

/** Compass rose: darker facets inset into the cardinal points. */
const FACETS_CARDINAL: readonly string[] = [
  "M 100 48 L 103.2 59 L 100 66 L 96.8 59 Z", "M 152 100 L 141 103.2 L 134 100 L 141 96.8 Z",
  "M 100 152 L 96.8 141 L 100 134 L 103.2 141 Z", "M 48 100 L 59 96.8 L 66 100 L 59 103.2 Z",
]

/** Compass rose: darker facets inset into the intercardinal points. */
const FACETS_INTERCARDINAL: readonly string[] = [
  "M 131.82 68.18 L 129.21 74.05 L 124.04 75.96 L 125.95 70.79 Z", "M 131.82 131.82 L 125.95 129.21 L 124.04 124.04 L 129.21 125.95 Z",
  "M 68.18 131.82 L 70.79 125.95 L 75.96 124.04 L 74.05 129.21 Z", "M 68.18 68.18 L 74.05 70.79 L 75.96 75.96 L 70.79 74.05 Z",
]

/** Compass rose: hairline highlight along each cardinal axis. */
const CARDINAL_AXIS: readonly Line[] = [
  [100, 66, 100, 27], [134, 100, 173, 100],
  [100, 134, 100, 173], [66, 100, 27, 100],
]

/** Emerald nodes where the graticule meets the outer ring. */
const NODES: readonly Node2[] = [
  [100, 14], [186, 100],
  [100, 186], [14, 100],
]

/** Corner leaf/rune flourishes, placed on the diagonals outside the ring. */
const FLOURISH: readonly string[] = [
  "translate(30.7 30.7) rotate(-135)", "translate(169.3 30.7) rotate(-45)",
  "translate(169.3 169.3) rotate(45)", "translate(30.7 169.3) rotate(135)",
]

export interface MarchSigilProps {
  initials: string
  className?: string
  label?: string
}

export function MarchSigil({ initials, className, label }: MarchSigilProps) {
  const glyph = initials.trim().toUpperCase()
  const glyphSize = glyph.length > 2 ? 27 : glyph.length === 1 ? 56 : 40

  return (
    <div
      className={cn("relative aspect-square", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" focusable="false">
        <defs>
          <radialGradient id="msig-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.16" />
            <stop offset="58%" stopColor={COPPER} stopOpacity="0.07" />
            <stop offset="100%" stopColor={COPPER} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="msig-roundel" cx="50%" cy="42%" r="64%">
            <stop offset="0%" stopColor={COPPER} stopOpacity="0.52" />
            <stop offset="56%" stopColor={COPPER} stopOpacity="0.32" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0.16" />
          </radialGradient>
        </defs>

        {/* soft cast of light behind the instrument */}
        <circle cx="100" cy="100" r="96" fill="url(#msig-halo)" />

        {/* engraved base plate: latitude hairlines */}
        <g fill="none">
          <circle cx="100" cy="100" r="68" stroke={GOLD} strokeOpacity="0.22" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="60" stroke={COPPER} strokeOpacity="0.28" strokeWidth="0.4" strokeDasharray="1 4" />
          <circle cx="100" cy="100" r="50" stroke={COPPER} strokeOpacity="0.2" strokeWidth="0.35" strokeDasharray="2 6" />
        </g>

        {/* outer ring pair — slow orbit */}
        <g
          fill="none"
          style={{
            transformOrigin: "100px 100px",
            transformBox: "view-box",
            animation: "rift-orbit 80s linear infinite",
          }}
        >
          <circle cx="100" cy="100" r="92" stroke={GOLD} strokeOpacity="0.72" strokeWidth="0.7" />
          <circle cx="100" cy="100" r="86" stroke={GOLD} strokeOpacity="0.45" strokeWidth="0.5" />
          {TICKS_A.map(([x1, y1, x2, y2, w, o]) => (
            <line
              key={`ta-${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={GOLD}
              strokeOpacity={o}
              strokeWidth={w}
              strokeLinecap="round"
            />
          ))}
          {ARCS_A.map((d) => (
            <path key={d} d={d} stroke={GOLD} strokeOpacity="0.66" strokeWidth="0.8" strokeLinecap="round" />
          ))}
          {DOTS_A.map(([x, y]) => (
            <circle key={`da-${x}-${y}`} cx={x} cy={y} r="0.85" fill={GOLD} fillOpacity="0.6" stroke="none" />
          ))}
        </g>

        {/* inner ring pair — counter-rotating */}
        <g
          fill="none"
          style={{
            transformOrigin: "100px 100px",
            transformBox: "view-box",
            animation: "rift-orbit 80s linear infinite",
            animationDirection: "reverse",
          }}
        >
          <circle cx="100" cy="100" r="78" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.55" />
          <circle cx="100" cy="100" r="74" stroke={EMERALD} strokeOpacity="0.3" strokeWidth="0.45" />
          {TICKS_B.map(([x1, y1, x2, y2, w, o]) => (
            <line
              key={`tb-${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={GOLD}
              strokeOpacity={o}
              strokeWidth={w}
              strokeLinecap="round"
            />
          ))}
          {DOTS_B.map(([x, y]) => (
            <circle key={`db-${x}-${y}`} cx={x} cy={y} r="0.7" fill={EMERALD} fillOpacity="0.55" stroke="none" />
          ))}
        </g>

        {/* graticule: great-circle meridians (endpoints on the outer ring) */}
        <g fill="none">
          {GRATICULE.map((d) => (
            <path key={d} d={d} stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.55" />
          ))}
        </g>

        {/* emerald nodes on the outer ring */}
        {NODES.map(([x, y], i) => (
          <g key={`nd-${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r="3.8"
              fill="none"
              stroke={EMERALD}
              strokeOpacity="0.42"
              strokeWidth="0.5"
            />
            <circle
              cx={x}
              cy={y}
              r="1.8"
              fill={EMERALD}
              fillOpacity="0.95"
              style={{ animation: `rift-pulse ${2.6 + i * 0.4}s ease-in-out infinite ${i * 0.55}s` }}
            />
          </g>
        ))}

        {/* compass rose */}
        <g>
          {ROSE_CARDINAL.map((d) => (
            <path
              key={d}
              d={d}
              fill={GOLD}
              fillOpacity="0.76"
              stroke={COPPER}
              strokeOpacity="0.55"
              strokeWidth="0.45"
            />
          ))}
          {ROSE_INTERCARDINAL.map((d) => (
            <path
              key={d}
              d={d}
              fill={GOLD}
              fillOpacity="0.5"
              stroke={COPPER}
              strokeOpacity="0.45"
              strokeWidth="0.4"
            />
          ))}
          {FACETS_CARDINAL.map((d) => (
            <path key={d} d={d} fill={COPPER} fillOpacity="0.72" />
          ))}
          {FACETS_INTERCARDINAL.map((d) => (
            <path key={d} d={d} fill={GOLD} fillOpacity="0.34" />
          ))}
          {CARDINAL_AXIS.map(([x1, y1, x2, y2]) => (
            <line
              key={`cx-${x1}-${y1}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={GOLD}
              strokeOpacity="0.92"
              strokeWidth="0.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* the two *measured* meridians: dashed emerald survey lines */}
        <g fill="none">
          {GRATICULE_DASHED.map((d, i) => (
            <path
              key={d}
              d={d}
              stroke={EMERALD}
              strokeOpacity="0.85"
              strokeWidth="0.95"
              strokeDasharray={i === 0 ? "2 8" : "3.5 6.5"}
              style={{ animation: `rift-dash ${22 + i * 8}s linear infinite` }}
            />
          ))}
        </g>

        {/* corner leaf/rune flourishes */}
        <g fill="none" stroke={COPPER} strokeOpacity="0.52" strokeWidth="0.9" strokeLinecap="round">
          {FLOURISH.map((t) => (
            <g key={t} transform={t}>
              <path d="M 0 0 C 9 -1 18 -5 26 -11" />
              <path d="M 7 -1 C 12 -8 19 -12 25 -10" />
              <path d="M 10 -4 C 6 -12 8 -18 13 -21" />
              <circle cx="0" cy="0" r="1.4" fill={EMERALD} fillOpacity="0.6" stroke="none" />
            </g>
          ))}
        </g>

        {/* centre roundel */}
        <circle cx="100" cy="100" r="36" fill="url(#msig-roundel)" />
        <circle cx="100" cy="100" r="36" fill="none" stroke={GOLD} strokeOpacity="0.8" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="32.5" fill="none" stroke={COPPER} strokeOpacity="0.55" strokeWidth="0.45" />
        <circle
          cx="100"
          cy="100"
          r="29"
          fill="none"
          stroke={GOLD}
          strokeOpacity="0.22"
          strokeWidth="0.4"
          strokeDasharray="1 5"
        />
        <text
          x="101.5"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={glyphSize}
          fill={GOLD}
          fillOpacity="0.95"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
        >
          {glyph}
        </text>
      </svg>
    </div>
  )
}
