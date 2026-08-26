"use client";

import DeleteNoteButton from "@/app/components/delete-note-button";
import DownloadNote from "@/app/components/download-note";

export default function NoteActions({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DownloadNote id={id} />
      <DeleteNoteButton id={id} title={title} />
    </div>
  );
}
