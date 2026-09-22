import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Profile } from "@/data/profiles";
import { PROFILES, RIFTS, type World } from "@/data/profiles";

/**
 * Social cards, rendered by satori at build time.
 *
 * The two worlds are split by the same 66° seam the site uses, and the card
 * carries only transcribed facts. Fonts are fetched from Google once per
 * build; if that fails the default font is used and the card still renders —
 * a broken social preview is not worth failing a build over.
 */

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 600 | 700;
  style: "normal";
};

/**
 * Fonts are vendored beside this module (latin subsets, ~60 KB total) rather
 * than fetched: a build must not depend on a font CDN being reachable. They
 * are read once per process, at build time, when the cards are rendered.
 */
const FONT_FILES: { file: string; name: string; weight: OgFont["weight"] }[] = [
  { file: "chakra-petch-700.woff", name: "Chakra Petch", weight: 700 },
  { file: "cinzel-600.woff", name: "Cinzel", weight: 600 },
  { file: "inter-400.woff", name: "Inter", weight: 400 },
];

let fontCache: OgFont[] | null = null;

export function ogFonts(): OgFont[] {
  if (fontCache) return fontCache;
  const directory = join(process.cwd(), "src/lib/fonts");
  fontCache = FONT_FILES.map((entry) => ({
    name: entry.name,
    weight: entry.weight,
    style: "normal" as const,
    data: readFileSync(join(directory, entry.file)),
  }));
  return fontCache;
}

const DISPLAY_BY_WORLD: Record<World, string> = {
  irvan: "Chakra Petch",
  enrico: "Cinzel",
};

type Tone = {
  ink: string;
  dim: string;
  accent: string;
  accent2: string;
  display: string;
};

const TONES: Record<World | "rift", Tone> = {
  irvan: {
    ink: "#eaf6ff",
    dim: "#8fb6cf",
    accent: RIFTS.irvan.a,
    accent2: RIFTS.irvan.b,
    display: DISPLAY_BY_WORLD.irvan,
  },
  enrico: {
    ink: "#fdf3e0",
    dim: "#c8b596",
    accent: RIFTS.enrico.a,
    accent2: RIFTS.enrico.b,
    display: DISPLAY_BY_WORLD.enrico,
  },
  rift: {
    ink: "#f2f7ff",
    dim: "#9fb2c8",
    accent: RIFTS.rift.a,
    accent2: RIFTS.rift.b,
    display: DISPLAY_BY_WORLD.irvan,
  },
};

/** Seam geometry in card pixels: 66° from horizontal, through the centre. */
const W = 1200;
const H = 630;
const SEAM_TOP = W * 0.564;
const SEAM_BOTTOM = W * 0.436;

/**
 * Each card is painted in one world's own ramp: near side, far side, and the
 * two accents the seam mixes between. Concrete hex, because the SVG is baked
 * into the PNG — CSS variables never reach it.
 */
const RAMP: Record<World, { near: [string, string]; far: [string, string]; void: string }> = {
  irvan: {
    near: [RIFTS.irvan.a, "#2f7bff"],
    far: [RIFTS.irvan.b, RIFTS.irvan.c],
    void: RIFTS.irvan.void,
  },
  enrico: {
    near: [RIFTS.enrico.b, "#1f7a4d"],
    far: [RIFTS.enrico.a, RIFTS.enrico.c],
    void: RIFTS.enrico.void,
  },
};

/**
 * The background is one SVG: the same seam equation the site uses, drawn
 * once. Satori renders SVG reliably, which rotated divs are not.
 */
function WorldLayers({ world }: { world: World | "rift" }) {
  const ramp = RAMP[world === "enrico" ? "enrico" : "irvan"];
  const left = { a: ramp.near[0], b: ramp.near[1] };
  const right = { a: ramp.far[0], b: ramp.far[1] };

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id="gridGlow" cx="0.2" cy="0.78" r="0.72">
          <stop offset="0%" stopColor={left.a} stopOpacity="0.8" />
          <stop offset="45%" stopColor={left.b} stopOpacity="0.3" />
          <stop offset="100%" stopColor={ramp.void} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="marchGlow" cx="0.88" cy="0.2" r="0.72">
          <stop offset="0%" stopColor={right.a} stopOpacity="0.7" />
          <stop offset="48%" stopColor={right.b} stopOpacity="0.28" />
          <stop offset="100%" stopColor={ramp.void} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="seamLine" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={left.b} />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={right.a} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={ramp.void} />

      <polygon
        points={`0,0 ${SEAM_TOP},0 ${SEAM_BOTTOM},${H} 0,${H}`}
        fill="url(#gridGlow)"
      />
      <g stroke={left.a} strokeOpacity="0.28" strokeWidth="1.5">
        <line x1="-40" y1="430" x2="1300" y2="430" />
        <line x1="-40" y1="500" x2="1300" y2="500" />
        <line x1="-40" y1="570" x2="1300" y2="570" />
        <line x1="180" y1="360" x2="180" y2="700" />
        <line x1="330" y1="360" x2="330" y2="700" />
        <line x1="480" y1="360" x2="480" y2="700" />
      </g>

      <polygon
        points={`${SEAM_TOP},0 ${W},0 ${W},${H} ${SEAM_BOTTOM},${H}`}
        fill="url(#marchGlow)"
      />
      <path
        d={`M${SEAM_BOTTOM + 40} ${H} Q ${W * 0.78} ${H * 0.62} ${W} ${H * 0.55} L ${W} ${H} Z`}
        fill="#101b13"
        fillOpacity="0.9"
      />
      <path
        d={`M${SEAM_TOP + 30} ${H} Q ${W * 0.86} ${H * 0.55} ${W} ${H * 0.44}`}
        fill="none"
        stroke={right.b}
        strokeOpacity="0.55"
        strokeWidth="2.5"
      />
      <circle cx={W * 0.86} cy={H * 0.24} r="42" fill={right.a} />

      <line
        x1={SEAM_BOTTOM}
        y1={H}
        x2={SEAM_TOP}
        y2={0}
        stroke={left.a}
        strokeOpacity="0.28"
        strokeWidth="18"
      />
      <line
        x1={SEAM_BOTTOM}
        y1={H}
        x2={SEAM_TOP}
        y2={0}
        stroke="url(#seamLine)"
        strokeWidth="5"
      />
    </svg>
  );
}

