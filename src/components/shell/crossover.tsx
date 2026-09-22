"use client";

import { cn } from "cn";
import { PROFILES, otherWorld, type World } from "@/data/profiles";
import { SCENES, SIGILS } from "@/components/worlds/scene-registry";
import { WorldLink } from "@/components/rift/rift-transition";
import { Reveal } from "@/components/story/reveal";

/**
 * CROSSOVER — the last beat of every story. The other world bleeds through a
 * diagonal window in this one, carrying its own palette, its own art and its
 * own name, so crossing over is a place, not a button.
 */
export function Crossover({ world }: { world: World }) {
  const here = PROFILES[world];
  const there = PROFILES[otherWorld(world)];
  const Scene = SCENES[there.id];
  const Sigil = SIGILS[there.id];

  return (
    <div className="relative mt-12 min-h-[78svh] overflow-hidden border-y border-border/50">
      <div
        data-world={there.id}
        className="absolute inset-0 bg-background will-change-[clip-path]"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 72%, 0% 100%)" }}
      >
        <Scene className="opacity-45" />
        <div className="relative flex h-full flex-col justify-center gap-5 px-6 pb-40 sm:px-12 lg:px-16">
          <div className="flex items-center gap-5">
            <Sigil initials={there.monogram} className="w-20 shrink-0 sm:w-24" />
            <span className="hud flex flex-col gap-2 text-muted-foreground">
              <span>
                <span className="text-rift-a">{there.world.code}</span>{" "}
                · {there.world.name}
              </span>
              <span className="hidden sm:inline">{there.world.coordinates}</span>
              <span className="hidden sm:inline">{there.world.epoch}</span>
            </span>
          </div>
          <span className="display max-w-2xl text-3xl text-foreground sm:text-5xl">
            {there.name}
          </span>
          <span className="text-base text-foreground/85 sm:text-lg">
            {there.headline} · {there.location}
          </span>
          <span className="max-w-md text-sm text-muted-foreground italic">
            {there.world.tagline}
          </span>
          <WorldLink
            href={`/${there.id}`}
            world={there.id}
            className={cn(
              "hud tap-none group mt-2 inline-flex w-fit items-center gap-2 border border-rift-a/50 bg-rift-a/10 px-4 py-3 text-rift-a transition-colors hover:bg-rift-a/20",
              "[clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
            )}
          >
            {there.copy.crossover.cta}
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </WorldLink>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[86%] left-1/2 h-px w-[104%] -translate-x-1/2 -translate-y-1/2 -rotate-[16.7deg]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--rift-a) 25%, var(--rift-b) 75%, transparent)",
          boxShadow:
            "0 0 26px 4px color-mix(in oklab, var(--rift-a) 55%, transparent)",
        }}
      />

      <div className="pointer-events-none absolute bottom-0 left-0 flex max-w-md flex-col gap-3 p-6 sm:p-12">
        <Reveal>
          <span className="hud text-muted-foreground">
            you are still in {here.world.name}
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <span className="display text-2xl text-foreground sm:text-3xl">
            {here.copy.crossover.title}
          </span>
        </Reveal>
        <Reveal delay={0.16}>
          <span className="text-sm text-muted-foreground italic">
            {here.copy.crossover.voice}
          </span>
        </Reveal>
      </div>
    </div>
  );
}
