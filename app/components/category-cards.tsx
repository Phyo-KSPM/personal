"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { TOPICS, topicPath, type TopicSlug } from "@/lib/notes";

export default function CategoryCards({
  counts,
}: {
  counts: Partial<Record<TopicSlug, number>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {TOPICS.map((topic, index) => (
        <motion.div
          key={topic.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: index * 0.05, ease: easeOut }}
          whileHover={{ y: -4 }}
        >
          <Link
            href={topicPath(topic.slug)}
            className="block rounded-2xl border border-wine/10 bg-white p-6 hover:border-wine/20 hover:shadow-[0_16px_36px_-20px_rgba(42,22,24,0.4)]"
          >
            <h3 className="font-serif text-2xl text-wine">{topic.label}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{topic.hint}</p>
            <p className="mt-5 text-xs tracking-wide text-muted uppercase">
              {counts[topic.slug] ?? 0} notes
            </p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
