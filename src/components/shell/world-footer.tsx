import type { Profile } from "@/data/profiles";
import { WorldLink } from "@/components/rift/rift-transition";
import { ChapterRule } from "@/components/story/seam";

/** The end of the story: who this is, and the way back to the choose screen. */
export function WorldFooter({ profile }: { profile: Profile }) {
  return (
    <footer className="relative px-6 pt-16 pb-12 sm:px-10 lg:pl-16 lg:pr-48">
      <ChapterRule />
      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="hud text-muted-foreground">
            {profile.world.code} · {profile.world.name}
          </span>
          <span className="display text-2xl text-foreground sm:text-3xl">
            {profile.name}
          </span>
          <span className="text-sm text-muted-foreground">
            {profile.headline} · {profile.location}
          </span>
        </div>
        <WorldLink
          href="/"
          world="rift"
          className="hud tap-none inline-flex w-fit items-center gap-2 border border-border/70 px-3 py-2 text-muted-foreground transition-colors hover:border-rift-a/60 hover:text-rift-a [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
        >
          ← back to the start
        </WorldLink>
      </div>
    </footer>
  );
}
