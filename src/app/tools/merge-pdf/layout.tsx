import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge PDF",
  description: "Combine multiple PDFs into a single document, in order. Free, private, in your browser.",
  alternates: {
    canonical: "https://foliant.app/tools/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF - Foliant",
    description: "Combine multiple PDFs into a single document, in order. Free, private, in your browser.",
    url: "https://foliant.app/tools/merge-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF - Foliant",
    description: "Combine multiple PDFs into a single document, in order. Free, private, in your browser.",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
