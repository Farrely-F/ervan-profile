"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "cn";
import { Panel } from "@/components/ui/panel";
import type { ChronicleEntry, World } from "@/data/profiles";

/** Every entry carries a weight so the rail draws real tenure, not vibes. */
function durationMonths(duration: string | null): number {
  if (!duration) return 0;
  const years = /(\d+)\s*year/.exec(duration);
  const months = /(\d+)\s*month/.exec(duration);
  return Number(years?.[1] ?? 0) * 12 + Number(months?.[1] ?? 0);
}

const KIND_CLASS: Record<ChronicleEntry["kind"], string> = {
  role: "text-rift-a border-rift-a/50",
  study: "text-rift-b border-rift-b/50",
};

/** The card itself — no motion, so reduced-motion can reuse it verbatim. */
function RailCardBody({
  entry,
  index,
}: {
  entry: ChronicleEntry;
  index: number;
}) {
  const months = durationMonths(entry.duration);

  return (
    <div className="relative">
      <div className="flex items-start justify-between gap-4">
        <span className="hud text-muted-foreground/70">
          {String(index + 1).padStart(2, "0")} ·{" "}
          {entry.kind === "study" ? "study" : "post"} · {entry.domain}
        </span>
        <span
          className={cn("hud shrink-0 border px-2 py-1", KIND_CLASS[entry.kind])}
        >
          {entry.endYear === null ? "ongoing" : entry.endYear}
        </span>
      </div>

      <h3 className="display mt-5 text-2xl leading-tight text-foreground sm:text-3xl">
        {entry.title}
      </h3>
      <p className="mt-2 text-base text-rift-a">{entry.org}</p>
      {entry.location ? (
        <p className="mt-1 text-sm text-muted-foreground">{entry.location}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="hud text-muted-foreground">{entry.dates}</span>
        <span
          className={cn(
            "hud",
            entry.duration ? "text-foreground/70" : "text-muted-foreground/60"
          )}
        >
          {entry.duration
            ? `duration ${entry.duration}`
            : "duration not given"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="hud w-16 shrink-0 text-muted-foreground/60">
          {months} mo
        </span>
        <span className="relative h-1.5 flex-1 bg-border/40">
          <span
            className="absolute inset-y-0 left-0"
            style={{
              width: `${Math.min(100, (months / 71) * 100)}%`,
              background: "linear-gradient(90deg, var(--rift-a), var(--rift-b))",
            }}
          />
        </span>
      </div>

      {entry.note ? (
        <p className="mt-5 border-l border-rift-c/50 pl-4 text-sm text-muted-foreground italic">
          {entry.note}
        </p>
      ) : null}
    </div>
  );
}

function RailCard({
  entry,
  index,
  total,
  progress,
  travel,
  window: windowSpan,
}: {
  entry: ChronicleEntry;
  index: number;
  total: number;
  progress: MotionValue<number>;
  travel: MotionValue<number>;
  window: number;
}) {
  const slot = total > 1 ? index / (total - 1) : 0.5;
  const x = useTransform([progress, travel], ([value, width]) =>
    (slot - (value as number)) * (width as number)
  );
  const near = windowSpan * 0.42;
  const stops = [slot - windowSpan, slot - near, slot, slot + near, slot + windowSpan];
  const opacity = useTransform(progress, stops, [0, 1, 1, 1, 0]);
  const scale = useTransform(progress, stops, [0.94, 1, 1, 1, 0.94]);
  const rotateY = useTransform(progress, stops, [14, 0, 0, 0, -14]);

  return (
    <div className="absolute top-1/2 left-1/2 w-[min(85vw,34rem)] -translate-x-1/2 -translate-y-1/2">
      <motion.article
        style={{ x, opacity, scale, rotateY, transformStyle: "preserve-3d" }}
        className="w-full"
      >
        <Panel
          tone="tech"
          variant="opaque"
          innerClassName="relative p-6 sm:p-8"
        >
          <RailCardBody entry={entry} index={index} />
        </Panel>
      </motion.article>
    </div>
  );
}

/**
 * The chronicle rail: a pinned filmstrip. Scroll drives the strip
 * horizontally past a fixed seam while a tenure axis underneath marks every
 * post and its reported length.
 */
export function ChronicleRail({
  entries,
  world,
  axis,
}: {
  entries: ChronicleEntry[];
  world: World;
  axis: { from: number; to: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const axisRef = useRef<HTMLDivElement>(null);
  const railWidth = useMotionValue(0);
  const travel = useMotionValue(0);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });
  const fill = useTransform(progress, (value) =>
    Math.min(1, Math.max(0, value))
  );
  // lead-in / lead-out: the strip starts and ends with its cards centred
  const head = entries.length > 1 ? Math.min(0.14, 0.34 / entries.length) : 0;
  const track = useTransform(progress, [0, 1], [head, 1 - head]);
  const cursorX = useTransform([progress, railWidth], ([value, width]) =>
    Math.min(1, Math.max(0, value as number)) * (width as number)
  );

  useMotionValueEvent(track, "change", (value) => {
    const next = Math.round(
      Math.min(1, Math.max(0, value)) * Math.max(0, entries.length - 1)
    );
    setActive((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const sync = () => {
      travel.set(node.clientWidth * 1.05);
      if (axisRef.current) railWidth.set(axisRef.current.clientWidth);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, [railWidth, travel]);

  const span = entries.length > 1 ? 1 / (entries.length - 1) : 1;
  const windowSpan = Math.min(0.26, span * 0.8);
  const current = entries[Math.min(active, entries.length - 1)];

  if (reduced) {
    return (
      <ol className="mt-10 space-y-6">
        {entries.map((entry, index) => (
          <li key={entry.id}>
            <Panel tone="tech" innerClassName="relative p-6 sm:p-8">
              <RailCardBody entry={entry} index={index} />
            </Panel>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div
      ref={ref}
      className="relative mt-8"
      style={{ height: `${entries.length * 62 + 90}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="flex items-end justify-between gap-4 px-1 pb-6">
          <span className="hud text-muted-foreground">
            <span className="text-rift-a">
              {current.kind === "study" ? "study" : "post"}
            </span>{" "}
            {String(active + 1).padStart(2, "0")}/
            {String(entries.length).padStart(2, "0")} · {current.dates}
          </span>
          <span className="hud hidden text-muted-foreground/60 sm:block">
            scroll to travel the rail
          </span>
        </div>

        <div className="relative flex-1 [perspective:1500px]">
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 h-40 w-px -translate-x-1/2 -translate-y-1/2 opacity-50"
            style={{
              background:
                "linear-gradient(180deg, transparent, var(--rift-a) 45%, transparent)",
            }}
          />
          {entries.map((entry, index) => (
            <RailCard
              key={entry.id}
              entry={entry}
              index={index}
              total={entries.length}
              progress={track}
              travel={travel}
              window={windowSpan}
            />
          ))}
        </div>

        <div className="pt-8">
          <div ref={axisRef} className="relative h-14">
            <div className="absolute top-3 h-px w-full bg-border" />
            <motion.div
              className="absolute top-3 h-px w-full origin-left"
              style={{
                scaleX: fill,
                background:
                  "linear-gradient(90deg, var(--rift-a), var(--rift-b) 70%, var(--rift-c))",
              }}
            />
            {entries.map((entry, index) => (
              <span
                key={entry.id}
                className="absolute top-0 -translate-x-1/2"
                style={{
                  left: `${(index / Math.max(1, entries.length - 1)) * 100}%`,
                }}
              >
                <span
                  className={cn(
                    "mx-auto block size-2 rotate-45 border",
                    index === active
                      ? "border-rift-a bg-rift-a"
                      : cn("bg-transparent", KIND_CLASS[entry.kind])
                  )}
                />
                <span
                  className={cn(
                    "hud mt-2 block whitespace-nowrap transition-colors",
                    index === active
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                  )}
                >
                  {entry.startYear ?? "n/d"}
                </span>
              </span>
            ))}
            <motion.span
              className="pointer-events-none absolute top-3 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                x: cursorX,
                background: "var(--rift-c)",
                boxShadow:
                  "0 0 18px 4px color-mix(in oklab, var(--rift-c) 45%, transparent)",
              }}
            />
          </div>
          <p className="hud mt-2 text-muted-foreground/50">
            axis {axis.from} → {axis.to} ·{" "}
            {world === "irvan" ? "the grid" : "the march"}
          </p>
        </div>
      </div>
    </div>
  );
}
