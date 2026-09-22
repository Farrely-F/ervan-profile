"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { cn } from "cn";
import { PROFILES, type World } from "@/data/profiles";
import { RiftCanvas } from "@/components/rift/rift-canvas";
import { Watermark } from "@/components/shell/watermark";
import { WorldLink } from "@/components/rift/rift-transition";
import { SCENES, SIGILS } from "@/components/worlds/scene-registry";
import { seamClips, seamTransform } from "@/lib/seam";

const STEEP = 66;
const SHALLOW = 30;
const LEAN = 0.19;

const SLOT: Record<World, string> = {
  irvan:
    "items-start justify-start text-left [&>*]:max-w-md sm:[&>*]:max-w-lg",
  enrico: "items-end justify-end text-right [&>*]:max-w-md sm:[&>*]:max-w-lg",
};

export function WorldChooser() {
  const [angle, setAngle] = useState(STEEP);
  const [focus, setFocus] = useState<World | null>(null);
  const seamOffset = useRef(0);
  const leanTarget = useMotionValue(0);
  const lean = useSpring(leanTarget, { stiffness: 90, damping: 20, mass: 0.7 });
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)");
    const sync = () => setAngle(portrait.matches ? SHALLOW : STEEP);
    sync();
    portrait.addEventListener("change", sync);
    return () => portrait.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let last = Number.NaN;

    const write = (offset: number) => {
      const { near, far } = seamClips(angle, offset);
      if (leftRef.current) leftRef.current.style.clipPath = near;
      if (rightRef.current) rightRef.current.style.clipPath = far;
      if (seamRef.current) {
        seamRef.current.style.transform = seamTransform(
          angle,
          offset,
          window.innerWidth,
          window.innerHeight
        );
      }
      seamOffset.current = offset;
    };

    write(0);
    return lean.on("change", (value) => {
      const step = Math.round(value * 240) / 240;
      if (step === last) return;
      last = step;
      write(-LEAN * step);
    });
  }, [angle, lean]);

  return (
    <main
      className="relative h-svh w-full overflow-hidden"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const t = (angle * Math.PI) / 180;
        const u = event.clientX / window.innerWidth;
        const v = event.clientY / window.innerHeight;
        const side =
          Math.sin(t) * (u - 0.5) + Math.cos(t) * (v - 0.5) - seamOffset.current;
        const next: World = side < 0 ? "irvan" : "enrico";
        leanTarget.set(side < 0 ? -1 : 1);
        setFocus((current) => (current === next ? current : next));
      }}
      onPointerLeave={() => {
        leanTarget.set(0);
        setFocus(null);
      }}
    >
      <h1 className="sr-only">
        Choose a profile: Irvan Baihaqi, IT infrastructure engineer, or Enrico
        Dwidhanto Indrawan, back-end developer.
      </h1>

      <RiftCanvas
        world="rift"
        seamAngle={angle}
        bias={seamOffset}
        intensity={0.6}
        className="fixed inset-0 h-svh w-full"
      />

      {(["irvan", "enrico"] as const).map((world) => {
        const profile = PROFILES[world];
        const Scene = SCENES[world];
        const Sigil = SIGILS[world];
        const active = focus === world;
        const dim = focus !== null && !active;
        return (
          <div
            key={world}
            ref={world === "irvan" ? leftRef : rightRef}
            data-world={world}
            className="absolute inset-0 will-change-[clip-path]"
          >
            <WorldSlide
              world={world}
              active={active}
              dim={dim}
              label={profile.world.name}
              code={profile.world.code}
              coordinates={profile.world.coordinates}
              epoch={profile.world.epoch}
              name={profile.name}
              headline={profile.headline}
              location={profile.location}
              tagline={profile.world.tagline}
              slot={SLOT[world]}
              onFocusChange={(isFocused) => {
                leanTarget.set(
                  isFocused ? (world === "irvan" ? -1 : 1) : 0
                );
                setFocus(isFocused ? world : null);
              }}
            >
              <Scene className="opacity-55" />
              <Sigil
                initials={profile.monogram}
                className={cn(
                  "relative w-24 shrink-0 transition-opacity duration-700 sm:w-28",
                  active ? "opacity-100" : "opacity-60"
                )}
              />
            </WorldSlide>
          </div>
        );
      })}

      <div
        ref={seamRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 h-[160vh] w-px will-change-transform"
      >
        <span
          className="absolute inset-y-0 left-0 w-px"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--rift-a) 18%, var(--rift-b) 82%, transparent)",
            boxShadow:
              "0 0 30px 4px color-mix(in oklab, var(--rift-a) 65%, transparent)",
          }}
        />
        <span
          className="absolute inset-y-0 left-0 w-[10vw] -translate-x-1/2 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--rift-a) 40%, transparent), color-mix(in oklab, var(--rift-b) 30%, transparent), transparent)",
            filter: "blur(24px)",
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col items-center gap-2 px-6 pt-6 text-center sm:pt-10">
        <p className="hud text-muted-foreground">
          infrastructure engineer · back-end developer
        </p>
        <span className="display chroma text-3xl tracking-[0.04em] text-foreground sm:text-5xl">
          Irvan ∕ Enrico
        </span>
        <p className="hud text-muted-foreground/70">
          two profiles · pick a side
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 px-6 pb-6 text-center">
        <span className="hud text-muted-foreground/80">
          {focus ? (
            `open ${PROFILES[focus].world.name.toLowerCase()}`
          ) : (
            <>
              <span className="sm:hidden">tap a side to open a profile</span>
              <span className="hidden sm:inline">
                move to lean the rift · click to cross it
              </span>
            </>
          )}
        </span>

        <Watermark className="pointer-events-auto" />
      </div>
    </main>
  );
}

