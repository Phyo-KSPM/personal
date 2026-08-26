import CategoryCards from "@/app/components/category-cards";
import FadeIn from "@/app/components/fade-in";
import { listNoteSummaries } from "@/lib/data/notes";
import { TOPICS, type TopicSlug } from "@/lib/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All notes",
};

export default async function HomePage() {
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

  const { notes } = await listNoteSummaries();
  const counts: Partial<Record<TopicSlug, number>> = {};

  for (const topic of TOPICS) {
    counts[topic.slug] = notes.filter((note) => note.category === topic.slug).length;
  }

  return (
    <FadeIn as="main" className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-8 sm:px-10">
      <h2 className="font-serif text-3xl text-wine">All notes</h2>
      <p className="text-sm text-muted">Open a category to see its notes.</p>
      <CategoryCards counts={counts} />
    </FadeIn>
  );
}
