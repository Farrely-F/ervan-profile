import { ConsoleFrame, ConsoleLine } from "@/components/role/code";
import type { Profile } from "@/data/profiles";

/**
 * IRVAN — the résumé as a shell session, because that is how this work is
 * read. Every command output below is transcribed data: no invented tooling,
 * no invented metrics.
 */
export function UptimeConsole({ profile }: { profile: Profile }) {
  const current = profile.chronicle.find(
    (entry) => entry.kind === "role" && entry.endYear === null
  );
  const roles = profile.chronicle.filter((entry) => entry.kind === "role");
  const study = profile.chronicle.find((entry) => entry.kind === "study");
  const services = profile.loadout.map((entry) =>
    entry.name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")
  );

  return (
    <ConsoleFrame
      title="root@grid-01: ~/profile"
      meta="session 01 — read-only"
      tone="tech"
    >
      <div className="space-y-1">
        <ConsoleLine command="whoami" output={profile.name.toLowerCase().replace(" ", ".")} />
        <ConsoleLine
          command="role --current"
          output={current ? `${current.title} @ ${current.org}` : profile.headline}
          comment="// active"
        />
        <ConsoleLine
          command="uptime --since 2017-01"
          output={`${roles.length} posts · ${profile.signals[0].value} years in service · ${profile.location.toLowerCase()}`}
        />
        <ConsoleLine
          command="systemctl --type=service --state=running"
          output={services.join("  ")}
          comment="// top-skills manifest"
        />
        <ConsoleLine
          command="certs --list"
          output={profile.proof
            .filter((item) => item.issuer && item.issuer.length <= 6)
            .map((item) => item.issuer)
            .join(" · ")}
          comment="// held"
        />
        <ConsoleLine
          command="cat education"
          output={
            study ? `${study.title} — ${study.domain}` : "not given"
          }
          comment={study ? "// dates not given" : undefined}
        />
        <div className="flex items-center gap-2 pt-1 font-mono text-[0.78rem]">
          <span className="text-rift-b">$</span>
          <span
            className="inline-block h-3.5 w-2 bg-rift-a/80"
            style={{ animation: "rift-pulse 1.4s steps(2, end) infinite" }}
          />
        </div>
      </div>
    </ConsoleFrame>
  );
}
