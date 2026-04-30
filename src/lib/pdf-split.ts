import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

export interface SplitProgress {
  current: number;
  total: number;
}

export interface SplitResult {
  blob: Blob;
  filename: string;
  partCount: number;
  size: number;
}

/**
 * Parse a range string like "1-3, 5, 8-10" into zone-indexed page indices.
 * TotalPages is 1-indexed from the user's perspective; we return 0-indexed.
 */
export function parseRanges(raw: string, totalPages: number): number[] {
  const indices: number[] = [];
  const seen = new Set<number>();
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    throw new Error("Enter at least one page range.");
  }
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range: "${part}"`);
      }
      if (start < 1 || end > totalPages || start > end) {
        throw new Error(`Range "${part}" is outside 1-${totalPages}`);
      }
      for (let i = start; i <= end; i++) {
        if (!seen.has(i)) {
          seen.add(i);
          indices.push(i - 1);
        }
      }
    } else {
      const n = parseInt(part, 10);
      if (isNaN(n)) {
        throw new Error(`Invalid page: "${part}"`);
      }
      if (n < 1 || n > totalPages) {
        throw new Error(`Page "${n}" is outside 1-${totalPages}`);
      }
      if (!seen.has(n)) {
        seen.add(n);
        indices.push(n - 1);
      }
    }
  }
  return indices;
}

export async function getPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return pdf.getPageCount();
}

export async function extractRange(
  file: File,
  pageIndices: number[]
): Promise<SplitResult> {
  if (pageIndices.length === 0) {
    throw new Error("No pages selected.");
  }
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  out.setCreator("Foliant");
  const copied = await out.copyPages(src, pageIndices);
  copied.forEach((p) => out.addPage(p));
  const outBytes = await out.save({ useObjectStreams: true });
  const blob = new Blob([outBytes], { type: "application/pdf" });
  const base = file.name.replace(/\.pdf$/i, "");
  return {
    blob,
    filename: `${base}-extract.pdf`,
    partCount: 1,
    size: blob.size,
  };
}

export async function splitAllPages(
  file: File,
  onProgress?: (p: SplitProgress) => void
): Promise<SplitResult> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const total = src.getPageCount();
  const zip = new JSZip();
  const base = file.name.replace(/\.pdf$/i, "");
  const width = String(total).length;

  for (let i = 0; i < total; i++) {
    onProgress?.({ current: i + 1, total: total });
    const out = await PDFDocument.create();
    out.setCreator("Foliant");
    const [p] = await out.copyPages(src, [i]);
    out.addPage(p);
    const b = await out.save({ useObjectStreams: true });
    const name = `${base}-page-${String(i + 1).padStart(width, "0")}.pdf`;
    zip.file(name, b);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    blob: zipBlob,
    filename: `${base}-split.zip`,
    partCount: total,
    size: zipBlob.size,
  };
}
