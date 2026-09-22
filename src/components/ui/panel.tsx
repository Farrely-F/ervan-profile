import { cn } from "cn";

/**
 * The two panel skins.
 *
 * `panel-tech` builds its hairline frame out of `padding: 1px` on the outer
 * box — which means *nothing else may ever set padding there*, or the frame
 * inflates into a slab of gradient. This component owns that contract: the
 * outer element takes tone/variant only, and every caller's padding lives on
 * the single inner child.
 */
type Tone = "tech" | "codex";

const TONE: Record<Tone, string> = {
  tech: "panel-tech",
  codex: "panel-codex",
};

const VARIANT: Record<Tone, Record<"default" | "opaque" | "flush", string>> = {
  tech: {
    default: "",
    opaque: "panel-tech--opaque",
    flush: "panel-tech--flush",
  },
  codex: { default: "", opaque: "", flush: "" },
};

export function Panel({
  tone,
  variant = "default",
  className,
  innerClassName,
  children,
}: {
  tone: Tone;
  variant?: "default" | "opaque" | "flush";
  /** Outer box: layout only — never padding. */
  className?: string;
  /** Inner box: padding and layout live here. Defaults to standard padding. */
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(TONE[tone], VARIANT[tone][variant], className)}>
      <div className={cn("relative h-full w-full", innerClassName ?? "p-6 sm:p-7")}>
        {children}
      </div>
    </div>
  );
}
