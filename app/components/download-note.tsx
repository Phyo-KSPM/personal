"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DOWNLOAD_FORMATS } from "@/lib/note-file-types";

export default function DownloadNote({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-wine/25 bg-white px-3.5 text-sm font-medium text-wine transition hover:bg-sand"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 4v11.5M7.5 11.5 12 16l4.5-4.5M5 19.5h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Download
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 9.5 12 15.5 18 9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="download-menu"
            role="menu"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-20 mt-2 min-w-[12.5rem] overflow-hidden rounded-xl border border-wine/12 bg-white py-1 shadow-[0_16px_32px_-20px_rgba(42,22,24,0.55)]"
          >
            {DOWNLOAD_FORMATS.map((format) => (
              <a
                key={format.id}
                role="menuitem"
                href={`/home/notes/${id}/download?format=${format.id}`}
                className="flex items-center justify-between px-3.5 py-2 text-sm text-wine hover:bg-sand"
                onClick={() => setOpen(false)}
              >
                {format.label}
                <span className="text-xs text-muted">.{format.ext}</span>
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
