import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: process.env.VERCEL_ENV === "preview" ? undefined : "/",
      disallow: process.env.VERCEL_ENV === "preview" ? "/" : undefined,
    },
    sitemap: `${profile.site}/sitemap.xml`,
  };
}
