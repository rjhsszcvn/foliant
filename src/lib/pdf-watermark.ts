import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export type Opacity = "subtle" | "medium" | "strong";
export type Angle = 0 | 45 | -45;

export interface WatermarkOptions {
  text: string;
  opacity: Opacity;
  angle: Angle;
}

export interface WatermarkResult {
  blob: Blob;
  pageCount: number;
  size: number;
}

const OPACITY_MAP: Record<Opacity, number> = {
  subtle: 0.1,
  medium: 0.25,
  strong: 0.45,
};

export async function watermarkPdf(
  file: File,
  options: WatermarkOptions
): Promise<WatermarkResult> {
  if (!options.text.trim()) {
    throw new Error("Enter watermark text.");
  }

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error(`Could not read "${file.name}". Try selecting it again.`);
  }

  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();
  const opacity = OPACITY_MAP[options.opacity];

  for (const page of pages) {
    const { width, height } = page.getSize();
    const diagonal = Math.sqrt(width * width + height * height);
    const fontSize = Math.min(diagonal / options.text.length * 0.8, 120);
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const x = (width - textWidth) / 2;
    const y = (height - textHeight) / 2;

    page.drawText(options.text, {
      x,
      y,
      font,
      size: fontSize,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(options.angle),
    });
  }

  pdf.setCreator("Foliant");
  pdf.setProducer("Foliant");
  const outBytes = await pdf.save({ useObjectStreams: true });
  const blob = new Blob([new Uint8Array(outBytes as any)], { type: "application/pdf" });
  return {
    blob,
    pageCount: pdf.getPageCount(),
    size: blob.size,
  };
}
