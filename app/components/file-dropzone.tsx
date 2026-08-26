"use client";

import { useCallback, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useDropzone } from "react-dropzone";
import { isNoteFile } from "@/lib/note-file-types";

export default function FileDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const { pending } = useFormStatus();

  const assignFile = useCallback((file?: File) => {
    const input = inputRef.current;
    if (!file || !input) {
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    setFileName(file.name);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files) => assignFile(files[0]),
    onDropRejected: (rejections) => {
      const file = rejections[0]?.file;
      if (file && isNoteFile(file)) {
        assignFile(file);
      }
    },
    accept: {
      "text/markdown": [".md"],
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
    disabled: pending,
  });
  const rootProps = getRootProps();

  return (
    <div
      {...rootProps}
      onClick={(event) => {
        rootProps.onClick?.(event);
        if (!pending) {
          inputRef.current?.click();
        }
      }}
    >
      <motion.div
        animate={{ scale: isDragActive ? 1.015 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={`rounded-xl border border-dashed px-4 py-6 text-center transition-colors ${
          pending ? "cursor-wait opacity-60" : "cursor-pointer"
        } ${
          isDragActive
            ? "border-copper bg-sand/80"
            : "border-wine/15 bg-sand/40"
        }`}
      >
        <input
          ref={inputRef}
          id="file"
          name="file"
          type="file"
          accept=".md,.txt,.pdf,.doc,.docx,text/markdown,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          required
          disabled={pending}
          className="sr-only"
          onChange={(event) => assignFile(event.target.files?.[0])}
        />
        <p className="text-sm text-wine">
          {pending
            ? "Uploading…"
            : fileName || "Drop a Markdown, text, PDF, or Word file, or click to choose"}
        </p>
      </motion.div>
    </div>
  );
}
