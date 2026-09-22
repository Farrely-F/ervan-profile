import { Panel } from "@/components/ui/panel";
import { Reveal, Stagger, StaggerItem } from "@/components/story/reveal";
import type { Profile, World } from "@/data/profiles";

function Seal({ tone }: { tone: World }) {
  const ticks = Array.from({ length: 24 }, (_, index) => index * 15);
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="size-16 shrink-0 sm:size-20"
    >
      <g
        style={{
          transformBox: "fill-box",
          transformOrigin: "center",
          animation: `rift-orbit ${tone === "irvan" ? 52 : 78}s linear infinite`,
        }}
      >
        {ticks.map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="6"
            x2="50"
            y2={angle % 45 === 0 ? "14" : "11"}
            transform={`rotate(${angle} 50 50)`}
            stroke="var(--rift-a)"
            strokeOpacity={angle % 45 === 0 ? 0.9 : 0.4}
            strokeWidth="0.8"
          />
        ))}
      </g>
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="var(--rift-a)"
        strokeOpacity="0.55"
        strokeWidth="0.8"
      />
      <circle
        cx="50"
        cy="50"
        r="26"
        fill="none"
        stroke="var(--rift-b)"
        strokeOpacity="0.5"
        strokeWidth="0.8"
        strokeDasharray="3 5"
        style={{ animation: "rift-dash 14s linear infinite" }}
      />
      <path
        d="M50 34 L64 50 L50 66 L36 50 Z"
        fill="none"
        stroke="var(--rift-c)"
        strokeOpacity="0.8"
        strokeWidth="0.9"
      />
      <path
        d="M50 42 L58 50 L50 58 L42 50 Z"
        fill="var(--rift-a)"
        fillOpacity="0.25"
        stroke="var(--rift-a)"
        strokeWidth="0.8"
      />
      {tone === "enrico" ? (
        <path
          d="M50 20 C58 28 58 34 50 42 C42 34 42 28 50 20 Z"
          fill="var(--rift-b)"
          fillOpacity="0.22"
          stroke="var(--rift-b)"
          strokeWidth="0.7"
        />
      ) : (
        <path
          d="M50 12 L56 20 L50 28 L44 20 Z"
          fill="var(--rift-a)"
          fillOpacity="0.22"
          stroke="var(--rift-a)"
          strokeWidth="0.7"
        />
      )}
    </svg>
  );
}

/**
 * PROOF — certifications and schools. Issuing bodies, fields and dates are
 * exactly what the export lists; the seals are the site's own art.
 */
export function ProofDeck({
  profile,
}: {
  profile: Profile;
}) {
  return (
    <>
      <Stagger className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {profile.proof.map((item) => (
          <StaggerItem key={item.id} className="h-full">
            <Panel
              tone={profile.id === "irvan" ? "tech" : "codex"}
              className="h-full"
              innerClassName="relative flex h-full flex-col p-6 sm:p-7"
            >
                <div className="flex items-start justify-between gap-4">
                  {item.issuer && item.issuer.length <= 8 ? (
                    <span className="display chroma text-4xl text-foreground sm:text-5xl">
                      {item.issuer}
                    </span>
                  ) : (
                    <span className="hud border border-rift-a/40 px-2 py-1 text-rift-a">
                      credential
                    </span>
                  )}
                  <Seal tone={profile.id} />
                </div>

                <h3 className="display mt-6 text-lg leading-tight text-foreground sm:text-xl">
                  {item.name}
                </h3>
                {item.field ? (
                  <p className="mt-2 text-sm text-rift-a">{item.field}</p>
                ) : null}
                <p className="hud mt-4 text-muted-foreground/70">{item.detail}</p>

                <div className="mt-6 flex items-center gap-2">
                  <span
                    className="size-1.5 rotate-45 bg-rift-a"
                    style={{
                      animation: "rift-led 3.2s ease-in-out infinite 0.2s",
                    }}
                  />
                  <span className="hud text-muted-foreground/60">
                    on the record
                  </span>
                </div>
            </Panel>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal delay={0.1}>
        <p className="hud mt-6 text-muted-foreground/60">
          {profile.copy.proof.footnote}
        </p>
      </Reveal>
    </>
  );
}
