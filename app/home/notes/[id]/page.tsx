import { notFound } from "next/navigation";
import { deleteNote } from "@/app/actions/notes";
import MarkdownBody from "@/app/components/markdown-body";
import PendingButton from "@/app/components/pending-button";
import { parseTopic, topicLabel } from "@/lib/notes";
import { createClient } from "@/lib/supabase/server";

export default async function NotePage({
  params,
}: PageProps<"/home/notes/[id]">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: note } = await supabase
    .from("notes")
    .select("id, title, content, category, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!note) {
    notFound();
  }

  const category = parseTopic(note.category);
  const downloadName = `${note.title.replace(/[^\w\s-]+/g, "").trim() || "note"}.md`;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            {topicLabel(category)}
          </p>
          <p className="mt-2 text-xs text-muted">
            {new Date(note.updated_at || note.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`data:text/markdown;charset=utf-8,${encodeURIComponent(note.content)}`}
            download={downloadName}
            className="text-sm text-muted transition hover:text-wine"
          >
            Download
          </a>
          <form action={deleteNote}>
            <input type="hidden" name="id" value={note.id} />
            <PendingButton
              idle="Delete"
              busy="Deleting"
              className="text-sm text-muted transition hover:text-wine disabled:cursor-wait disabled:opacity-70"
            />
          </form>
        </div>
      </div>

      <article className="rounded-2xl border border-wine/8 bg-white px-5 py-6 sm:px-8 sm:py-8">
        <MarkdownBody content={note.content} />
      </article>
    </main>
  );
}
