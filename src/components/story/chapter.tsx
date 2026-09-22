import { cn } from "cn";
import { Reveal } from "@/components/story/reveal";

/**
 * Chapter header: HUD eyebrow, display title, and the world-voice line that
 * frames the section without adding a single unverified fact.
 */
export function ChapterHeading({
  eyebrow,
  title,
  voice,
  align = "left",
  meta,
  className,
}: {
  eyebrow: string;
  title: string;
  voice: string;
  align?: "left" | "right";
  meta?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "right" && "items-end text-right",
        className
      )}
    >
      <Reveal>
        <p className="hud flex items-center gap-3 text-rift-a">
          <span className="h-px w-8 bg-rift-a/60" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="display max-w-3xl text-3xl text-foreground sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p
          className={cn(
            "max-w-xl text-base text-muted-foreground italic sm:text-lg",
            align === "right" && "text-right"
          )}
        >
          {voice}
        </p>
      </Reveal>
      {meta ? (
        <Reveal delay={0.18}>
          <p className="hud text-muted-foreground/60">{meta}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Section skeleton with the seam running behind it. */
export function Chapter({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-24 px-6 py-24 sm:px-10 lg:pl-16 lg:pr-48",
        className
      )}
    >
      {children}
    </section>
  );
}
