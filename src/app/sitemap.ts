import type { MetadataRoute } from "next";
import { WORLDS } from "@/data/profiles";
import { SITE_URL, profileImage } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/opengraph-image`],
    },
    ...WORLDS.map((world) => ({
      url: `${SITE_URL}/${world}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: [profileImage(world)],
    })),
  ];
}
