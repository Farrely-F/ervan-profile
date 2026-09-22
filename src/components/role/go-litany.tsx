import { ConsoleFrame, Tok } from "@/components/role/code";
import type { Profile } from "@/data/profiles";

/**
 * ENRICO — the loadout declared the way this role declares things: a Go
 * literal. The values are the source export's own list, in its own order.
 */
export function GoLitany({ profile }: { profile: Profile }) {
  const current = profile.chronicle.find(
    (entry) => entry.kind === "role" && entry.endYear === null
  );
  const stack = profile.loadout.map((entry) =>
    entry.spec ? `${entry.name} — ${entry.spec}` : entry.name
  );

  return (
    <ConsoleFrame
      tone="codex"
      title="profile/enrico.go"
      meta="compiles as written"
    >
      <pre className="overflow-x-auto font-mono text-[0.74rem] leading-relaxed sm:text-[0.8rem]">
        <Tok kind="comment">{`// the stack, as declared
// listed order — no proficiency rating implied\n`}</Tok>
        <Tok kind="key">package</Tok> <Tok kind="plain">profile</Tok>
        {"\n\n"}
        <Tok kind="key">type</Tok> <Tok kind="plain">Dev</Tok>{" "}
        <Tok kind="key">struct</Tok> <Tok kind="punct">{"{"}</Tok>
        {"\n  "}
        <Tok kind="plain">Name</Tok>
        {"     "}
        <Tok kind="key">string</Tok>
        {"\n  "}
        <Tok kind="plain">Role</Tok>
        {"     "}
        <Tok kind="key">string</Tok>
        {"\n  "}
        <Tok kind="plain">Location</Tok>
        {" "}
        <Tok kind="key">string</Tok>
        {"\n  "}
        <Tok kind="plain">Since</Tok>
        {"    "}
        <Tok kind="key">string</Tok>
        {"\n"}
        <Tok kind="punct">{"}"}</Tok>
        {"\n\n"}
        <Tok kind="key">var</Tok> <Tok kind="plain">Enrico</Tok> ={" "}
        <Tok kind="plain">Dev</Tok> <Tok kind="punct">{"{"}</Tok>
        {"\n  "}
        <Tok kind="plain">Name</Tok>
        <Tok kind="punct">: </Tok>
        <Tok kind="str">&quot;{profile.name}&quot;</Tok>
        <Tok kind="punct">,</Tok>
        {"\n  "}
        <Tok kind="plain">Role</Tok>
        <Tok kind="punct">: </Tok>
        <Tok kind="str">&quot;{profile.headline}&quot;</Tok>
        <Tok kind="punct">,</Tok>
        {"\n  "}
        <Tok kind="plain">Location</Tok>
        <Tok kind="punct">: </Tok>
        <Tok kind="str">&quot;{profile.location}&quot;</Tok>
        <Tok kind="punct">,</Tok>
        {"\n  "}
        <Tok kind="plain">Since</Tok>
        <Tok kind="punct">: </Tok>
        <Tok kind="str">
          &quot;{current ? current.dates.replace(" – ", " → ") : profile.world.epoch}&quot;
        </Tok>
        <Tok kind="punct">,</Tok>
        {"\n"}
        <Tok kind="punct">{"}"}</Tok>
        {"\n\n"}
        <Tok kind="key">var</Tok> <Tok kind="plain">Stack</Tok> ={" "}
        <Tok kind="punct">[]</Tok>
        <Tok kind="key">string</Tok>
        <Tok kind="punct">{"{"}</Tok>
        {stack.map((item, index) => (
          <span key={item}>
            {"\n  "}
            <Tok kind="str">&quot;{item}&quot;</Tok>
            <Tok kind="punct">,</Tok>
            {index === stack.length - 1 ? (
              <Tok kind="comment">{`  // ${profile.loadout.length} entries`}</Tok>
            ) : null}
          </span>
        ))}
        {"\n"}
        <Tok kind="punct">{"}"}</Tok>
      </pre>
    </ConsoleFrame>
  );
}
