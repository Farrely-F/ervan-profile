"use client";

import { MotionConfig } from "motion/react";

/**
 * One place to honour `prefers-reduced-motion` for every motion-driven
 * transform on the site: motion keeps opacity transitions, drops movement.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
