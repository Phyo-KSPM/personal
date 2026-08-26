import FadeIn from "@/app/components/fade-in";
import MarkdownUpload from "@/app/components/markdown-upload";
import NotesBoard from "@/app/components/notes-board";
import { listNotesByTopic } from "@/lib/data/notes";
import { type TopicSlug } from "@/lib/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { NotesView } from "@/app/components/notes-collection";

export default async function NotesWorkspace({
  topic,
  view = "cards",
  saveError,
  startAdd = false,
}: {
  topic: TopicSlug;
  view?: NotesView;
  saveError?: string;
  startAdd?: boolean;
}) {
  if (!readSupabaseEnv()) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="max-w-md text-center text-sm leading-7 text-muted">
          Copy <code className="font-mono text-wine">.env.example</code> to{" "}
          <code className="font-mono text-wine">.env.local</code> and add your
          Supabase URL and publishable key.
        </p>
      </div>
    );
  }

  const { notes, error } = await listNotesByTopic(topic);

  return (
    <FadeIn as="main" className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-8 sm:px-10">
      <NotesBoard
        topic={topic}
        initialView={view}
        notes={notes}
        saveError={saveError}
        startAdd={startAdd}
        queryError={error}
      >
        <MarkdownUpload defaultTopic={topic} />
      </NotesBoard>
    </FadeIn>
  );
}
