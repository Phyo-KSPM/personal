import IdleLock from "@/app/components/idle-lock";
import WorkspaceHeader from "@/app/components/workspace-header";
import WorkspaceSidebar from "@/app/components/workspace-sidebar";
import { parseTopic, type NoteSummary } from "@/lib/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ko Phyo",
  description: "Personal workspace",
};

export default async function HomeLayout({ children }: LayoutProps<"/home">) {
  if (!readSupabaseEnv()) {
    return (
      <>
        <IdleLock />
        {children}
      </>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("notes")
    .select("id, title, category, updated_at")
    .order("updated_at", { ascending: false });

  const notes: NoteSummary[] = (data ?? []).map((note) => ({
    id: note.id,
    title: note.title ?? "Untitled",
    category: parseTopic(note.category),
    updated_at: note.updated_at,
  }));

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ivory lg:flex-row">
      <IdleLock />
      <WorkspaceSidebar notes={notes} />
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <WorkspaceHeader email={user?.email} />
        {children}
      </div>
    </div>
  );
}
