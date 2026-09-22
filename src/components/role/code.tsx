import { cn } from "cn";
import { Panel } from "@/components/ui/panel";

/**
 * Shared chrome for the role artefacts: a terminal/codex frame plus the
 * token colours used to render real data as the syntax each role actually
 * reads all day.
 */

export type TokenKind = "key" | "str" | "num" | "comment" | "punct" | "plain";

const TOKEN_CLASS: Record<TokenKind, string> = {
  key: "text-rift-a",
  str: "text-foreground/90",
  num: "text-rift-c",
  comment: "text-muted-foreground/80 italic",
  punct: "text-muted-foreground",
  plain: "text-foreground/80",
};

export function Tok({
  kind,
  children,
}: {
  kind: TokenKind;
  children: React.ReactNode;
}) {
  return <span className={TOKEN_CLASS[kind]}>{children}</span>;
}

export function ConsoleFrame({
  title,
  meta,
  action,
  tone = "tech",
  className,
  bodyClassName,
  children,
}: {
  title: string;
  meta?: string;
  /** Rendered at the right of the title bar — buttons, chips, status. */
  action?: React.ReactNode;
  tone?: "tech" | "codex";
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Panel
      tone={tone}
      className={cn("w-full", className)}
      innerClassName="relative flex flex-col"
    >
        <div className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
          <span className="flex gap-1" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="size-1.5 rounded-full bg-rift-a/70"
                style={{
                  animation: `rift-led ${2.2 + index * 0.7}s ease-in-out infinite ${index * 0.3}s`,
                }}
              />
            ))}
          </span>
          <span className="hud truncate text-foreground/70">{title}</span>
          <span className="ml-auto flex shrink-0 items-center gap-3">
            {meta ? (
              <span className="hud hidden text-muted-foreground/70 sm:inline">
                {meta}
              </span>
            ) : null}
            {action}
          </span>
        </div>
      <div className={cn("relative overflow-x-auto p-4", bodyClassName)}>
        {children}
      </div>
    </Panel>
  );
}

/** A single console line: prompt, command, output. */
export function ConsoleLine({
  prompt,
  command,
  output,
  comment,
}: {
  prompt?: string;
  command?: string;
  output?: string;
  comment?: string;
}) {
  return (
    <div className="whitespace-pre font-mono text-[0.78rem] leading-relaxed">
      {command ? (
        <>
          <span className="text-rift-b">{prompt ?? "$"}</span>{" "}
          <span className="text-foreground">{command}</span>
        </>
      ) : null}
      {output ? (
        <div className="text-foreground/75">
          {output}
          {comment ? (
            <span className="text-muted-foreground/70"> {comment}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
