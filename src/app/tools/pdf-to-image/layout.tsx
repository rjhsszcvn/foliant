import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Image",
  description: "Convert PDF pages to high-resolution PNG or JPG. Free, private, in your browser.",
  alternates: {
    canonical: "https://foliant.app/tools/pdf-to-image",
  },
  openGraph: {
    title: "PDF to Image - Foliant",
    description: "Convert PDF pages to high-resolution PNG or JPG. Free, private, in your browser.",
    url: "https://foliant.app/tools/pdf-to-image",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Image - Foliant",
    description: "Convert PDF pages to high-resolution PNG or JPG. Free, private, in your browser.",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
