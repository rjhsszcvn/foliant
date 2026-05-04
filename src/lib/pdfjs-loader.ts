let pdfjsLibCache: any = null;
let configured = false;

/**
 * Lazily import pdf.js in the browser only.
 * Avoids "DOMMatrix is not defined" SSR error in Next.js.
 * Uses unpkg worker URL (the correct path for v5).
 */
export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("pdf.js must run in the browser.");
  }
  if (!pdfjsLibCache) {
    pdfjsLibCache = await import("pdfjs-dist");
  }
  if (!configured) {
    const version = pdfjsLibCache.version;
    pdfjsLibCache.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    configured = true;
  }
  return pdfjsLibCache;
}
