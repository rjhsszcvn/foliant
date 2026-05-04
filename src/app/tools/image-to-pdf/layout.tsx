import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF",
  description: "Bundle JPGs and PNGs into a polished PDF. Free, private, in your browser.",
  alternates: {
    canonical: "https://foliant.app/tools/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF - Foliant",
    description: "Bundle JPGs and PNGs into a polished PDF. Free, private, in your browser.",
    url: "https://foliant.app/tools/image-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF - Foliant",
    description: "Bundle JPGs and PNGs into a polished PDF. Free, private, in your browser.",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
