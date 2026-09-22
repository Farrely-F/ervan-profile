"use client";

import { useState } from "react";
import { cn } from "cn";
import { ConsoleFrame } from "@/components/role/code";
import { JsonValue, toResource } from "@/components/role/json";
import type { ChronicleEntry } from "@/data/profiles";

/**
 * ENRICO — the chronicle as an API surface. Each post in the source export
 * becomes a resource; the response body is the transcription itself, copied
 * verbatim out of the document. The copy button hands back the same JSON.
 */

export function ApiConsole({ chronicle }: { chronicle: ChronicleEntry[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {chronicle.map((entry, index) => {
        const body = toResource(entry);
        return (
          <ConsoleFrame
            key={entry.id}
            tone="codex"
            title={`GET /chronicle/${entry.id}`}
            meta={entry.kind === "study" ? "200 OK · study" : "200 OK · role"}
            action={
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(JSON.stringify(body, null, 2))
                    .then(() => {
                      setCopied(entry.id);
                      window.setTimeout(
                        () =>
                          setCopied((current) =>
                            current === entry.id ? null : current
                          ),
                        1600
                      );
                    })
                    .catch(() => setCopied(null));
                }}
                className={cn(
                  "hud tap-none rounded-full border px-3 py-1.5 transition-colors",
                  copied === entry.id
                    ? "border-rift-b/60 text-rift-b"
                    : "border-border text-muted-foreground hover:border-rift-a/60 hover:text-rift-a"
                )}
                aria-label={`Copy JSON for ${entry.id}`}
              >
                {copied === entry.id ? "copied" : "copy json"}
              </button>
            }
          >
            <div>
              <pre className="min-w-0 font-mono text-[0.74rem] leading-relaxed whitespace-pre-wrap sm:text-[0.8rem]">
                <JsonValue value={body} depth={0} />
              </pre>
            </div>
            <div className="hud mt-4 flex items-center gap-3 text-muted-foreground/60">
              <span>
                step {String(index + 1).padStart(2, "0")} /{" "}
                {String(chronicle.length).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-border/60" />
              <span>kept as written</span>
            </div>
          </ConsoleFrame>
        );
      })}
    </div>
  );
}
