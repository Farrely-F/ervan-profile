import { cn } from "cn";

/**
 * The seam. Every screen is cut by the same diagonal rift; here it is a
 * pure-CSS artefact so it costs nothing to scatter between sections.
 */
export function Seam({
  className,
  angle = 26,
  offset = "0%",
  thickness = 1,
  glow = 34,
  travel = true,
}: {
  className?: string;
  angle?: number;
  offset?: string;
  thickness?: number;
  glow?: number;
  travel?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute top-1/2 left-1/2 h-[200%] w-px -translate-x-1/2 -translate-y-1/2"
        style={{
          rotate: `${angle}deg`,
          marginLeft: offset,
          width: `${thickness}px`,
          background:
            "linear-gradient(180deg, transparent, var(--rift-a) 18%, var(--rift-b) 82%, transparent)",
          boxShadow: `0 0 ${glow}px ${glow / 6}px color-mix(in oklab, var(--rift-a) 55%, transparent)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[200%] w-[3vw] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen"
        style={{
          rotate: `${angle}deg`,
          marginLeft: offset,
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--rift-a) 30%, transparent), color-mix(in oklab, var(--rift-b) 25%, transparent), transparent)",
          filter: `blur(${glow / 2}px)`,
        }}
      />
      {travel ? (
        <div
          className="absolute top-1/2 left-1/2 h-[200%] w-px -translate-x-1/2 -translate-y-1/2"
          style={{
            rotate: `${angle}deg`,
            marginLeft: offset,
            width: `${thickness * 2.5}px`,
            backgroundImage:
              "linear-gradient(180deg, transparent 40%, var(--rift-c) 50%, transparent 60%)",
            backgroundSize: "100% 420px",
            backgroundRepeat: "repeat-y",
            animation: "rift-drift 9s linear infinite",
          }}
        />
      ) : null}
    </div>
  );
}

/** A hairline that fades in from both ends — used between chapters. */
export function ChapterRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rule-gradient relative w-full",
        className
      )}
    >
      <span
        className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45"
        style={{ background: "var(--rift-a)", animation: "rift-pulse 3.4s ease-in-out infinite" }}
      />
    </div>
  );
}
