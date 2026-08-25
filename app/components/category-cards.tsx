import Link from "next/link";
import { TOPICS, topicPath, type TopicSlug } from "@/lib/notes";

export default function CategoryCards({
  counts,
}: {
  counts: Partial<Record<TopicSlug, number>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TOPICS.map((topic) => (
        <Link
          key={topic.slug}
          href={topicPath(topic.slug)}
          className="rounded-2xl border border-wine/10 bg-white p-6 transition hover:border-wine/20"
        >
          <h3 className="font-serif text-2xl text-wine">{topic.label}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{topic.hint}</p>
          <p className="mt-5 text-xs tracking-wide text-muted uppercase">
            {counts[topic.slug] ?? 0} notes
          </p>
        </Link>
      ))}
    </div>
  );
}
