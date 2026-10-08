import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://legalnorms.com";

  return {
    rules: {
      userAgent: "*",
      // Allow indexation of the public, scalable SEO routes
      allow: [
        "/",
        "/drugs/*",
        "/manufacturers/*",
        "/regulatory/*",
        "/documents/*",
        "/research/*",
      ],
      // Explicitly block auth walls and private portfolio areas from indexation
      disallow: [
        "/admin/dashboard/",
        "/admin/dashboard/*",
        "/admin/",
        "/admin/*",
        "/api/",
        "/portfolio/",
        "/settings/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
