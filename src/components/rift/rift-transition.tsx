"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "cn";
import { RIFTS, type World } from "@/data/profiles";

const EASE: [number, number, number, number] = [0.7, 0, 0.29, 1];

/**
 * The rift wipe. Navigation is intercepted so the seam can close over the
 * current page in the *destination* world's colours, push the route, then
 * keep travelling — the two worlds pass through each other instead of
 * cutting to a new screen.
 */

type Phase = "idle" | "closing" | "opening";
type RiftState = { phase: Phase; world: World | "rift" };

let state: RiftState = { phase: "idle", world: "rift" };
const subscribers = new Set<() => void>();
let safety = 0;

function publish(next: RiftState) {
  state = next;
  for (const notify of subscribers) notify();
}

const subscribe = (notify: () => void) => {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
};

const snapshot = () => state;
const serverSnapshot = () => state;

/** Intercept a click and route through the rift. */
export function useRiftTravel() {
  const router = useRouter();
  const reduced = useReducedMotion();

  return useCallback(
    (href: string, world: World | "rift") => {
      if (reduced) {
        router.push(href);
        return;
      }
      window.clearTimeout(safety);
      publish({ phase: "closing", world });
      window.setTimeout(() => router.push(href), 640);
      safety = window.setTimeout(
        () => publish({ phase: "opening", world }),
        2800
      );
    },
    [reduced, router]
  );
}

export function RiftOverlay() {
  const rift = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const active = rift.phase !== "idle";
  const open = rift.phase === "opening";

  // The push has landed: the seam opens again on the other side.
  useEffect(() => {
    if (rift.phase !== "closing" || pathname === lastPath.current) return;
    lastPath.current = pathname;
    const timeout = window.setTimeout(
      () => publish({ phase: "opening", world: rift.world }),
      140
    );
    return () => window.clearTimeout(timeout);
  }, [pathname, rift.phase, rift.world]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(
      () => publish({ phase: "idle", world: rift.world }),
      900
    );
    return () => window.clearTimeout(timeout);
  }, [open, rift.world]);

  const ramp = RIFTS[rift.world];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-100",
        !active && "hidden"
      )}
    >
      {(["left", "right"] as const).map((side) => (
        <motion.div
          key={side}
          className="absolute inset-0"
          style={{
            clipPath:
              side === "left"
                ? "polygon(0% 0%, 56% 0%, 44% 100%, 0% 100%)"
                : "polygon(56% 0%, 100% 0%, 100% 100%, 44% 100%)",
            background:
              side === "left"
                ? `linear-gradient(120deg, ${ramp.void}, ${ramp.a}22 60%, ${ramp.void})`
                : `linear-gradient(-120deg, ${ramp.void}, ${ramp.b}22 60%, ${ramp.void})`,
            willChange: "transform",
          }}
          initial={{ x: side === "left" ? "-110%" : "110%" }}
          animate={{ x: open ? (side === "left" ? "110%" : "-110%") : "0%" }}
          transition={{ duration: open ? 0.85 : 0.62, ease: EASE }}
        />
      ))}
      <motion.div
        className="absolute inset-y-[-20%] left-1/2 w-[2px] -translate-x-1/2 origin-center"
        style={{
          rotate: 12,
          background: `linear-gradient(180deg, transparent, ${ramp.a}, ${ramp.b}, transparent)`,
          boxShadow: `0 0 40px 8px ${ramp.a}66`,
          willChange: "transform, opacity",
        }}
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={open ? { opacity: 0, scaleY: 1.4 } : { opacity: 1, scaleY: 1 }}
        transition={{ duration: open ? 0.6 : 0.4, ease: EASE }}
      />
      <div
        className="absolute inset-0 hud flex items-center justify-center text-foreground/70"
        style={{ color: ramp.a }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {rift.phase === "idle" ? "" : "Crossing the seam"}
        </motion.span>
      </div>
    </div>
  );
}

type LinkProps = {
  href: string;
  world: World | "rift";
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  onActivate?: () => void;
};

/**
 * A real anchor (prefetch, middle-click, keyboard all intact) that hands the
 * navigation to the rift on a plain left click.
 */
export function WorldLink({
  href,
  world,
  children,
  className,
  onActivate,
  ...rest
}: LinkProps) {
  const travel = useRiftTravel();

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        onActivate?.();
        travel(href, world);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
