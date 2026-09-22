import { ImageResponse } from "next/og";
import { OgHandoff, ogContentType, ogFonts, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Two profiles on either side of a glowing diagonal rift";

export default async function Image() {
  return new ImageResponse(<OgHandoff />, { ...size, fonts: await ogFonts() });
}
