"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

async function writeClipboard(text: string, pre: HTMLPreElement) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(pre);
  selection?.removeAllRanges();
  selection?.addRange(range);

  const copied = document.execCommand("copy");
  selection?.removeAllRanges();
  if (copied) {
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "0";
  area.style.top = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  area.setSelectionRange(0, area.value.length);
  const fallback = document.execCommand("copy");
  area.remove();

  if (!fallback) {
    throw new Error("copy failed");
  }
}

export default function CopyablePre({
  children,
  ...props
}: {
  children?: ReactNode;
} & React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    const pre = preRef.current;
    const text = pre?.innerText.replace(/\n$/, "") ?? "";

    if (!pre || !text.trim()) {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2000);
      return;
    }

    try {
      await writeClipboard(text, pre);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    window.setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => void copy()}
        className="absolute top-2 right-2 z-10 rounded-lg bg-ivory/12 px-2.5 py-1 text-xs text-ivory transition hover:bg-ivory/20"
      >
        {status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy"}
      </motion.button>
      <pre
        {...props}
        ref={preRef}
        className="m-0 overflow-x-auto pr-16 select-text"
      >
        {children}
      </pre>
    </div>
  );
}
