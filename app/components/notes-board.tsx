"use client";

import { useState, type ReactNode } from "react";
import AddNote from "@/app/components/add-note";
import NotesCollection, { type NotesView } from "@/app/components/notes-collection";
import { isNotesSchemaError, type NoteSummary, type TopicSlug } from "@/lib/notes";

function writeViewToUrl(view: NotesView) {
  const url = new URL(window.location.href);
  if (view === "table") {
    url.searchParams.set("view", "table");
  } else {
    url.searchParams.delete("view");
  }
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}`);
}

export default function NotesBoard({
  topic,
  initialView,
  notes,
  saveError,
  startAdd = false,
  queryError,
  children,
}: {
  topic: TopicSlug;
  initialView: NotesView;
  notes: NoteSummary[];
  saveError?: string;
  startAdd?: boolean;
  queryError?: string;
  children: ReactNode;
}) {
  const [view, setView] = useState<NotesView>(initialView);
  const tableMissing =
    isNotesSchemaError(queryError) || isNotesSchemaError(saveError);

  function changeView(next: NotesView) {
    setView(next);
    writeViewToUrl(next);
  }

  return (
    <>
      <AddNote
        topic={topic}
        view={view}
        onViewChange={changeView}
        saveError={tableMissing ? undefined : saveError}
        startOpen={startAdd}
      >
        {children}
      </AddNote>

      {tableMissing ? (
        <p className="rounded-2xl border border-gold/30 bg-sand/70 px-4 py-3 text-sm leading-6 text-muted">
          The notes table is missing. In Supabase, open SQL Editor, paste{" "}
          <code className="font-mono text-wine">supabase/schema.sql</code>, then
          click Run. After it succeeds, refresh this page.
        </p>
      ) : null}

      {queryError && !tableMissing ? (
        <p className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]">
          {queryError}
        </p>
      ) : null}

      {!tableMissing ? <NotesCollection notes={notes} view={view} /> : null}
    </>
  );
}
