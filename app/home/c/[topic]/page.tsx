import { notFound } from "next/navigation";
import NotesWorkspace from "@/app/components/notes-workspace";
import { isTopicSlug } from "@/lib/notes";

export default async function TopicPage({
  params,
  searchParams,
}: PageProps<"/home/c/[topic]">) {
  const { topic } = await params;

  if (!isTopicSlug(topic)) {
    notFound();
  }

  const query = await searchParams;
  const rawView = query.view;
  const viewValue = Array.isArray(rawView) ? rawView[0] : rawView;
  const view = viewValue === "table" ? "table" : "cards";
  const rawError = query.error;
  const saveError = Array.isArray(rawError) ? rawError[0] : rawError;
  const rawAdd = query.add;
  const addValue = Array.isArray(rawAdd) ? rawAdd[0] : rawAdd;

  return (
    <NotesWorkspace
      topic={topic}
      view={view}
      saveError={saveError}
      startAdd={addValue === "1"}
    />
  );
}
