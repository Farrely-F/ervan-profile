"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "motion/react";
import { seamTransform } from "@/lib/seam";

/**
 * The crisp edge of the rift. The WebGL field supplies the energy, this
 * supplies the line — a single compositor-friendly element, so the field
 * behind it can be rasterised at whatever resolution the device can afford
 * without the seam ever turning soft.
 */
export function SeamLine({
  angle = 66,
  span = 0.44,
  start = -0.5,
}: {
  angle?: number;
  /** How far the seam travels across the screen over the whole scroll. */
  span?: number;
  /** Scroll progress (0–1) at which the seam sits on the centre line. */
  start?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.style.transform = seamTransform(angle, 0, window.innerWidth, window.innerHeight);
      return;
    }
    let last = Number.NaN;
    const write = (progress: number) => {
      // quantised: the line only repaints when it has actually moved
      const offset = Math.round((progress - start) * span * 400) / 400;
      if (offset === last) return;
      last = offset;
      node.style.transform = seamTransform(
        angle,
        offset,
        window.innerWidth,
        window.innerHeight
      );
    };
    write(scrollYProgress.get());
    return scrollYProgress.on("change", write);
  }, [angle, span, start, scrollYProgress]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-1/2 left-1/2 z-20 h-[160vh] w-px will-change-transform"
    >
      <span
        className="absolute inset-y-0 left-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--rift-a) 20%, var(--rift-b) 80%, transparent)",
          boxShadow:
            "0 0 22px 2px color-mix(in oklab, var(--rift-a) 45%, transparent)",
        }}
      />
      <span
        className="absolute inset-y-0 left-0 w-[6vw] -translate-x-1/2 opacity-25"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--rift-a) 35%, transparent), color-mix(in oklab, var(--rift-b) 25%, transparent), transparent)",
        }}
      />
    </div>
  );
}
