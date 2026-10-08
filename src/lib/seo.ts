import type { Metadata } from "next";

const SITE_NAME = "Legalnorms Consultations";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://legalnorms.com";

interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

/**
 * Standardized SEO Utility for Next.js App Router
 *
 * Enforces Open Graph, Canonical URLs, and exact indexation rules across all
 * 30 defined pages in the platform. Call this within `generateMetadata()`
 * on any page.tsx or layout.tsx.
 */
export function constructMetadata({
  title,
  description,
  image = "/og-image.png",
  noIndex = false,
  canonicalUrl,
}: MetadataProps): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl || SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
