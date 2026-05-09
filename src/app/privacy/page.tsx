"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-tight">Foliant</Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">Legal</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-ink-muted mb-10">Last updated: May 2026</p>

        <div className="space-y-8 text-ink leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl mb-3">The short version.</h2>
            <p>
              Foliant processes files entirely in your browser. Your files never reach our servers. We do not collect, store, scan, analyze, or transmit your documents. We do not require accounts. We do not sell data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">What we process.</h2>
            <p>
              When you use a tool, your files are loaded into your browser's memory. All processing happens locally, on your device. The result is produced and handed back to you as a download. The files are never transmitted to Foliant.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">What we collect.</h2>
            <p>
              The only data we collect is basic, anonymous page-view analytics to understand which tools are used most. This includes approximate country, device type, and referring page \u2014 no personal identifiers, no IP addresses stored, no cookies for tracking.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Third parties.</h2>
            <p>
              Foliant is hosted on Vercel, which serves the pages and assets. We load fonts from Google Fonts and PDF.js rendering code from unpkg.com. None of these see your files. No advertising networks, analytics trackers, or social pixels are present.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Your rights.</h2>
            <p>
              Because we don't store your files, we have nothing to delete or export when you ask. If you have any questions about privacy, reach out: foliantapp.team@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Changes to this policy.</h2>
            <p>
              If we ever change how Foliant handles data, this page will be updated. Meterial changes will be announced on the homepage first.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
