"use client";
import { JsonLd, toolSchema, breadcrumbSchema } from "@/components/JsonLd";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  imagesToPdf,
  type PageSize,
  type Orientation,
  type ImageToPdfProgress,
  type ImageToPdfResult,
} from "@/lib/image-to-pdf";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("auto");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<ImageToPdfProgress | null>(null);
  const [result, setResult] = useState<ImageToPdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canRun = files.length >= 1 && status !== "working";

  const handleRun = async () => {
    if (!files.length) return;
    setStatus("working");
    setError(null);
    setResult(null);
    setProgress(null);
    try {
      const res = await imagesToPdf(files, { pageSize, orientation }, setProgress);
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, "images.pdf");
  };

  const handleReset = () => {
    setFiles([]);
    setPageSize("auto");
    setOrientation("portrait");
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1">
      <JsonLd data={toolSchema({ name: "Image to PDF", description: "Bundle JPGs and PNGs into a polished PDF.", slug: "image-to-pdf" })} />
      <JsonLd data={breadcrumbSchema({ name: "Image to PDF", slug: "image-to-pdf" })} />
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
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Image to PDF</h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Bundle JPGs and PNGs into a polished PDF. Drag to reorder.
          </p>
        </div>

        {status !== "done" && (
          <div className="space-y-6">
            <FileDropzone
              files={files}
              onFilesChange={setFiles}
              accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
              hint="JPG or PNG images - processed in your browser"
              reorderable
              disabled={status === "working"}
            />

            <div className="rounded-2xl border border-border bg-paper px-6 py-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Page size</p>
                <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                  {(["auto", "a4", "letter"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPageSize(p)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium uppercase transition-colors",
                        pageSize === p ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {pageSize === "auto" && (
                  <p className="mt-2 text-xs text-ink-muted">
                    Each page matches its image dimensions.
                  </p>
                )}
              </div>

              {pageSize !== "auto" && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Orientation</p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    {(["portrait", "landscape"] as const).map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOrientation(o)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
                          orientation === o ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
                {status === "working" ? "Converting" : "Convert to PDF"}
              </button>
            </div>
          </div>
        )}

        {status === "working" && progress && (
          <div className="mt-6 rounded-xl border border-border bg-paper-warm px-5 py-4 text-sm">
            <p className="text-ink">Adding {progress.current} of {progress.total}</p>
            <p className="text-ink-muted truncate">{progress.filename}</p>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">Converted.</h2>
            <p className="text-sm text-ink-muted mb-6">
              {result.pageCount} pages - {formatBytes(result.size)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors">
                Convert more
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
