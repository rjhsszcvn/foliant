import Link from "next/link";
import { ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs into a single document, in order.",
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract pages or split a PDF into separate files.",
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Shrink file size while preserving quality.",
  },
  {
    slug: "pdf-to-image",
    name: "PDF to Image",
    description: "Convert pages to high-resolution PNG or JPG.",
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    description: "Bundle JPGs and PNGs into a polished PDF.",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Foliant
          </Link>
          <nav className="flex items-center gap-8 text-sm text-ink-muted">
            <Link href="#tools" className="hover:text-ink transition-colors">Tools</Link>
            <Link href="#why" className="hover:text-ink transition-colors">Why Foliant</Link>
          </nav>
        </div>
      </header>

      <section className="bg-paper-grain">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-6">
            The premium document toolkit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink">
            Every document,
            <br />
            <span className="italic text-gold-deep">handled.</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Merge, split, compress, and convert - beautifully.
            Your files never leave your device.
          </p>
          <div className="mt-12 flex items-center justify-center gap-4">
            <Link
              href="#tools"
              className={cn(
                "group inline-flex items-center gap-2 px-6 py-3.5 rounded-full",
                "bg-ink text-paper text-sm font-medium",
                "hover:bg-ink-soft transition-colors"
              )}
            >
              Choose a tool
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#why"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-ink hover:text-gold-deep transition-colors"
            >
              Why Foliant
            </Link>
          </div>
        </div>
      </section>

      <section id="tools" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-4">
              Tools
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
              Five tools. Done excellently.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-paper p-8 hover:bg-paper-warm transition-colors flex flex-col justify-between min-h-[200px]"
              >
                <div>
                  <h3 className="font-serif text-2xl tracking-tight mb-2 group-hover:text-gold-deep transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-muted group-hover:text-gold-deep transition-colors">
                  Open
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
            <div className="bg-paper-warm p-8 flex items-center justify-center min-h-[200px]">
              <p className="text-sm text-ink-muted text-center italic font-serif">
                More tools, soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-border bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">
              Why Foliant
            </p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight max-w-3xl">
              The tools you use every day deserve real craft.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <Lock className="w-6 h-6 text-gold mb-4" />
              <h3 className="font-serif text-xl mb-2">Private by default</h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                Files are processed in your browser. They never touch our servers, never get logged, never get scanned.
              </p>
            </div>
            <div>
              <Zap className="w-6 h-6 text-gold mb-4" />
              <h3 className="font-serif text-xl mb-2">Fast, no waiting room</h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                No upload bars, no daily limits, no premium gate. Drop your file, get the result, move on with your day.
              </p>
            </div>
            <div>
              <Shield className="w-6 h-6 text-gold mb-4" />
              <h3 className="font-serif text-xl mb-2">Built to last</h3>
              <p className="text-sm text-paper/70 leading-relaxed">
                No ads, no tracking, no dark patterns. A tool you can keep in your toolkit for years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg">Foliant</p>
          <p className="text-xs text-ink-muted">
            Copyright 2026 Foliant. Every document, handled.
          </p>
        </div>
      </footer>
    </main>
  );
}
