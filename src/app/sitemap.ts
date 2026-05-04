import type { MetadataRoute } from "next";

const BASE = "https://foliant.app";

const TOOLS = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "pdf-to-image",
  "image-to-pdf",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${BASE}.`.replace(/\.$/, ""),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...TOOLS.map((slug) => ({
      url: `${BASE}/tools/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
