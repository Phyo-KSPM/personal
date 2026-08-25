import { uploadMarkdown } from "@/app/actions/notes";
import FileDropzone from "@/app/components/file-dropzone";
import type { TopicSlug } from "@/lib/notes";

export default function MarkdownUpload({
  defaultTopic = "software",
}: {
  defaultTopic?: TopicSlug;
}) {
  return (
    <form
      action={uploadMarkdown}
      className="flex flex-col gap-3 rounded-2xl border border-wine/10 bg-white px-4 py-4"
    >
      <p className="text-sm text-wine">Upload a file</p>
      <input type="hidden" name="category" value={defaultTopic} />
      <FileDropzone />
      <button
        type="submit"
        className="h-11 w-fit cursor-pointer rounded-xl bg-wine px-5 text-sm font-medium text-ivory transition hover:bg-wine-soft"
      >
        Upload file
      </button>
    </form>
  );
}
