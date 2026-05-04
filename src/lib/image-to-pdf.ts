import { PDFDocument, PageSizes } from "pdf-lib";

export type PageSize = "auto" | "a4" | "letter";
export type Orientation = "portrait" | "landscape";

export interface ImageToPdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  margin?: number;
}

export interface ImageToPdfProgress {
  current: number;
  total: number;
  filename: string;
}

export interface ImageToPdfResult {
  blob: Blob;
  pageCount: number;
  size: number;
}

const PAGE_DIMS: Record<Exclude<PageSize, "auto">, [number, number]> = {
  a4: PageSizes.A4,
  letter: PageSizes.Letter,
};

function applyOrientation(
  dims: [number, number],
  orientation: Orientation
): [number, number] {
  const [w, h] = dims;
  if (orientation === "landscape") {
    return [Math.max(w, h), Math.min(w, h)];
  }
  return [Math.min(w, h), Math.max(w, h)];
}

export async function imagesToPdf(
  files: File[],
  options: ImageToPdfOptions,
  onProgress?: (p: ImageToPdfProgress) => void
): Promise<ImageToPdfResult> {
  if (files.length === 0) {
    throw new Error("Add at least one image.");
  }

  const pdf = await PDFDocument.create();
  pdf.setCreator("Foliant");
  pdf.setProducer("Foliant");
  const margin = options.margin ?? 24;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.({ current: i + 1, total: files.length, filename: file.name });

    const bytes = await file.arrayBuffer();
    const isPng = file.type === "image/png" || /\.png$/i.test(file.name);
    const isJpg =
      file.type === "image/jpeg" || /\.jpe?$/i.test(file.name);
    if (!isPng && !isJpg) {
      throw new Error(
        `"${file.name}" isn't a PNG or JPG. Only those are supported.`
      );
    }

    const image = isPng
      ? await pdf.embedPng(bytes)
      : await pdf.embedJpg(bytes);

    const imgW = image.width;
    const imgH = image.height;
    let pageW: number;
    let pageH: number;

    if (options.pageSize === "auto") {
      pageW = imgW;
      pageH = imgH;
    } else {
      const base = PAGE_DIMS[options.pageSize];
      [pageW, pageH] = applyOrientation(base, options.orientation);
    }

    const page = pdf.addPage([pageW, pageH]);

    if (options.pageSize === "auto") {
      page.drawImage(image, { x: 0, y: 0, width: pageW, height: pageH });
    } else {
      const availW = pageW - margin * 2;
      const availH = pageH - margin * 2;
      const scale = Math.min(availW / imgW, availH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const x = (pageW - drawW) / 2;
      const y = (pageH - drawH) / 2;
      page.drawImage(image, { x, y, width: drawW, height: drawH });
    }
  }

  const outBytes = await pdf.save({ useObjectStreams: true });
  const blob = new Blob([outBytes], { type: "application/pdf" });
  return {
    blob,
    pageCount: pdf.getPageCount(),
    size: blob.size,
  };
}
