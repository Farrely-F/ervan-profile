"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { RiftCanvas } from "@/components/rift/rift-canvas";
import { WorldSync } from "@/components/rift/world-sync";
import { SeamLine } from "@/components/rift/seam-line";
import { HudBar } from "@/components/shell/hud-bar";
import { StoryRail, type ChapterRef } from "@/components/story/story-rail";
import type { World } from "@/data/profiles";

/**
 * Everything every world needs: the rift behind the content, the seam swept
 * across the screen by the scroll itself, the HUD, the chapter spine, and
 * the document-level world sync.
 */
export function StoryShell({
  world,
  chapters,
  children,
}: {
  world: World;
  chapters: ChapterRef[];
  children: React.ReactNode;
}) {
  const seam = useRef(0);
  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    seam.current = (value - 0.5) * 0.44;
  });

  return (
    <div data-world={world} className="relative min-h-svh">
      <WorldSync world={world} />
      <RiftCanvas
        world={world}
        seamAngle={66}
        bias={seam}
        intensity={0.42}
        className="fixed inset-0 z-0 h-svh w-full"
      />
      <HudBar world={world} />
      <StoryRail chapters={chapters} />
      <div className="relative z-10">{children}</div>
      <SeamLine />
    </div>
  );
}
