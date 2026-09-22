import type { Metadata } from "next";
import { PROFILES } from "@/data/profiles";
import { WorldChooser } from "@/components/rift/world-chooser";

export const metadata: Metadata = {
  title: "Choose a world",
};

export default function Page() {
  return (
    <>
      <div className="sr-only">
        <h2>Two profiles</h2>
        <p>{PROFILES.irvan.name} — {PROFILES.irvan.headline}. {PROFILES.irvan.summary}</p>
        <p>{PROFILES.enrico.name} — {PROFILES.enrico.headline}. {PROFILES.enrico.summary}</p>
      </div>
      <WorldChooser />
    </>
  );
}