function Meta({ tone, label, value }: { tone: Tone; label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginRight: 34 }}>
      <div style={{ fontSize: 15, letterSpacing: 3, color: tone.dim, textTransform: "uppercase", display: "flex" }}>
        {label}
      </div>
      <div style={{ fontSize: 26, color: tone.ink, display: "flex" }}>{value}</div>
    </div>
  );
}

function shell(children: React.ReactNode, world: World | "rift") {
  const tone = TONES[world];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: RIFTS[world === "enrico" ? "enrico" : "irvan"].void,
        fontFamily: "Inter",
        color: tone.ink,
      }}
    >
      {children}
    </div>
  );
}

export function OgProfile({ profile }: { profile: Profile }) {
  const tone = TONES[profile.id];
  const current = profile.chronicle.find(
    (entry) => entry.kind === "role" && entry.endYear === null
  );

  return shell(
    <>
      <WorldLayers world={profile.id} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 16,
              height: 16,
              transform: "rotate(45deg)",
              background: tone.accent,
              marginRight: 18,
              display: "flex",
            }}
          />
          <div style={{ fontSize: 18, letterSpacing: 5, color: tone.accent, display: "flex" }}>
            {profile.world.code.toUpperCase()}
          </div>
          <div style={{ fontSize: 18, letterSpacing: 5, color: tone.dim, marginLeft: 18, display: "flex" }}>
            {profile.world.name.toUpperCase()} · {profile.world.coordinates}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
          <div
            style={{
              fontFamily: tone.display,
              fontWeight: profile.id === "irvan" ? 700 : 600,
              fontSize: profile.name.length > 20 ? 62 : 78,
              lineHeight: 1.04,
              color: tone.ink,
              display: "flex",
            }}
          >
            {profile.name}
          </div>
          <div style={{ fontSize: 30, color: tone.ink, marginTop: 18, display: "flex" }}>
            {profile.headline}
          </div>
          <div style={{ fontSize: 22, color: tone.dim, marginTop: 8, display: "flex" }}>
            {profile.location}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Meta
            tone={tone}
            label={profile.signals[0].label}
            value={profile.signals[0].value}
          />
          <Meta
            tone={tone}
            label={profile.signals[1].label}
            value={profile.signals[1].value}
          />
          <Meta
            tone={tone}
            label="Current"
            value={current ? current.org : profile.headline}
          />
        </div>
      </div>
    </>,
    profile.id
  );
}

export function OgHandoff() {
  const tone = TONES.rift;

  return shell(
    <>
      <WorldLayers world="rift" />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ fontSize: 18, letterSpacing: 5, color: tone.dim, display: "flex" }}>
          INFRASTRUCTURE ENGINEER · BACK-END DEVELOPER
        </div>

        <div
          style={{
            fontFamily: tone.display,
            fontWeight: 700,
            fontSize: 96,
            color: tone.ink,
            display: "flex",
          }}
        >
          Irvan ∕ Enrico
        </div>

        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 520, paddingRight: 40 }}>
            <div style={{ fontSize: 26, display: "flex" }}>
              {PROFILES.irvan.name}
            </div>
            <div style={{ fontSize: 20, color: tone.dim, marginTop: 6, display: "flex" }}>
              {PROFILES.irvan.headline}
            </div>
            <div style={{ fontSize: 17, color: tone.dim, marginTop: 4, display: "flex" }}>
              {PROFILES.irvan.world.coordinates}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: 520, paddingLeft: 40 }}>
            <div style={{ fontSize: 26, display: "flex" }}>
              {PROFILES.enrico.name}
            </div>
            <div style={{ fontSize: 20, color: tone.dim, marginTop: 6, display: "flex" }}>
              {PROFILES.enrico.headline}
            </div>
            <div style={{ fontSize: 17, color: tone.dim, marginTop: 4, display: "flex" }}>
              {PROFILES.enrico.world.coordinates}
            </div>
          </div>
        </div>
      </div>
    </>,
    "rift"
  );
}
