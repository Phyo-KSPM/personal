"use client";

import { useEffect, useState, type ReactNode } from "react";
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
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className={
              open
                ? "inline-flex h-10 cursor-pointer items-center rounded-xl border border-wine/12 px-4 text-sm text-wine transition hover:bg-sand"
                : "inline-flex h-10 cursor-pointer items-center rounded-xl bg-wine px-4 text-sm font-medium text-ivory transition hover:bg-wine-soft"
            }
          >
            {open ? "Cancel" : "Add"}
          </button>
        </div>
      </div>

      {open ? (
        <section className="flex flex-col gap-6">
          {saveError ? (
            <p className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]">
              {saveError}
            </p>
          ) : null}
          {children}
        </section>
      ) : null}
    </div>
  );
}
