"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
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
        <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">About</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-10">
          Why Foliant exists.
        </h1>
        <div className="space-y-6 text-lg text-ink leading-relaxed">
          <p>
            We built Foliant because every PDF tool we used either uploaded our files to strangers' servers, drowned us in ads, or made us pay to merge two documents.
          </p>
          <p>
            So we built the version we wanted to use. Everything runs in your browser \u2014 your files never leave your device. No accounts. No daily limits. No tricks.
          </p>
        </div>

        <div className="mt-16 pt-10 border-t border-border space-y-8">
          <section>
            <h2 className="font-serif text-2xl mb-3">Our principles.</h2>
            <ul className="space-y-3 text-ink">
              <li><strong className="font-medium">Privacy first.</strong> Your files stay on your device. Forever. No exceptions.</li>
              <li><strong className="font-medium">No user hostage.</strong> No accounts required. No daily limits. No ad-walled results.</li>
              <li><strong className="font-medium">Real quality.</strong> If we can't do it well, we don't ship it.</li>
              <li><strong className="font-medium">Honest about tradeoffs.</strong> If a tool has a cost (like image-based compression), we say so upfront.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Who builds this?</h2>
            <p className="text-ink">
              Foliant is an indie project built by a small team who cares deeply about document productivity tools. No investors, no growth targets, no pressure to add dark patterns.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">What's next.</h2>
            <p className="text-ink">
              Five tools today. More coming \u2014 Sign PDF, Watermark, Unlock, OCR, and anything else that fits the standard. If there's a tool you wish existed, tell us.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
