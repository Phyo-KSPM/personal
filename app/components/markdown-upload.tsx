"use client";

import { uploadMarkdown } from "@/app/actions/notes";
import FileDropzone from "@/app/components/file-dropzone";
import PendingButton from "@/app/components/pending-button";
import PendingOverlay from "@/app/components/pending-overlay";
import type { TopicSlug } from "@/lib/notes";

export default function MarkdownUpload({
  defaultTopic = "software",
}: {
  defaultTopic?: TopicSlug;
}) {
  return (
    <form
      action={uploadMarkdown}
      className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-wine/10 bg-white px-4 py-4"
    >
      <PendingOverlay label="Uploading file" />
      <p className="text-sm text-wine">Upload a file</p>
      <input type="hidden" name="category" value={defaultTopic} />
      <FileDropzone />
      <PendingButton
        idle="Upload file"
        busy="Uploading"
        className="h-11 w-fit cursor-pointer rounded-xl bg-wine px-5 text-sm font-medium text-ivory transition hover:bg-wine-soft disabled:cursor-wait disabled:opacity-70"
      />
    </form>
  );
}
