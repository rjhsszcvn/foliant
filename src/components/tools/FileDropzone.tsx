"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File as FileIcon, X, GripVertical } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

export interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  disabled?: boolean;
  hint?: string;
  reorderable?: boolean;
}

export function FileDropzone({
  files,
  onFilesChange,
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  disabled = false,
  hint = "PDF files only",
  reorderable = false,
}: FileDropzoneProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;
      if (multiple) {
        onFilesChange([...files, ...accepted]);
      } else {
        onFilesChange([accepted[0]]);
      }
    },
    [files, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled,
  });

  const removeFile = (idx: number) => {
    const next = files.slice();
    next.splice(idx, 1);
    onFilesChange(next);
  };

  const handleDragStart = (idx: number) => {
    setDragIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReorder = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    const next = files.slice();
    const [moved] = next.splice(dragIndex, 1);
    next.splice(idx, 0, moved);
    onFilesChange(next);
    setDragIndex(null);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border border-dashed transition-all",
          "px-8 py-16 md:py-20 text-center cursor-pointer",
          isDragActive
            ? "border-gold bg-gold-soft/30"
            : "border-border-strong bg-paper hover:border-ink hover:bg-paper-warm",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 mx-auto mb-4 text-ink-muted" />
        <p className="font-serif text-xl md:text-2xl text-ink mb-2">
          {isDragActive
            ? "Drop it here"
            : files.length
            ? "Add more files"
            : "Drop files or click to browse"}
        </p>
        <p className="text-sm text-ink-muted">{hint}</p>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, idx) => (
            <li
              key={`${f.name}-${idx}`}
              draggable={reorderable}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropReorder(e, idx)}
              className={cn(
                "group flex items-center gap-4 px-5 py-4 rounded-xl",
                "bg-paper border border-border",
                reorderable && "cursor-move"
              )}
            >
              {reorderable && (
                <GripVertical className="w-4 h-4 text-ink-muted flex-shrink-0" />
              )}
              <div className="h-10 w-10 rounded-lg bg-paper-warm flex items-center justify-center flex-shrink-0">
                <FileIcon className="w-5 h-5 text-gold-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {f.name}
                </p>
                <p className="text-xs text-ink-muted">
                  {formatBytes(f.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="p-2 rounded-lg text-ink-muted hover:bg-paper-warm hover:text-ink transition-colors flex-shrink-0"
                aria-label={`Remove ${f.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
