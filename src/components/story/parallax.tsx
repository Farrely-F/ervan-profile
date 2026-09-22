"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "cn";

/**
 * Depth layer: translates against the scroll of its own container, so every
 * section can carry foreground/midground/background planes at different
 * speeds without a single global scroll listener.
 */
export function Parallax({
  children,
  className,
  speed = 0.25,
  range = 140,
}: {
  children: React.ReactNode;
  className?: string;
  /** Positive drifts against the scroll, negative with it. */
  speed?: number;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range * speed, -range * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={reduced ? undefined : { y, opacity }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Pointer-reactive drift, springs on both axes. */
export function PointerDrift({
  children,
  className,
  strength = 18,
  stiffness = 60,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  stiffness?: number;
}) {
  const reduced = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness, damping: 22, mass: 0.6 });
  const y = useSpring(targetY, { stiffness, damping: 22, mass: 0.6 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        targetX.set(((event.clientX - rect.left) / rect.width - 0.5) * strength * 2);
        targetY.set(((event.clientY - rect.top) / rect.height - 0.5) * strength * 2);
      }}
      onPointerLeave={() => {
        targetX.set(0);
        targetY.set(0);
      }}
    >
      <motion.div style={{ x, y }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * The scroll spine: one progress value for the whole document plus a
 * normalised cursor for the chapter currently in view.
 */
export function useStoryProgress(): {
  progress: MotionValue<number>;
  travelled: MotionValue<string>;
} {
  const { scrollYProgress } = useScroll();
  const travelled = useTransform(scrollYProgress, (value) =>
    `${Math.round(value * 100)}`
  );
  return { progress: scrollYProgress, travelled };
}
