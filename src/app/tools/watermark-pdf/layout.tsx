import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF",
  description: "Add text watermarks to every page of a PDF. Adjustable opacity and angle. Free, private, in your browser.",
  alternates: { canonical: "https://foliant.app/tools/watermark-pdf" },
  openGraph: {
    title: "Watermark PDF - Foliant",
    description: "Add text watermarks to every page of a PDF. Adjustable opacity and angle. Free, private, in your browser.",
    url: "https://foliant.app/tools/watermark-pdf",
    type: "website",
  },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}
