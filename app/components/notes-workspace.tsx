import AddNote from "@/app/components/add-note";
import MarkdownUpload from "@/app/components/markdown-upload";
import NotesCollection, { type NotesView } from "@/app/components/notes-collection";
import { isNotesSchemaError, type Note, type TopicSlug } from "@/lib/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, category, created_at, updated_at")
    .eq("category", topic)
    .order("created_at", { ascending: false });

  const notes = (data ?? []) as Note[];
  const tableMissing =
    isNotesSchemaError(error?.message) || isNotesSchemaError(saveError);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-8 sm:px-10">
      <AddNote
        topic={topic}
        view={view}
        saveError={tableMissing ? undefined : saveError}
        startOpen={startAdd}
      >
        <MarkdownUpload defaultTopic={topic} />
      </AddNote>

      {tableMissing ? (
        <p className="rounded-2xl border border-gold/30 bg-sand/70 px-4 py-3 text-sm leading-6 text-muted">
          The notes table is missing. In Supabase, open SQL Editor, paste{" "}
          <code className="font-mono text-wine">supabase/schema.sql</code>, then
          click Run. After it succeeds, refresh this page.
        </p>
      ) : null}

      {error && !tableMissing ? (
        <p className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]">
          {error.message}
        </p>
      ) : null}

      {!tableMissing ? <NotesCollection notes={notes} view={view} /> : null}
    </main>
  );
}
