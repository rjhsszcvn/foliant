import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Split PDF",
  description: "Extract specific pages or split a PDF into individual files. Free, private, in your browser.",
  alternates: {
    canonical: "https://foliant.app/tools/split-pdf",
  },
  openGraph: {
    title: "Split PDF - Foliant",
    description: "Extract specific pages or split a PDF into individual files. Free, private, in your browser.",
    url: "https://foliant.app/tools/split-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF - Foliant",
    description: "Extract specific pages or split a PDF into individual files. Free, private, in your browser.",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
