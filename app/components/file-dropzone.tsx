"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDropzone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

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
    accept: {
      "text/markdown": [".md"],
      "text/plain": [".txt"],
    },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps({
        onClick: () => inputRef.current?.click(),
      })}
      className={`cursor-pointer rounded-xl border border-dashed px-4 py-6 text-center transition ${
        isDragActive ? "border-copper bg-sand/80" : "border-wine/15 bg-sand/40"
      }`}
    >
      <input
        ref={inputRef}
        id="file"
        name="file"
        type="file"
        accept=".md,.txt,text/markdown,text/plain"
        required
        className="sr-only"
        onChange={(event) => assignFile(event.target.files?.[0])}
      />
      <p className="text-sm text-wine">
        {fileName || "Drop a .md or .txt file, or click to choose"}
      </p>
    </div>
  );
}
