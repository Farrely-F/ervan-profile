import { Panel } from "@/components/ui/panel";
import { Stagger, StaggerItem } from "@/components/story/reveal";
import type { Profile } from "@/data/profiles";

/**
 * SIGNAL — the four numbers that summarise the profile. Each one carries its
 * own provenance so a derived figure never masquerades as a reported one.
 */
export function SignalGrid({ profile }: { profile: Profile }) {
  return (
    <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {profile.signals.map((signal) => (
        <StaggerItem key={signal.label} className="h-full">
          <Panel
            tone={profile.id === "irvan" ? "tech" : "codex"}
            className="h-full"
            innerClassName="relative flex h-full flex-col gap-3 p-5 sm:p-6"
          >
              <span className="display chroma text-4xl text-foreground sm:text-5xl">
                {signal.value}
              </span>
              <span className="text-sm text-foreground/80">{signal.label}</span>
              <span className="hud mt-auto flex items-center gap-2 text-muted-foreground/60">
                <span
                  className="size-1.5 rotate-45 bg-rift-a"
                  style={{ animation: "rift-pulse 4s ease-in-out infinite" }}
                />
                {signal.basis}
              </span>
          </Panel>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
