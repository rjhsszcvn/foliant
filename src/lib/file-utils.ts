

export interface PreparedFile {
  file: File;
  bytes: Uint8Array;
  name: string;
  size: number;
}

/**
 * Read a File into memory immediately. Protects against NotReadableError
 * when the File handle goes stale later (mobile, share-sheet, cloud sync).
 */
export async function prepareFile(file: File): Promise<PreparedFile> {
  const buffer = await file.arrayBuffer();
  return {
    file,
    bytes: new Uint8Array(buffer),
    name: file.name,
    size: file.size,
  };
}
