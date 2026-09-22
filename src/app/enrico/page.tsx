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
import { ApiConsole } from "@/components/role/api-console";
import { GoLitany } from "@/components/role/go-litany";
import { ProofDeck } from "@/components/role/proof-deck";
import { ProfileResponse } from "@/components/role/json";
import { SchemaTable } from "@/components/role/schema-table";
import { ContactDeck } from "@/components/shell/contact-deck";
import { Crossover } from "@/components/shell/crossover";
import { WorldFooter } from "@/components/shell/world-footer";
import { MarchScene } from "@/components/worlds/march-scene";
import { MarchSigil } from "@/components/worlds/march-sigil";

const profile = PROFILES.enrico;

export const metadata: Metadata = {
  title: "Enrico Dwidhanto Indrawan — Backend Developer",
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

const PIVOT = [
  { year: "2011", label: "geodesy, ITB" },
  { year: "2017", label: "coordination" },
  { year: "2020", label: "five months of JavaScript" },
  { year: "2021", label: "first back-end post" },
];

export default function Page() {
  return (
    <StoryShell world="enrico" chapters={chapters}>
      <JsonLd data={profileJsonLd(profile)} />
      <Chapter
        id="arrival"
        className="flex min-h-svh items-center pt-32 pb-20"
      >
        <ArtGate className="absolute inset-0">
          <MarchScene className="opacity-35" />
        </ArtGate>
        <div className="relative grid w-full min-w-0 gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
          <div className="flex min-w-0 flex-col gap-6">
            <Reveal>
              <MarchSigil initials={profile.monogram} className="w-20 sm:w-24" />
            </Reveal>
            <Reveal>
              <p className="hud flex flex-wrap items-center gap-3 text-muted-foreground">
                <span className="text-rift-a">{profile.world.code}</span>
                <span>{profile.world.name}</span>
                <span className="hidden sm:inline">{profile.world.coordinates}</span>
                <span className="hidden sm:inline">· {profile.world.epoch}</span>
              </p>
            </Reveal>

            <h1 className="display chroma text-[clamp(2.25rem,7vw,5.5rem)] text-foreground">
              <SplitLine text="Enrico" />{" "}
              <span className="block">
                <SplitLine text="Dwidhanto" delay={0.24} />
              </span>{" "}
              <span className="block">
                <SplitLine text="Indrawan" delay={0.48} />
              </span>
            </h1>

            <Reveal delay={0.8}>
              <p className="text-lg text-foreground/90 sm:text-2xl">
                {profile.headline}
              </p>
            </Reveal>
            <Reveal delay={0.86}>
              <p className="text-sm text-muted-foreground sm:text-base">
                {profile.location}
              </p>
            </Reveal>
            <Reveal delay={0.92}>
              <p className="max-w-lg text-base text-muted-foreground italic sm:text-lg">
                “{profile.copy.arrival.voice}”
              </p>
            </Reveal>
            <Reveal delay={0.98}>
              <p className="max-w-lg text-sm text-muted-foreground/80">
                {profile.copy.arrival.sub}
              </p>
            </Reveal>

            <Reveal delay={1.04}>
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
              <ProfileResponse profile={profile} />
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
              tone="codex"
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
        <Reveal delay={0.12} className="min-w-0">
          <div className="mt-12">
            <SchemaTable profile={profile} />
          </div>
        </Reveal>
      </Chapter>

      <Chapter id="rail">
        <ChapterHeading
          eyebrow={profile.copy.chronicle.eyebrow}
          title={profile.copy.chronicle.title}
          voice={profile.copy.chronicle.voice}
          meta="durations as reported"
        />

        <Reveal delay={0.1}>
          <ol className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch">
            {PIVOT.map((step, index) => (
              <li
                key={step.year}
                className="min-w-0 sm:min-w-[9rem] sm:flex-1"
              >
                <Panel
                  tone="codex"
                  className="h-full"
                  innerClassName="flex h-full items-center gap-3 p-4"
                >
                  <span className="display text-2xl text-rift-a">
                    {step.year}
                  </span>
                  <span className="hud text-muted-foreground/80">
                    {step.label}
                  </span>
                  {index < PIVOT.length - 1 ? (
                    <span aria-hidden="true" className="ml-auto text-rift-b/70">
                      →
                    </span>
                  ) : null}
                </Panel>
              </li>
            ))}
          </ol>
        </Reveal>

        <ChronicleRail
          entries={profile.chronicle}
          world="enrico"
          axis={{ from: 2011, to: 2026 }}
        />

        <Reveal>
          <p className="hud mt-4 text-muted-foreground/60">
            the same chronicle, served as resources
          </p>
        </Reveal>
        <div className="mt-6">
          <ApiConsole chronicle={profile.chronicle} />
        </div>
      </Chapter>

      <Chapter id="loadout">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ChapterHeading
            eyebrow={profile.copy.loadout.eyebrow}
            title={profile.copy.loadout.title}
            voice={profile.copy.loadout.voice}
            meta="listed order, no rating"
          />
          <div className="flex min-w-0 flex-col gap-6">
            <Reveal delay={0.1}>
              <GoLitany profile={profile} />
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="divide-y divide-border/50 border-y border-border/50">
                {profile.loadout.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex items-baseline gap-4 py-3"
                  >
                    <span className="hud w-8 shrink-0 text-muted-foreground/60">
                      {String(entry.index).padStart(2, "0")}
                    </span>
                    <span className="display flex-1 text-base text-foreground sm:text-lg">
                      {entry.name}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
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
        <Crossover world="enrico" />
      </section>

      <WorldFooter profile={profile} />
    </StoryShell>
  );
}
