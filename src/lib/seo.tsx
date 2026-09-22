import type { Metadata } from "next";
import type { Profile, World } from "@/data/profiles";

/**
 * One place for everything a crawler, a social card or a language model
 * needs: the canonical origin, the shared metadata shape, and the
 * structured-data builders. Facts in the structured data are the same
 * transcribed facts the pages render — nothing is embellished for SEO.
 */

/** Set NEXT_PUBLIC_SITE_URL in production; localhost keeps dev honest. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "Irvan Baihaqi & Enrico Dwidhanto Indrawan";

export const SITE_DESCRIPTION =
  "Two profiles, each opening into its own world: Irvan Baihaqi, IT infrastructure engineer with 9+ years across infrastructure engineering and IT/desktop support in Jakarta, and Enrico Dwidhanto Indrawan, back-end developer working in Go and MySQL from West Java.";

export const OG_ALT = "Two profiles on either side of a glowing diagonal rift";

export const SITE_ICON = `${SITE_URL}/icon.svg`;

export const profileUrl = (world: World) => `${SITE_URL}/${world}`;

export const profileImage = (world: World) =>
  `${profileUrl(world)}/opengraph-image`;

export function profileTitle(profile: Profile) {
  return `${profile.name} — ${profile.headline}`;
}

export function profileMetadata(profile: Profile): Metadata {
  const url = profileUrl(profile.id);
  return {
    title: profileTitle(profile),
    description: profile.summary,
    alternates: { canonical: url },
    // Images come from this route's own opengraph-image / twitter-image files.
    openGraph: {
      type: "profile",
      url,
      title: profileTitle(profile),
      description: profile.summary,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: profileTitle(profile),
      description: profile.summary,
    },
  };
}

type Credential = {
  "@type": "EducationalOccupationalCredential";
  name: string;
  credentialCategory: string;
  recognizedBy?: { "@type": "Organization"; name: string };
};

/**
 * ProfilePage wrapping a Person. `knowsAbout` is the subject's own
 * top-skills list, and credentials/education are the ones on the record.
 */
export function profileJsonLd(profile: Profile) {
  const current = profile.chronicle.find(
    (entry) => entry.kind === "role" && entry.endYear === null
  );
  const study = profile.chronicle.filter((entry) => entry.kind === "study");

  const credentials: Credential[] = profile.proof.map((item) => ({
    "@type": "EducationalOccupationalCredential",
    name: item.name,
    credentialCategory: item.field ? `certification in ${item.field}` : "certification",
    ...(item.issuer && item.issuer.length <= 8
      ? { recognizedBy: { "@type": "Organization" as const, name: item.issuer } }
      : {}),
  }));

  const person = {
    "@type": "Person",
    "@id": `${profileUrl(profile.id)}#person`,
    name: profile.name,
    givenName: profile.name.split(" ")[0],
    jobTitle: profile.headline,
    description: profile.summary,
    url: profileUrl(profile.id),
    image: profileImage(profile.id),
    knowsAbout: profile.loadout.map((entry) =>
      entry.spec ? `${entry.name} (${entry.spec})` : entry.name
    ),
    sameAs: [profile.contact.linkedin],
    hasOccupation: current
      ? {
          "@type": "Occupation",
          name: current.title,
          occupationLocation: { "@type": "City", name: profile.location },
        }
      : undefined,
    worksFor: current
      ? {
          "@type": "Organization",
          name: current.org,
          ...(current.location
            ? { address: { "@type": "PostalAddress", addressLocality: current.location } }
            : {}),
        }
      : undefined,
    workLocation: { "@type": "Place", name: profile.location },
    ...(profile.contact.email ? { email: profile.contact.email } : {}),
    alumniOf: study.map((entry) => ({
      "@type": "EducationalOrganization",
      name: entry.title,
    })),
    hasCredential: credentials,
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": profileUrl(profile.id),
    url: profileUrl(profile.id),
    name: profileTitle(profile),
    description: profile.summary,
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: profileImage(profile.id),
      width: 1200,
      height: 630,
      caption: `${profile.name}, ${profile.headline}`,
    },
    mainEntity: person,
  };
}

export function siteJsonLd(profiles: Profile[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@type": "Person", name: SITE_NAME },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${SITE_URL}/#profiles`,
      name: "Profiles",
      numberOfItems: profiles.length,
      itemListElement: profiles.map((profile, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${profile.name} — ${profile.headline}`,
        description: profile.summary,
        url: profileUrl(profile.id),
      })),
    },
  ];
}

/** Renders structured data as a script tag, with `<` escaped. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
