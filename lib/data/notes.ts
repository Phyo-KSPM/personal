import { cache } from "react";
import { parseTopic, type Note, type NoteSummary, type TopicSlug } from "@/lib/notes";
import { createClient } from "@/lib/supabase/server";

export const getAuthUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const listNoteSummaries = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, category, updated_at")
    .order("updated_at", { ascending: false });

  const notes: NoteSummary[] = (data ?? []).map((note) => ({
    id: note.id,
    title: note.title ?? "Untitled",
    category: parseTopic(note.category),
    updated_at: note.updated_at,
  }));

  return { notes, error: error?.message };
});

export const listNotesByTopic = cache(async (topic: TopicSlug) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, category, created_at, updated_at")
    .eq("category", topic)
    .order("created_at", { ascending: false });

  const notes: NoteSummary[] = (data ?? []).map((note) => ({
    id: note.id,
    title: note.title ?? "Untitled",
    category: parseTopic(note.category),
    created_at: note.created_at,
    updated_at: note.updated_at,
  }));

  return { notes, error: error?.message };
});

export const getNoteById = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notes")
    .select("id, title, content, category, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const note: Note = {
    id: data.id,
    title: data.title ?? "Untitled",
    content: data.content ?? "",
    category: parseTopic(data.category),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };

  return note;
});
