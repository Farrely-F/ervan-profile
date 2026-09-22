import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Cinzel, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { RiftOverlay } from "@/components/rift/rift-transition";
import { MotionRoot } from "@/components/story/motion-root";
import { PROFILES } from "@/data/profiles";
import {
  JsonLd,
  OG_ALT,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  siteJsonLd,
} from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
});
const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — two profiles`,
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Irvan Baihaqi" }, { name: "Enrico Dwidhanto Indrawan" }],
  creator: "Irvan Baihaqi & Enrico Dwidhanto Indrawan",
  publisher: "Irvan Baihaqi & Enrico Dwidhanto Indrawan",
  category: "technology",
  keywords: [
    "Irvan Baihaqi",
    "Enrico Dwidhanto Indrawan",
    "IT infrastructure engineer",
    "back-end developer",
    "Golang developer",
    "MikroTik MTCNA",
    "Fortinet FCA",
    "Jakarta",
    "Tasikmalaya",
    "résumé",
    "profile",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — two profiles`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — two profiles`,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#05060f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-world="rift"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        inter.variable,
        jetbrains.variable,
        chakra.variable,
        cinzel.variable
      )}
    >
      <body className="relative min-h-full bg-background text-foreground">
        <JsonLd data={siteJsonLd([PROFILES.irvan, PROFILES.enrico])} />
        <MotionRoot>
          {children}
          <RiftOverlay />
        </MotionRoot>
      </body>
    </html>
  );
}
