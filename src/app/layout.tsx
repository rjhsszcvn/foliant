import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foliant.app"),
  title: {
    default: "Foliant — Every document, handled.",
    template: "%s · Foliant",
  },
  description:
    "The premium document toolkit. Merge, split, compress, convert. Your files never leave your device.",
  keywords: [
    "PDF tools",
    "merge PDF",
    "split PDF",
    "compress PDF",
    "PDF to image",
    "image to PDF",
    "document tools",
    "private PDF editor",
  ],
  authors: [{ name: "Foliant" }],
  creator: "Foliant",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://foliant.app",
    title: "Foliant — Every document, handled.",
    description:
      "The premium document toolkit. Process files privately, in your browser.",
    siteName: "Foliant",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foliant — Every document, handled.",
    description:
      "The premium document toolkit. Process files privately, in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
