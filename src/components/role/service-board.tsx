import type { Profile } from "@/data/profiles";

/**
 * IRVAN — the loadout as a service board. State lamps are decorative; the
 * only claim made is the one the source export makes, which is why the
 * legend says so out loud.
 */
export function ServiceBoard({ profile }: { profile: Profile }) {
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4 pb-3">
        <span className="hud text-muted-foreground">
          unit · state · listed order
        </span>
        <span className="hud text-muted-foreground/70">
          {String(profile.loadout.length).padStart(2, "0")} entries
        </span>
      </div>

      <ul className="divide-y divide-border/50 border-y border-border/50">
        {profile.loadout.map((entry) => (
          <li
            key={entry.name}
            className="group flex items-center gap-4 py-3 transition-colors hover:bg-rift-a/5"
          >
            <span
              className="size-1.5 shrink-0 rotate-45 bg-rift-a"
              style={{
                animation: `rift-led ${2.6 + entry.index * 0.45}s ease-in-out infinite ${entry.index * 0.2}s`,
              }}
              aria-hidden="true"
            />
            <span className="hud w-8 shrink-0 text-muted-foreground/60">
              {String(entry.index).padStart(2, "0")}
            </span>
            <span className="display min-w-0 flex-1 truncate text-base tracking-tight text-foreground sm:text-lg">
              {entry.name}
            </span>
            {entry.spec ? (
              <span className="hud hidden text-muted-foreground/70 sm:block">
                {entry.spec}
              </span>
            ) : null}
            <span className="hud hidden shrink-0 border border-rift-a/40 px-2 py-1 text-rift-a md:block">
              active
            </span>
          </li>
        ))}
      </ul>

      <p className="hud mt-3 max-w-2xl leading-relaxed text-muted-foreground/70">
        “Active” means the entry is on the list. No proficiency rating is
        implied.
      </p>
    </div>
  );
}
