
import { PDFDocument } from "pdf-lib";
import { getPdfJs } from "./pdfjs-loader";

export type CompressMode = "lossless" | "lossy";
export type LossyQuality = "high" | "medium" | "low";

export interface CompressOptions {
  mode: CompressMode;
  quality: LossyQuality;
  scale?: number;
}

export interface CompressProgress {
  current: number;
  total: number;
  phase: "render" | "encode" | "save";
}

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  newSize: number;
  savedPct: number;
  pageCount: number;
  alreadyOptimized: boolean;
}

const QUALITY_MAP: Record<LossyQuality, number> = {
  high: 0.9,
  medium: 0.75,
  low: 0.5,
};

/**
 * Lossless compression: strip metadata, pack with object streams.
 * If the result is not smaller, return the original unchanged.
 * Honest default: never deliver a bigger file than what came in.
 */
export async function compressLossless(file: File): Promise<CompressResult> {
  const originalSize = file.size;
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  pdf.setTitle("");
  pdf.setAuthor("");
  pdf.setSubject("");
  pdf.setKeywords([]);
  pdf.setProducer("Foliant");
  pdf.setCreator("Foliant");
  const outBytes = await pdf.save({ useObjectStreams: true });
  const resavedSize = outBytes.byteLength;
  const pageCount = pdf.getPageCount();

  // If resaving didn't help (or made it worse), give back the original.
  if (resavedSize >= originalSize) {
    return {
      blob: new Blob([bytes], { type: "application/pdf" }),
      originalSize,
      newSize: originalSize,
      savedPct: 0,
      pageCount,
      alreadyOptimized: true,
    };
  }

  const blob = new Blob([outBytes], { type: "application/pdf" });
  return {
    blob,
    originalSize,
    newSize: blob.size,
    savedPct: Math.round((1 - blob.size / originalSize) * 100),
    pageCount,
    alreadyOptimized: false,
  };
}

async function canvasToJpegBytes(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error("Could not encode page as JPEG."));
          return;
        }
        const buf = await blob.arrayBuffer();
        resolve(new Uint8Array(buf));
      },
      "image/jpeg",
      quality
    );
  });
}

/**
 * Lossy compression: rasterize each page to JPEG, re-build PDF.
 * Text becomes images - not selectable. If result is bigger (rare edge case), return original.
 */
export async function compressLossy(
  file: File,
  options: CompressOptions,
  onProgress?: (p: CompressProgress) => void
): Promise<CompressResult> {
  const originalSize = file.size;
  const scale = options.scale || 1.5;
  const quality = QUALITY_MAP[options.quality];

  const pdfjsLib = await getPdfJs();
  const bytes = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdfDoc = await loadingTask.promise;
  const total = pdfDoc.numPages;

  const outDoc = await PDFDocument.create();
  outDoc.setCreator("Foliant");
  outDoc.setProducer("Foliant");

  for (let i = 1; i <= total; i++) {
    onProgress?.({ current: i, total: total, phase: "render" });
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context unavailable.");
    }
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: ctx, viewport: viewport, canvas: canvas }).promise;

    onProgress?.({ current: i, total: total, phase: "encode" });
    const jpegBytes = await canvasToJpegBytes(canvas, quality);
    const image = await outDoc.embedJpg(jpegBytes);
    const newPage = outDoc.addPage([canvas.width, canvas.height]);
    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.({ current: total, total: total, phase: "save" });
  const outBytes = await outDoc.save({ useObjectStreams: true });
  const newSize = outBytes.byteLength;

  if (newSize >= originalSize) {
    return {
      blob: new Blob([bytes], { type: "application/pdf" }),
      originalSize,
      newSize: originalSize,
      savedPct: 0,
      pageCount: total,
      alreadyOptimized: true,
    };
  }

  const blob = new Blob([outBytes], { type: "application/pdf" });
  return {
    blob,
    originalSize,
    newSize: blob.size,
    savedPct: Math.round((1 - blob.size / originalSize) * 100),
    pageCount: total,
    alreadyOptimized: false,
  };
}
