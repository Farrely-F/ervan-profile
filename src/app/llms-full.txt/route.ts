import { PROFILES, WORLDS } from "@/data/profiles";
import { SITE_URL, profileUrl } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * The whole site as plain text, generated from the same data the pages
 * render — so it can never drift from what a visitor reads.
 */
function render(): string {
  const blocks = WORLDS.map((world) => {
    const profile = PROFILES[world];
    const lines: string[] = [];

    lines.push(`# ${profile.name}`, "");
    lines.push(`${profile.headline} · ${profile.location}`, "");
    lines.push(`Canonical: ${profileUrl(world)}`, "");
    lines.push("## Summary", "", profile.summary, "");
    lines.push("## Experience and study", "");
    for (const entry of profile.chronicle) {
      lines.push(
        `- ${entry.title} — ${entry.org}${entry.location ? `, ${entry.location}` : ""}`
      );
      lines.push(
        `  ${entry.dates}${entry.duration ? ` (${entry.duration})` : ""} · ${entry.domain}`
      );
      if (entry.note) lines.push(`  Note: ${entry.note}`);
    }
    lines.push("", "## Skills (subject's own list order; no rating implied)", "");
    for (const entry of profile.loadout) {
      lines.push(
        `- ${entry.name}${entry.spec ? ` (${entry.spec})` : ""}`
      );
    }
    lines.push("", "## Credentials and education", "");
    for (const item of profile.proof) {
      lines.push(
        `- ${item.name}${item.issuer ? ` — ${item.issuer}` : ""}${
          item.field ? ` · ${item.field}` : ""
        }`
      );
      lines.push(`  ${item.detail}`);
    }
    lines.push("", "## Contact", "");
    lines.push(`- LinkedIn: ${profile.contact.linkedin}`);
    lines.push(
      profile.contact.email
        ? `- Email: ${profile.contact.email}`
        : "- Email: not listed in the source export"
    );
    lines.push("");
    return lines.join("\n");
  });

  return [
    "# Two profiles — full text",
    "",
    `Source: static site at ${SITE_URL}. All facts are transcribed from the`,
    "subjects' LinkedIn profile exports (~2026-10). The two-world framing is",
    "fictional presentation and makes no factual claim about either subject.",
    "",
    ...blocks,
  ].join("\n");
}

export function GET() {
  return new Response(render(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
