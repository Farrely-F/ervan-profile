import type { Metadata } from "next";
import { PROFILES } from "@/data/profiles";
import { JsonLd, profileJsonLd, profileMetadata } from "@/lib/seo";
import { Panel } from "@/components/ui/panel";
import { StoryShell } from "@/components/shell/story-shell";
import { Chapter, ChapterHeading } from "@/components/story/chapter";
import { Reveal, SplitLine } from "@/components/story/reveal";
import { PointerDrift } from "@/components/story/parallax";
import { ArtGate } from "@/components/story/art-gate";
import { SignalGrid } from "@/components/story/signal-grid";
import { ChronicleRail } from "@/components/story/chronicle-rail";
import { ServiceBoard } from "@/components/role/service-board";
import { UptimeConsole } from "@/components/role/uptime-console";
import { ProofDeck } from "@/components/role/proof-deck";
import { ContactDeck } from "@/components/shell/contact-deck";
import { Crossover } from "@/components/shell/crossover";
import { WorldFooter } from "@/components/shell/world-footer";
import { GridScene } from "@/components/worlds/grid-scene";
import { GridSigil } from "@/components/worlds/grid-sigil";

const profile = PROFILES.irvan;

export const metadata: Metadata = {
  title: "Irvan Baihaqi — IT Infrastructure Engineer",
  description: profile.summary,
  ...profileMetadata(profile),
};

const chapters = [
  { id: "arrival", label: "Arrival" },
  { id: "signal", label: "Signal" },
  { id: "rail", label: "The Rail" },
  { id: "loadout", label: "Loadout" },
  { id: "proof", label: "Proof" },
  { id: "transmission", label: "Transmission" },
  { id: "crossover", label: "Crossover" },
];

export default function Page() {
  return (
    <StoryShell world="irvan" chapters={chapters}>
      <JsonLd data={profileJsonLd(profile)} />
      <Chapter
        id="arrival"
        className="flex min-h-svh items-center pt-32 pb-20"
      >
        <ArtGate className="absolute inset-0">
          <GridScene className="opacity-35" />
        </ArtGate>
        <div className="relative grid w-full min-w-0 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex min-w-0 flex-col gap-6">
            <Reveal>
              <GridSigil initials={profile.monogram} className="w-20 sm:w-24" />
            </Reveal>
            <Reveal>
              <p className="hud flex flex-wrap items-center gap-3 text-muted-foreground">
                <span className="text-rift-a">{profile.world.code}</span>
                <span>{profile.world.name}</span>
                <span className="hidden sm:inline">{profile.world.coordinates}</span>
                <span className="hidden sm:inline">· {profile.world.epoch}</span>
              </p>
            </Reveal>

            <h1 className="display chroma text-[clamp(2.75rem,9vw,7rem)] text-foreground">
              <SplitLine text="Irvan" />{" "}
              <span className="block">
                <SplitLine text="Baihaqi" delay={0.26} />
              </span>
            </h1>

            <Reveal delay={0.5}>
              <p className="text-lg text-foreground/90 sm:text-2xl">
                {profile.headline}
              </p>
            </Reveal>
            <Reveal delay={0.56}>
              <p className="text-sm text-muted-foreground sm:text-base">
                {profile.location}
              </p>
            </Reveal>
            <Reveal delay={0.62}>
              <p className="max-w-lg text-base text-muted-foreground italic sm:text-lg">
                “{profile.copy.arrival.voice}”
              </p>
            </Reveal>
            <Reveal delay={0.68}>
              <p className="max-w-lg text-sm text-muted-foreground/80">
                {profile.copy.arrival.sub}
              </p>
            </Reveal>

            <Reveal delay={0.74}>
              <div className="mt-2 flex items-center gap-3">
                <span className="hud text-muted-foreground/70">
                  scroll to descend
                </span>
                <span className="relative block h-8 w-px bg-border">
                  <span
                    className="absolute inset-x-0 top-0 h-3 bg-rift-a"
                    style={{ animation: "rift-scan 3.2s ease-in-out infinite" }}
                  />
                </span>
              </div>
            </Reveal>
          </div>

          <div className="relative min-w-0">
            <PointerDrift strength={16} stiffness={70}>
              <UptimeConsole profile={profile} />
            </PointerDrift>
          </div>
        </div>
      </Chapter>

      <Chapter id="signal">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ChapterHeading
            eyebrow={profile.copy.brief.eyebrow}
            title={profile.copy.brief.title}
            voice={profile.copy.brief.voice}
          />
          <Reveal delay={0.1} className="min-w-0">
            <Panel
              tone="tech"
              innerClassName="relative p-6 sm:p-8"
              className="h-full"
            >
              <figure className="flex h-full flex-col">
                <blockquote className="text-base leading-relaxed text-foreground/90 sm:text-lg">
                  {profile.summary}
                </blockquote>
                <figcaption className="hud mt-5 text-muted-foreground/60">
                  verbatim, in full
                </figcaption>
              </figure>
            </Panel>
          </Reveal>
        </div>
        <SignalGrid profile={profile} />
      </Chapter>

      <Chapter id="rail">
        <ChapterHeading
          eyebrow={profile.copy.chronicle.eyebrow}
          title={profile.copy.chronicle.title}
          voice={profile.copy.chronicle.voice}
          meta="durations as reported"
        />
        <ChronicleRail
          entries={profile.chronicle}
          world="irvan"
          axis={{ from: 2017, to: 2026 }}
        />
      </Chapter>

      <Chapter id="loadout">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ChapterHeading
            eyebrow={profile.copy.loadout.eyebrow}
            title={profile.copy.loadout.title}
            voice={profile.copy.loadout.voice}
            meta="listed order, no rating"
          />
          <Reveal delay={0.1} className="min-w-0">
            <ServiceBoard profile={profile} />
          </Reveal>
        </div>
      </Chapter>

      <Chapter id="proof">
        <ChapterHeading
          eyebrow={profile.copy.proof.eyebrow}
          title={profile.copy.proof.title}
          voice={profile.copy.proof.voice}
        />
        <ProofDeck profile={profile} />
      </Chapter>

      <Chapter id="transmission">
        <ChapterHeading
          eyebrow={profile.copy.transmission.eyebrow}
          title={profile.copy.transmission.title}
          voice={profile.copy.transmission.voice}
        />
        <ContactDeck profile={profile} />
      </Chapter>

      <section id="crossover" className="defer-scene relative scroll-mt-24">
        <div className="px-6 pt-24 sm:px-10 lg:pl-16 lg:pr-48">
          <ChapterHeading
            eyebrow={profile.copy.crossover.eyebrow}
            title={profile.copy.crossover.title}
            voice={profile.copy.crossover.voice}
          />
        </div>
        <Crossover world="irvan" />
      </section>

      <WorldFooter profile={profile} />
    </StoryShell>
  );
}
