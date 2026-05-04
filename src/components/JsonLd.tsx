
/**
 * Renders JSON-LD structured data as a <script> tag.
 * Google parses these for rich results, sitelinks, and knowledge panels.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export const BASE_URL = "https://foliant.app";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Foliant",
  url: BASE_URL,
  logo: `${BASE_URL}/icon-512.png`,
  description:
    "The premium document toolkit. Merge, split, compress, convert. Processed in your browser.",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Foliant",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function toolSchema({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Foliant - ${name}`,
    description,
    url: `${BASE_URL}/tools/${slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Foliant",
    },
  };
}

export function breadcrumbSchema({
  name,
  slug,
}: {
  name: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Foliant",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${BASE_URL}/#tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${BASE_URL}/tools/${slug}`,
      },
    ],
  };
}
