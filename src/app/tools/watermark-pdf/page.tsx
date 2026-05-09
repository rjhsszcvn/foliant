"use client";
import { JsonLd, toolSchema, breadcrumbSchema } from "@/components/JsonLd";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  watermarkPdf,
  type Opacity,
  type Angle,
  type WatermarkResult,
} from "@/lib/pdf-watermark";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";

export default function WatermarkPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState<Opacity>("medium");
  const [angle, setAngle] = useState<Angle>(45);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0] || null;
  const canRun = !!file && text.trim().length > 0 && status !== "working";

  const handleRun = async () => {
    if (!file) return;
    setStatus("working");
    setError(null);
    setResult(null);
    try {
      const res = await watermarkPdf(file, { text, opacity, angle });
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const base = file.name.replace(/\.pdf$/i, "");
    downloadBlob(result.blob, `${base}-watermarked.pdf`);
  };

  const handleReset = () => {
    setFiles([]);
    setText("CONFIDENTIAL");
    setOpacity("medium");
    setAngle(45);
    setStatus("idle");
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1">
      <JsonLd data={toolSchema({ name: "Watermark PDF", description: "Add text watermarks to every page of a PDF. Adjustable opacity and angle.", slug: "watermark-pdf" })} />
      <JsonLd data={breadcrumbSchema({ name: "Watermark PDF", slug: "watermark-pdf" })} />
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl tracking-tight">Foliant</Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All tools
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">Tool</p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Watermark PDF</h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Add a text watermark to every page. Choose opacity and angle that fit.
          </p>
        </div>

        {status !== "done" && (
          <div className="space-y-6">
            <FileDropzone
              files={files}
              onFilesChange={setFiles}
              hint="One PDF - processed in your browser"
              multiple={false}
              disabled={status === "working"}
            />

            {file && (
              <div className="rounded-2xl border border-border bg-paper px-6 py-6 space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Watermark text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, DRAFT, Company Name"
                    className="w-full px-4 py-3 rounded-xl border border-border-strong bg-paper-warm text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft transition"
                  />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Opacity</p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    {(["subtle", "medium", "strong"] as const).map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOpacity(o)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
                          opacity === o ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Angle</p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    {([0, 45, -45] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAngle(a)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                          angle === a ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {a}{"\u00b0"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={!canRun}
                onClick={handleRun}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3.5 rounded-full",
                  "bg-ink text-paper text-sm font-medium",
                  "hover:bg-ink-soft transition-colors",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {status === "working" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "working" ? "Applying" : "Apply watermark"}
              </button>
            </div>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">Watermarked.</h2>
            <p className="text-sm text-ink-muted mb-6">
              {result.pageCount} pages - {formatBytes(result.size)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors">
                Watermark another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
