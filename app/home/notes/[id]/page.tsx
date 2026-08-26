import { notFound } from "next/navigation";
import FadeIn from "@/app/components/fade-in";
import MarkdownBody from "@/app/components/markdown-body";
import NoteActions from "@/app/components/note-actions";
import PageBack from "@/app/components/workspace-back";
import { getNoteById } from "@/lib/data/notes";
import { parseTopic, topicLabel, topicPath } from "@/lib/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/home/notes/[id]">): Promise<Metadata> {
  if (!readSupabaseEnv()) {
    return { title: "Note" };
  }

  const { id } = await params;
  const note = await getNoteById(id);

  return {
    title: note?.title ?? "Note",
    robots: { index: false, follow: false },
  };
}

export default async function NotePage({
  params,
}: PageProps<"/home/notes/[id]">) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  const category = parseTopic(note.category);

  return (
    <FadeIn as="main" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8 sm:px-10">
      <PageBack href={topicPath(category)} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-muted uppercase">
            {topicLabel(category)}
          </p>
          <p className="mt-2 text-xs text-muted">
            {new Date(note.updated_at || note.created_at).toLocaleString()}
          </p>
        </div>
        <NoteActions id={note.id} title={note.title} content={note.content} />
      </div>

      <article className="rounded-2xl border border-wine/8 bg-white px-5 py-6 sm:px-8 sm:py-8">
        <MarkdownBody content={note.content} />
      </article>
    </FadeIn>
  );
}
