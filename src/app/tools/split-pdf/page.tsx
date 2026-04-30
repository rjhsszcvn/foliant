"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import {
  getPageCount,
  parseRanges,
  extractRange,
  splitAllPages,
  type SplitResult,
  type SplitProgress,
} from "@/lib/pdf-split";
import { cn, downloadBlob, formatBytes } from "@/lib/utils";

type Mode = "all" | "range";
type Status = "idle" | "working" | "done" | "error";

export default function SplitPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("range");
  const [ranges, setRanges] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<SplitProgress | null>(null);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const file = files[0] || null;
  const canRun =
    !!file &&
    status !== "working" &&
    (mode === "all" || (mode === "range" && ranges.trim().length > 0));

  const handleFilesChange = async (next: File[]) => {
    setFiles(next);
    setPageCount(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    if (next[0]) {
      try {
        const count = await getPageCount(next[0]);
        setPageCount(count);
      } catch {
        setError("Could not read that PDF. Is it valid?");
      }
    }
  };

  const handleRun = async () => {
    if (!file) return;
    setStatus("working");
    setError(null);
    setResult(null);
    try {
      if (mode === "all") {
        const res = await splitAllPages(file, setProgress);
        setResult(res);
      } else {
        const indices = parseRanges(ranges, pageCount || 0);
        const res = await extractRange(file, indices);
        setResult(res);
      }
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
    setPageCount(null);
    setMode("range");
    setRanges("");
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
          <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-3">Tool</p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">Split PDF</h1>
          <p className="text-lg text-ink-muted leading-relaxed">
            Extract specific pages or split every page into its own file.
          </p>
        </div>

        {status !== "done" && (
          <div className="space-y-6">
            <FileDropzone
              files={files}
              onFilesChange={handleFilesChange}
              hint="One PDF - processed in your browser"
              multiple={false}
              disabled={status === "working"}
            />

            {file && pageCount !== null && (
              <div className="rounded-2xl border border-border bg-paper px-6 py-6 space-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold-deep mb-2">
                    Mode
                  </p>
                  <div className="inline-flex rounded-full bg-paper-warm p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setMode("range")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        mode === "range" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      Extract range
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("all")}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        mode === "all" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"
                      )}
                    >
                      All pages
                    </button>
                  </div>
                </div>

                {mode === "range" && (
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Pages to extract
                    </label>
                    <input
                      type="text"
                      value={ranges}
                      onChange={(e) => setRanges(e.target.value)}
                      placeholder="e.g. 1-3, 5, 8-10"
                      className="w-full px-4 py-3 rounded-xl border border-border-strong bg-paper-warm text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-soft transition"
                    />
                    <p className="mt-2 text-xs text-ink-muted">
                      {pageCount} pages total
                    </p>
                  </div>
                )}

                {mode === "all" && (
                  <p className="text-sm text-ink-muted">
                    Each of the {pageCount} pages becomes its own PDF. You'll get a ZIP.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
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
                {status === "working" ? "Splitting" : "Split PDF"}
              </button>
            </div>
          </div>
        )}

        {status === "working" && progress && (
          <div className="mt-6 rounded-xl border border-border bg-paper-warm px-5 py-4 text-sm">
            <p className="text-ink">
              Splitting page {progress.current} of {progress.total}
            </p>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-paper px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-soft mb-5">
              <Check className="w-6 h-6 text-gold-deep" />
            </div>
            <h2 className="font-serif text-3xl tracking-tight mb-2">Split.</h2>
            <p className="text-sm text-ink-muted mb-6">
              {result.partCount} {result.partCount === 1 ? "file" : "files"} - {formatBytes(result.size)}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ink text-paper text-sm font-medium hover:bg-ink-soft transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-ink hover:text-gold-deep transition-colors"
              >
                Split another
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
