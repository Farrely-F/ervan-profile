"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "cn";

export type ChapterRef = { id: string; label: string };

/**
 * The scroll spine: a fixed rail of chapter ticks on the right edge, a
 * hairline progress bar at the top, and the current chapter called out in
 * HUD micro-copy. Everything is derived from the sections themselves, so the
 * spine can never disagree with the page.
 */
export function StoryRail({ chapters }: { chapters: ChapterRef[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "");
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.35,
  });

  useEffect(() => {
    const sections = chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((node): node is HTMLElement => node !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (winner) setActive(winner.target.id);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0.01, 0.3, 0.7, 1] }
    );
    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [chapters]);

  const current = chapters.find((chapter) => chapter.id === active);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-50 h-px w-full origin-left"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, var(--rift-a), var(--rift-b) 60%, var(--rift-c))",
        }}
      />

      <nav
        aria-label="Chapters"
        className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === active;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                document.getElementById(chapter.id)?.scrollIntoView({
                  behavior: reduced ? "auto" : "smooth",
                  block: "start",
                });
              }}
              className="group tap-none flex items-center gap-3"
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={cn(
                  "hud transition-all duration-500",
                  isActive
                    ? "text-rift-a opacity-100"
                    : "translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-80"
                )}
              >
                {chapter.label}
              </span>
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span
                  className={cn(
                    "block rotate-45 border transition-all duration-500",
                    isActive
                      ? "size-2.5 border-rift-a bg-rift-a/70"
                      : "size-1.5 border-border bg-transparent group-hover:border-rift-a"
                  )}
                />
              </span>
              <span className="hud w-4 text-right text-muted-foreground/60">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-4 pt-10 lg:hidden">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/85 to-transparent"
        />
        <span className="hud rounded-full border border-border bg-background px-3 py-1.5 text-muted-foreground">
          {current?.label ?? ""} · {chapters.findIndex((c) => c.id === active) + 1}/
          {chapters.length}
        </span>
      </div>
    </>
  );
}
