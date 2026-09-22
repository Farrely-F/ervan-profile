import type { ComponentType } from "react";
import type { World } from "@/data/profiles";
import { GridScene } from "@/components/worlds/grid-scene";
import { MarchScene } from "@/components/worlds/march-scene";
import { GridSigil } from "@/components/worlds/grid-sigil";
import { MarchSigil } from "@/components/worlds/march-sigil";

/** One place that knows which art belongs to which world. */
export const SCENES: Record<World, ComponentType<{ className?: string }>> = {
  irvan: GridScene,
  enrico: MarchScene,
};

export const SIGILS: Record<
  World,
  ComponentType<{ initials: string; className?: string; label?: string }>
> = {
  irvan: GridSigil,
  enrico: MarchSigil,
};
