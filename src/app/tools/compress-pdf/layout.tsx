import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress PDF",
  description: "Shrink PDF file size while preserving quality. Free, private, in your browser.",
  alternates: {
    canonical: "https://foliant.app/tools/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF - Foliant",
    description: "Shrink PDF file size while preserving quality. Free, private, in your browser.",
    url: "https://foliant.app/tools/compress-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF - Foliant",
    description: "Shrink PDF file size while preserving quality. Free, private, in your browser.",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
