"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ViewToggle, type NotesView } from "@/app/components/notes-collection";
import { topicLabel, topicPath, type TopicSlug } from "@/lib/notes";

export default function AddNote({
  topic,
  view,
  saveError,
  startOpen = false,
  children,
}: {
  topic: TopicSlug;
  view: NotesView;
  saveError?: string;
  startOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(startOpen || Boolean(saveError));
  const base = topicPath(topic);

  useEffect(() => {
    if (startOpen || saveError) {
      setOpen(true);
    }
  }, [startOpen, saveError]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-wine">{topicLabel(topic)}</h2>
          <p className="mt-2 text-sm text-muted">Notes in this section only.</p>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <ViewToggle view={view} hrefCards={base} hrefTable={`${base}?view=table`} />
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen((value) => !value)}
            className={
              open
                ? "inline-flex h-10 cursor-pointer items-center rounded-xl border border-wine/12 px-4 text-sm text-wine transition hover:bg-sand"
                : "inline-flex h-10 cursor-pointer items-center rounded-xl bg-wine px-4 text-sm font-medium text-ivory transition hover:bg-wine-soft"
            }
          >
            {open ? "Cancel" : "Add"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.section
            key="add"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 pb-1">
              {saveError ? (
                <p className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]">
                  {saveError}
                </p>
              ) : null}
              {children}
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
