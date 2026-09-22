"use client";

import { useState } from "react";
import { cn } from "cn";
import { Panel } from "@/components/ui/panel";
import type { Profile } from "@/data/profiles";

function Channel({
  tone,
  label,
  value,
  href,
  copyable,
  hint,
}: {
  tone: "tech" | "codex";
  label: string;
  value: string;
  href?: string;
  copyable?: boolean;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);

  const body = (
    <div className="relative flex h-full flex-col gap-3 p-6 sm:p-7">
      <span className="hud text-muted-foreground">{label}</span>
      <span className="display text-lg break-all text-foreground sm:text-2xl">
        {value}
      </span>
      {hint ? (
        <span className="hud mt-auto text-muted-foreground/60">{hint}</span>
      ) : null}
      <span
        className="absolute -right-2 -top-2 size-1.5 rotate-45 bg-rift-a opacity-70"
        style={{ animation: "rift-pulse 3.6s ease-in-out infinite" }}
        aria-hidden="true"
      />
    </div>
  );

  if (!copyable || !href) {
    return (
      <a
        className="group relative block"
        href={href}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "me noreferrer" : undefined}
      >
        <Panel tone={tone} className="min-w-0">{body}</Panel>
      </a>
    );
  }

  return (
    <Panel tone={tone} className="group relative min-w-0">
      {body}
      <div className="relative mt-4 flex flex-wrap gap-2">
        <a
          href={href}
          className="hud tap-none border border-rift-a/50 px-3 py-2 text-rift-a transition-colors hover:bg-rift-a/15 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
        >
          open mail client →
        </a>
        <button
          type="button"
          className={cn(
            "hud tap-none border px-3 py-2 transition-colors",
            copied
              ? "border-rift-b/60 text-rift-b"
              : "border-border text-muted-foreground hover:border-rift-a/60 hover:text-rift-a"
          )}
          onClick={() => {
            void navigator.clipboard
              .writeText(value)
              .then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              })
              .catch(() => setCopied(false));
          }}
        >
          {copied ? "copied" : "copy address"}
        </button>
      </div>
    </Panel>
  );
}

/**
 * TRANSMISSION — how to reach this operator. Channels are exactly the ones
 * the source export publishes; where one is missing it says so instead of
 * inventing a placeholder.
 */
export function ContactDeck({ profile }: { profile: Profile }) {
  const tone = profile.id === "irvan" ? "tech" : "codex";

  return (
    <div className="mt-12 grid min-w-0 gap-5 lg:grid-cols-2">
      {profile.contact.email ? (
        <Channel
          tone={tone}
          label="primary channel · email"
          value={profile.contact.email}
          href={`mailto:${profile.contact.email}`}
          copyable
          hint="published address"
        />
      ) : (
        <Panel
          tone={tone}
          className="min-w-0"
          innerClassName="relative flex h-full flex-col gap-3 p-6 sm:p-7"
        >
            <span className="hud text-muted-foreground">
              primary channel · email
            </span>
            <span className="display text-2xl text-muted-foreground/70">
              404 not found
            </span>
            <pre className="overflow-x-auto font-mono text-[0.74rem] leading-relaxed text-muted-foreground/80">
              {`{\n  "detail": "No email address is published."\n}`}
            </pre>
            <span className="hud mt-auto text-muted-foreground/60">
              nothing invented to fill the gap
            </span>
        </Panel>
      )}

      <Channel
        tone={tone}
        label="published route · linkedin"
        value={profile.contact.linkedin.replace("https://www.", "")}
        href={profile.contact.linkedin}
        hint="opens in a new tab"
      />

      <Panel
        tone={tone}
        className="min-w-0"
        innerClassName="relative flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-end sm:p-7"
      >
        <div className="flex flex-col gap-2">
          <span className="hud text-muted-foreground">location</span>
          <span className="display text-xl text-foreground sm:text-2xl">
            {profile.location}
          </span>
          <span className="hud text-muted-foreground/60">
            {profile.world.coordinates}
          </span>
        </div>
        <p className="hud max-w-xs text-muted-foreground/70 leading-relaxed">
          {profile.copy.transmission.note}
        </p>
      </Panel>
    </div>
  );
}
