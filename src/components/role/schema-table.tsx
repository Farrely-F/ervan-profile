import { ConsoleFrame, Tok } from "@/components/role/code";
import type { Profile } from "@/data/profiles";

/**
 * ENRICO — the identity record as a schema result set. Types are illustrative
 * SQL types; every value is transcribed from the source export.
 */
export function SchemaTable({ profile }: { profile: Profile }) {
  const rows: { field: string; type: string; value: string | null }[] = [
    { field: "id", type: "VARCHAR(16)", value: profile.id },
    { field: "name", type: "VARCHAR(64)", value: profile.name },
    { field: "headline", type: "VARCHAR(32)", value: profile.headline },
    { field: "location", type: "VARCHAR(64)", value: profile.location },
    { field: "email", type: "VARCHAR(96)", value: profile.contact.email },
    {
      field: "linkedin",
      type: "VARCHAR(160)",
      value: profile.contact.linkedin.replace("https://www.", ""),
    },
  ];

  return (
    <ConsoleFrame
      tone="codex"
      title="DESCRIBE profile; — 1 row in set"
      meta="read-only replica"
    >
      <table className="w-full min-w-[34rem] border-collapse text-left font-mono text-[0.74rem] sm:text-[0.8rem]">
        <thead>
          <tr className="hud text-muted-foreground">
            <th className="pb-2 pr-4 font-medium">field</th>
            <th className="pb-2 pr-4 font-medium">type</th>
            <th className="pb-2 pr-4 font-medium">value</th>
            <th className="pb-2 font-medium">null</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.field} className="border-t border-border/40 align-top">
              <td className="py-2 pr-4">
                <Tok kind="key">{row.field}</Tok>
              </td>
              <td className="py-2 pr-4">
                <Tok kind="punct">{row.type}</Tok>
              </td>
              <td className="py-2 pr-4 break-all">
                {row.value === null ? <Tok kind="num">NULL</Tok> : <Tok kind="str">{row.value}</Tok>}
              </td>
              <td className="py-2">
                <Tok kind="num">{row.value === null ? "YES" : "NO"}</Tok>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hud mt-4 text-muted-foreground/70">
        {profile.contact.email === null
          ? "No email address is published. LinkedIn is the route."
          : "One record, every value as given."}
      </p>
    </ConsoleFrame>
  );
}
