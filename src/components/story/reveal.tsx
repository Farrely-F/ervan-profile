"use client";

import { motion } from "motion/react";
import { cn } from "cn";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that walks its children in, one after another. */
export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="rest"
      whileInView="run"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      variants={{ run: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        rest: { opacity: 0, y: 22 },
        run: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Letter-by-letter entrance for the display type, split by the seam. */
export function SplitLine({
  text,
  className,
  charClassName,
  delay = 0,
  step = 0.032,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <span className={cn("inline-block", className)} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          aria-hidden="true"
          className={cn("inline-block will-change-transform", charClassName)}
          initial={{ opacity: 0, y: "0.5em", rotateX: -55 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.9,
            delay: delay + index * step,
            ease: EASE,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
