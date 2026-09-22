import { cn } from "cn";

const GITHUB = "https://github.com/farrely-F/";

/**
 * Colophon. Kept in the HUD's voice like every other chip on the site, but the
 * brand token resets its casing — `xfarr.dev` is a name, not a HUD label.
 */
export function Watermark({ className }: { className?: string }) {
  return (
    <a
      href={GITHUB}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "hud tap-none group inline-flex w-fit items-center gap-1.5 py-2 text-muted-foreground/55 outline-offset-4 transition-colors hover:text-rift-a focus-visible:text-rift-a",
        className
      )}
    >
      developed by
      <span className="normal-case tracking-[0.12em] text-foreground/75 transition-colors group-hover:text-rift-a">
        xfarr.dev
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}
