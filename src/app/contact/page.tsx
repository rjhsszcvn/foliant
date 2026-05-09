"use client";

import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ContactPage() {
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
        <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">Get in touch</p>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-8">
          We're listening.
        </h1>
        <p className="text-lg text-ink-muted leading-relaxed mb-10">
          Found a bug? Have an idea for a tool? Want to hire us? Write to us. We read everything, we reply to most messages within a few days.
        </p>

        <a
          href="mailto:foliantapp.team@gmail.com"
          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl border border-border-strong bg-paper hover:border-ink transition-colors"
        >
          <Mail className="w-5 h-5 text-gold-deep" />
          <span className="text-ink font-medium">foliantapp.team@gmail.com</span>
        </a>

        <div className="mt-16 pt-10 border-t border-border space-y-4 text-sm text-ink-muted">
          <p>
            <strong className="font-medium text-ink">For privacy questions:</strong> Same address. We've got nothing to hide.
          </p>
          <p>
            <strong className="font-medium text-ink">For business/press:</strong> Same address. Mention that in the subject line.
          </p>
          <p>
            <strong className="font-medium text-ink">Typical reply time:</strong> 1-3 days. Sometimes faster.
          </p>
        </div>
      </div>
    </main>
  );
}
