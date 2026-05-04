"use client";
import { JsonLd, toolSchema, breadcrumbSchema } from "@/components/JsonLd";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download, Info } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  compressLossless,
  compressLossy,
  type CompressMode,
  type LossyQuality,
  type CompressProgress,
  type CompressResult,
} from "@/lib/pdf-compress";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";

export default function CompressPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<CompressMode>("lossless");
  const [quality, setQuality] = useState<LossyQuality>("medium");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<CompressProgress | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0] || null;
  const canRun = !!file && status !== "working";

  const handleRun = async () => {
    if (!file) return;
    setStatus("working");
    setError(null);
    setResult(null);
    setProgress(null);
    try {
      const res =
        mode === "lossless"
          ? await compressLossless(file)
          : await compressLossy(file, { mode, quality }, setProgress);
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
    downloadBlob(result.blob, `${base}-compressed.pdf`);
  };

  const handleReset = () => {
    setFiles([]);
    setMode("lossless");
    setQuality("medium");
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1">
      <JsonLd data={toolSchema({ name: "Compress PDF", description: "Shrink PDF file size while preserving quality.", slug: "compress-pdf" })} />
      <JsonLd data={breadcrumbSchema({ name: "Compress PDF", slug: "compress-pdf" })} />
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
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Compress PDF</h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Shrink file size, honestly. Choose a mode that fits your needs.
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("lossless")}
                    className={cn(
                      "text-left rounded-2xl border p-5 transition-all",
                      mode === "lossless"
                        ? "border-ink bg-paper ring-2 ring-ink"
                        : "border-border bg-paper hover:border-ink-muted"
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">
                      Recommended
                    </p>
                    <h3 className="font-serif text-xl mb-1">Lossless</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      Strip metadata, repack structure. Text stays crisp. 5-30% smaller.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("lossy")}
                    className={cn(
                      "text-left rounded-2xl border p-5 transition-all",
                      mode === "lossy"
                        ? "border-ink bg-paper ring-2 ring-ink"
                        : "border-border bg-paper hover:border-ink-muted"
                    )}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">
                      Maximum shrink
                    </p>
                    <h3 className="font-serif text-xl mb-1">Smaller</h3>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      Pages become images. Text stops being selectable. 40-80% smaller.
                    </p>
                  </button>
                </div>

                {mode === "lossy" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-gold-soft bg-gold-soft/20 px-5 py-4 flex gap-3 items-start">
                      <Info className="w-5 h-5 text-gold-deep flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-ink leading-relaxed">
                        <strong className="font-medium">Heads up:</strong> {}
                        Smaller mode rasterizes each page to an image. Text can't be selected or searched afterwards. If that matters, use Lossless.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink mb-3">Image quality</p>
                      <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                        {(["high", "medium", "low"] as const).map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuality(q)}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
                              quality === q ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                            )}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                {status === "working" ? "Compressing" : "Compress PDF"}
              </button>
            </div>
          </div>
        )}

        {status === "working" && progress && (
          <div className="mt-6 rounded-xl border border-border bg-paper-warm px-5 py-4 text-sm">
            <p className="text-ink capitalize">
              {progress.phase} page {progress.current} of {progress.total}
            </p>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">{result.alreadyOptimized ? "Already optimized." : "Compressed."}</h2>
            <div className="flex items-center justify-center gap-6 mb-6 text-sm">
              <div>
                <p className="text-ink-muted text-xs uppercase tracking-wider mb-1">Before</p>
                <p className="font-medium">{formatBytes(result.originalSize)}</p>
              </div>
              <div className="text-gold-deep font-serif italic text-lg">{"→"}</div>
              <div>
                <p className="text-ink-muted text-xs uppercase tracking-wider mb-1">After</p>
                <p className="font-medium">{formatBytes(result.newSize)}</p>
              </div>
            </div>
            <p className="text-sm text-gold-deep font-medium mb-6">
              {result.alreadyOptimized ? "This file is already as small as it can get without losing quality. Try Smaller mode if you need more aggressive compression." : `${result.savedPct}% smaller`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors">
                Compress another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
