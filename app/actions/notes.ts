"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isNoteFile,
  isNotesSchemaError,
  parseTopic,
  titleFromMarkdown,
  topicPath,
} from "@/lib/notes";
import { createClient } from "@/lib/supabase/server";

const MAX_MARKDOWN_BYTES = 512 * 1024;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return { supabase, user };
}

function refreshNotes() {
  revalidatePath("/home", "layout");
}

function failSave(category: ReturnType<typeof parseTopic>, message: string): never {
  redirect(`${topicPath(category)}?add=1&error=${encodeURIComponent(message)}`);
}

async function insertNote(
  title: string,
  content: string,
  category: ReturnType<typeof parseTopic>,
) {
  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("notes")
    .insert({
      title,
      content,
      category,
      user_id: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    failSave(
      category,
      isNotesSchemaError(error?.message)
        ? "Notes table is missing. In Supabase, open SQL Editor, paste supabase/schema.sql, and click Run."
        : (error?.message ??
            "Could not save the note. Run supabase/schema.sql in the SQL Editor."),
    );
  }

  refreshNotes();
  redirect(`/home/notes/${data.id}`);
}

export async function uploadMarkdown(formData: FormData) {
  const file = formData.get("file");
  const category = parseTopic(formData.get("category"));
  if (!(file instanceof File) || file.size === 0) {
    failSave(category, "Choose a .md or .txt file.");
  }

  if (!isNoteFile(file)) {
    failSave(category, "Only .md and .txt files can be uploaded.");
  }

  if (file.size > MAX_MARKDOWN_BYTES) {
    failSave(category, "That file is too large. Keep it under 512 KB.");
  }

  const content = (await file.text()).trim();
  if (!content) {
    failSave(category, "That file is empty.");
  }

  await insertNote(titleFromMarkdown(file.name, content), content, category);
}

export async function deleteNote(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }

  const { supabase } = await requireUser();
  const { data } = await supabase
    .from("notes")
    .select("category")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("notes").delete().eq("id", id);
  refreshNotes();
  redirect(topicPath(parseTopic(data?.category)));
}
