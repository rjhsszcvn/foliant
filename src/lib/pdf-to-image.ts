import JSZip from "jszip";
import { getPdfJs } from "./pdfjs-loader";

export type ImageFormat = "png" | "jpg";
export type Resolution = "standard" | "high" | "max";

export interface ToImageOptions {
  format: ImageFormat;
  resolution: Resolution;
}

export interface ToImageProgress {
  current: number;
  total: number;
}

export interface ToImageResult {
  blob: Blob;
  filename: string;
  pageCount: number;
  size: number;
  isZip: boolean;
}

const SCALE_MAP: Record<Resolution, number> = {
  standard: 1.5,
  high: 2.5,
  max: 4.0,
};

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat
): Promise<Blob> {
  const mime = format === "png" ? "image/png" : "image/jpeg";
  const quality = format === "jpg" ? 0.92 : undefined;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not encode image."));
          return;
        }
        resolve(blob);
      },
      mime,
      quality
    );
  });
}

export async function pdfToImages(
  file: File,
  options: ToImageOptions,
  onProgress?: (p: ToImageProgress) => void
): Promise<ToImageResult> {
  const pdfjsLib = await getPdfJs();
  const bytes = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdfDoc = await loadingTask.promise;
  const total = pdfDoc.numPages;
  const scale = SCALE_MAP[options.resolution];
  const base = file.name.replace(/\.pdf$/i, "");
  const ext = options.format;

  if (total === 1) {
    onProgress?.({ current: 1, total: 1 });
    const page = await pdfDoc.getPage(1);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: ctx, viewport: viewport, canvas: canvas }).promise;
    const blob = await canvasToBlob(canvas, options.format);
    canvas.width = 0;
    canvas.height = 0;
    return {
      blob,
      filename: `${base}.${ext}`,
      pageCount: 1,
      size: blob.size,
      isZip: false,
    };
  }

  const zip = new JSZip();
  const width = String(total).length;
  for (let i = 1; i <= total; i++) {
    onProgress?.({ current: i, total: total });
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: scale });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable.");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: ctx, viewport: viewport, canvas: canvas }).promise;
    const pageBlob = await canvasToBlob(canvas, options.format);
    const pageBytes = await pageBlob.arrayBuffer();
    const name = `${base}-page-${String(i).padStart(width, "0")}.${ext}`;
    zip.file(name, pageBytes);
    canvas.width = 0;
    canvas.height = 0;
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    blob: zipBlob,
    filename: `${base}-images.zip`,
    pageCount: total,
    size: zipBlob.size,
    isZip: true,
  };
}
