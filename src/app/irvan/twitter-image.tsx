import { ImageResponse } from "next/og";
import { PROFILES } from "@/data/profiles";
import { OgProfile, ogContentType, ogFonts, ogSize } from "@/lib/og";

const profile = PROFILES.irvan;

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `${profile.name}, ${profile.headline}, ${profile.location}`;

export default async function Image() {
  return new ImageResponse(<OgProfile profile={profile} />, {
    ...size,
    fonts: await ogFonts(),
  });
}
