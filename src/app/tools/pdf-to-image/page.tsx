"use client";
import { JsonLd, toolSchema, breadcrumbSchema } from "@/components/JsonLd";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  pdfToImages,
  type ImageFormat,
  type Resolution,
  type ToImageProgress,
  type ToImageResult,
} from "@/lib/pdf-to-image";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";

export default function PdfToImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<ImageFormat>("png");
  const [resolution, setResolution] = useState<Resolution>("high");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<ToImageProgress | null>(null);
  const [result, setResult] = useState<ToImageResult | null>(null);
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
      const res = await pdfToImages(file, { format, resolution }, setProgress);
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
  };

  const handleReset = () => {
    setFiles([]);
    setFormat("png");
    setResolution("high");
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1">
      <JsonLd data={toolSchema({ name: "PDF to Image", description: "Convert PDF pages to high-resolution PNG or JPG.", slug: "pdf-to-image" })} />
      <JsonLd data={breadcrumbSchema({ name: "PDF to Image", slug: "pdf-to-image" })} />
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
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">PDF to Image</h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Convert every page to a high-resolution PNG or JPG.
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
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Format</p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setFormat("png")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        format === "png" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      PNG
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat("jpg")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        format === "jpg" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      JPG
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">Resolution</p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    {(["standard", "high", "max"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setResolution(r)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors",
                          resolution === r ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                        )}
                      >
                        {r}
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
                {status === "working" ? "Converting" : "Convert PDF"}
              </button>
            </div>
          </div>
        )}

        {status === "working" && progress && (
          <div className="mt-6 rounded-xl border border-border bg-paper-warm px-5 py-4 text-sm">
            <p className="text-ink">Rendering page {progress.current} of {progress.total}</p>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">Converted.</h2>
            <p className="text-sm text-ink-muted mb-6">
              {result.pageCount} {result.pageCount === 1 ? "image" : "images"} - {formatBytes(result.size)}
              {result.isZip && " - ZIP"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors">
                Convert another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
