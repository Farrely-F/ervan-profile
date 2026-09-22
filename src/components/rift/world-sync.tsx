"use client";

import { useEffect } from "react";
import type { World } from "@/data/profiles";

/**
 * Mirrors the page's world onto <html> so document-level affordances — the
 * seam-coloured scrollbar, the overscroll void, the selection tint — belong
 * to the world the visitor is standing in.
 */
export function WorldSync({ world }: { world: World | "rift" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.world ?? "rift";
    root.dataset.world = world;
    return () => {
      root.dataset.world = previous;
    };
  }, [world]);

  return null;
}
