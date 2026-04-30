import { PDFDocument } from "pdf-lib";

export interface MergeProgress {
  current: number;
  total: number;
  filename: string;
}

export interface MergeResult {
  blob: Blob;
  pageCount: number;
  size: number;
}

export async function mergePdfs(
  files: File[],
  onProgress?: (p: MergeProgress) => void
): Promise<MergeResult> {
  if (files.length < 2) {
    throw new Error("Select at least two PDFs to merge.");
  }

  const merged = await PDFDocument.create();
  merged.setCreator("Foliant");
  merged.setProducer("Foliant");

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: files.length,
        filename: file.name,
      });
    }

    const bytes = await file.arrayBuffer();

    let src;
    try {
      src = await PDFDocument.load(bytes, {
        ignoreEncryption: false,
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message.toLowerCase()
          : "";
      if (msg.includes("encrypt")) {
        throw new Error(
          `"${file.name}" is password-protected. Remove the password first.`
        );
      }
      throw new Error(
        `"${file.name}" could not be read. Is it a valid PDF?`
      );
    }

    const indices = src.getPageIndices();
    const copied = await merged.copyPages(src, indices);
    copied.forEach((page) => merged.addPage(page));
  }

  const outBytes = await merged.save({ useObjectStreams: true });
  const blob = new Blob([outBytes], { type: "application/pdf" });

  return {
    blob,
    pageCount: merged.getPageCount(),
    size: blob.size,
  };
}