function WorldSlide({
  world,
  active,
  dim,
  label,
  code,
  coordinates,
  epoch,
  name,
  headline,
  location,
  tagline,
  slot,
  onFocusChange,
  children,
}: {
  world: World;
  active: boolean;
  dim: boolean;
  label: string;
  code: string;
  coordinates: string;
  epoch: string;
  name: string;
  headline: string;
  location: string;
  tagline: string;
  slot: string;
  onFocusChange: (focused: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full transition-opacity duration-700",
        dim ? "opacity-45" : "opacity-100"
      )}
    >
      <div className="pointer-events-none absolute inset-0 [&>*]:absolute [&>*]:inset-0">
        {children}
      </div>
      <div
        className={cn(
          "absolute inset-0 flex px-6 pt-40 pb-24 sm:px-12 sm:pt-32 lg:px-16 lg:pt-36",
          slot
        )}
      >
        <WorldLink
          href={`/${world}`}
          world={world}
          onActivate={() => onFocusChange(true)}
          aria-label={`Enter ${label}: ${name}, ${headline}`}
          className={cn(
            "group relative flex max-h-full flex-col gap-4 outline-offset-8 transition-transform duration-500",
            active && "scale-[1.015]"
          )}
        >
          <span className="hud flex items-center gap-3 text-muted-foreground">
            <span className="text-rift-a">{code}</span>
            <span className="hidden sm:inline">{coordinates}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">{epoch}</span>
          </span>
          <span className="display text-4xl leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
            {name}
          </span>
          <span className="text-sm text-foreground/80 sm:text-lg">{headline}</span>
          <span className="text-xs text-muted-foreground sm:text-sm">{location}</span>
          <span className="hidden max-w-sm text-sm text-muted-foreground/80 italic sm:block">
            {tagline}
          </span>
          <span
            className={cn(
              "hud mt-1 inline-flex w-fit items-center gap-2 border border-rift-a/40 bg-rift-a/5 px-3 py-2 text-rift-a transition-all duration-500 group-hover:bg-rift-a/15",
              "[clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]",
              active ? "translate-x-0 opacity-100" : "opacity-80"
            )}
          >
            enter
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </WorldLink>
      </div>
    </div>
  );
}
