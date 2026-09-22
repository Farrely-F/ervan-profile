import { cn } from "cn";
import { WorldLink } from "@/components/rift/rift-transition";
import { otherWorld, PROFILES, type World } from "@/data/profiles";

const CHIP =
  "hud tap-none inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border px-2.5 py-2 transition-colors sm:gap-2 sm:px-3 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

/**
 * The HUD that rides above every world: which sector you are in, a way back
 * to the start, and a way across to the other side.
 *
 * Laid out as two tracks — an elastic left cluster that truncates, and a
 * rigid right cluster of chips that abbreviate rather than wrap, so nothing
 * ever spills or collides from 320px up.
 */
export function HudBar({ world }: { world: World }) {
  const profile = PROFILES[world];
  const other = otherWorld(world);
  const destination = PROFILES[other];

  return (
    <header className="fixed inset-x-0 top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/70 to-transparent" />

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span
          className="size-1.5 shrink-0 rotate-45 bg-rift-a sm:size-2"
          style={{ animation: "rift-pulse 3.2s ease-in-out infinite" }}
        />
        <span className="hud min-w-0 truncate text-foreground/85">
          {profile.world.code}
        </span>
        <span className="hud hidden shrink-0 text-muted-foreground/70 sm:inline">
          {profile.world.name}
        </span>
        <span className="hud hidden min-w-0 truncate text-muted-foreground/50 lg:inline">
          {profile.headline}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <WorldLink
          href="/"
          world="rift"
          className={cn(CHIP, "border-border/70 text-muted-foreground hover:border-rift-a/60 hover:text-rift-a")}
          aria-label="Back to the start and choose a profile"
        >
          <span aria-hidden="true">←</span>
          <span className="hidden xs:inline">back</span>
        </WorldLink>
        <WorldLink
          href={`/${other}`}
          world={other}
          className={cn(
            CHIP,
            "border-rift-a/40 bg-rift-a/5 text-rift-a hover:bg-rift-a/15"
          )}
          aria-label={`Cross into ${destination.world.name}: ${destination.name}`}
        >
          <span aria-hidden="true">→</span>
          <span className="sm:hidden">{destination.world.short}</span>
          <span className="hidden sm:inline">
            cross to {destination.world.name}
          </span>
        </WorldLink>
      </div>
    </header>
  );
}
