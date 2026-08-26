"use client";

import DeleteNoteButton from "@/app/components/delete-note-button";

export default function NoteActions({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) {
  const downloadName = `${title.replace(/[^\w\s-]+/g, "").trim() || "note"}.md`;

  return (
    <div className="flex items-center gap-3">
      <a
        href={`data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`}
        download={downloadName}
        className="text-sm text-muted hover:text-wine"
      >
        Download
      </a>
      <DeleteNoteButton
        id={id}
        title={title}
        className="text-sm text-muted hover:text-wine"
      />
    </div>
  );
}
