import { ConsoleFrame, Tok } from "@/components/role/code";
import type { Profile } from "@/data/profiles";

/** JSON tree with the site's token colours — used by every console panel. */
export function JsonValue({ value, depth }: { value: unknown; depth: number }) {
  const pad = "  ".repeat(depth);

  if (value === null || value === undefined) return <Tok kind="num">null</Tok>;
  if (typeof value === "string")
    return <Tok kind="str">&quot;{value}&quot;</Tok>;
  if (typeof value === "number" || typeof value === "boolean")
    return <Tok kind="num">{String(value)}</Tok>;

  if (Array.isArray(value)) {
    return (
      <>
        <Tok kind="punct">[</Tok>
        {value.map((item, index) => (
          <span key={index}>
            {"\n"}
            {pad}
            {"  "}
            <JsonValue value={item} depth={depth + 1} />
            {index < value.length - 1 ? <Tok kind="punct">,</Tok> : null}
          </span>
        ))}
        {"\n"}
        {pad}
        <Tok kind="punct">]</Tok>
      </>
    );
  }

  const entries = Object.entries(value as Record<string, unknown>);
  return (
    <>
      <Tok kind="punct">{"{"}</Tok>
      {entries.map(([key, item], index) => (
        <span key={key}>
          {"\n"}
          {pad}
          {"  "}
          <Tok kind="key">&quot;{key}&quot;</Tok>
          <Tok kind="punct">: </Tok>
          <JsonValue value={item} depth={depth + 1} />
          {index < entries.length - 1 ? <Tok kind="punct">,</Tok> : null}
        </span>
      ))}
      {"\n"}
      {pad}
      <Tok kind="punct">{"}"}</Tok>
    </>
  );
}

export function toResource(entry: {
  id: string;
  kind: string;
  title: string;
  org: string;
  location: string | null;
  dates: string;
  duration: string | null;
  domain: string;
  note?: string;
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    kind: entry.kind,
    title: entry.title,
    org: entry.org,
  };
  if (entry.location) body.location = entry.location;
  body.dates = entry.dates;
  if (entry.duration) body.duration = entry.duration;
  body.domain = entry.domain;
  if (entry.note) body.note = entry.note;
  return body;
}

/**
 * The identity record served as an API response: the same words the export
 * uses, in the shape this role reads all day.
 */
export function ProfileResponse({ profile }: { profile: Profile }) {
  const body = {
    id: profile.id,
    name: profile.name,
    headline: profile.headline,
    location: profile.location,
    email: profile.contact.email,
    since: profile.world.epoch,
    stack: profile.loadout.map((entry) =>
      entry.spec ? `${entry.name} — ${entry.spec}` : entry.name
    ),
  };

  return (
    <ConsoleFrame
      tone="codex"
      title={`GET /profile/${profile.id}`}
      meta="200 OK · application/json"
    >
      <pre className="font-mono text-[0.74rem] leading-relaxed whitespace-pre-wrap sm:text-[0.8rem]">
        <JsonValue value={body} depth={0} />
      </pre>
      <div className="hud mt-4 flex items-center gap-3 text-muted-foreground/60">
        <span>1 resource</span>
        <span className="h-px flex-1 bg-border/60" />
        <span>kept as written</span>
      </div>
    </ConsoleFrame>
  );
}
