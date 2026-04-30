"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { mergePdfs, type MergeProgress, type MergeResult } from "@/lib/pdf-merge";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Status = "idle" | "working" | "done" | "error";
export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canRun = files.length >= 2 && status !== "working";

  const handleMerge = async () => {
    setStatus("working");
    setError(null);
    setResult(null);
    try {
      const res = await mergePdfs(files, setProgress);
      setResult(res);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, "merged-pdf.pdf");
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(null);
    setResult(null);
    setError(null);
  };

  return (
    <main className="flex-1">
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
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">
            Tool
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            Merge PDF
          </h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Combine multiple PDFs into a single document. Drag to reorder.
          </p>
        </div>

        {status !== "done" && (
          <div className="space-y-6">
            <FileDropzone
              files={files}
              onFilesChange={setFiles}
              hint="PDF files only - processed in your browser"
              reorderable
              disabled={status === "working"}
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-ink-muted">
                {files.length === 0
                  ? "Add two or more PDFs to begin."
                  : files.length === 1
                  ? "Add at least one more PDF."
                  : `${files.length} files ready.`}
              </p>
              <button
                type="button"
                disabled={!canRun}
                onClick={handleMerge}
                className={cn(
                  "inline-flex items-center gap-2 px-6 py-3.5 rounded-full",
                  "bg-ink text-paper text-sm font-medium",
                  "hover:bg-ink-soft transition-colors",
                  "disabled:opacity-40 disabled:cursor-not-allowed"
                )}
              >
                {status === "working" && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === "working" ? "Merging" : "Merge PDFs"}
              </button>
            </div>

            {status === "working" && progress && (
              <div className="rounded-xl border border-border bg-paper-warm px-5 py-4 text-sm">
                <p className="text-ink">
                  Reading {progress.current} of {progress.total}
                </p>
                <p className="text-ink-muted truncate">{progress.filename}</p>
              </div>
            )}
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">
              Merged.
            </h2>
            <p className="text-sm text-ink-muted mb-6">
              {result.pageCount} pages - {formatBytes(result.size)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors">
                Merge another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
