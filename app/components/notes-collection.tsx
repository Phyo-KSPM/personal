"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { motion } from "motion/react";
import { deleteNote } from "@/app/actions/notes";
import PendingButton from "@/app/components/pending-button";
import { excerptFromMarkdown, type Note } from "@/lib/notes";

export type NotesView = "cards" | "table";

const ease = [0.22, 1, 0.36, 1] as const;

export default function NotesCollection({
  notes,
  view,
}: {
  notes: Note[];
  view: NotesView;
}) {
  if (notes.length === 0) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted"
      >
        No notes in this section yet.
      </motion.p>
    );
  }

  if (view === "table") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease }}
        className="overflow-x-auto rounded-2xl border border-wine/10 bg-white"
      >
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="border-b border-wine/10 text-xs tracking-wide text-muted uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="border-b border-wine/6 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/home/notes/${note.id}`} className="text-wine transition hover:underline">
                    {note.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(note.updated_at || note.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteNote} className="inline">
                    <input type="hidden" name="id" value={note.id} />
                    <PendingButton
                      idle="Delete"
                      busy="Deleting"
                      className="text-muted transition hover:text-wine disabled:cursor-wait disabled:opacity-70"
                    />
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <form action={deleteNote}>
      <input type="hidden" name="id" value={note.id} />
      <PendingNoteCard note={note} />
    </form>
  );
}

function PendingNoteCard({ note }: { note: Note }) {
  const { pending } = useFormStatus();

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: pending ? 0.55 : 1 }}
      transition={{ duration: 0.18, ease }}
      whileHover={pending ? undefined : { y: -3 }}
      className={`flex flex-col rounded-2xl border border-wine/10 bg-white p-5 transition-shadow ${
        pending
          ? "pointer-events-none"
          : "hover:shadow-[0_12px_30px_-18px_rgba(42,22,24,0.35)]"
      }`}
    >
      <Link href={`/home/notes/${note.id}`} className="min-w-0 flex-1">
        <h3 className="font-medium text-wine">{note.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
          {excerptFromMarkdown(note.content)}
        </p>
        <p className="mt-4 text-xs text-muted">
          {new Date(note.updated_at || note.created_at).toLocaleString()}
        </p>
      </Link>
      <div className="mt-4">
        <PendingButton
          idle="Delete"
          busy="Deleting"
          className="text-sm text-muted transition hover:text-wine disabled:cursor-wait disabled:opacity-70"
        />
      </div>
    </motion.article>
  );
}

export function ViewToggle({
  view,
  onChange,
}: {
  view: NotesView;
  onChange: (view: NotesView) => void;
}) {
  const items = [
    { id: "cards" as const, label: "Cards" },
    { id: "table" as const, label: "Table" },
  ];

  return (
    <div className="flex rounded-full border border-wine/12 p-1 text-sm">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          aria-pressed={view === item.id}
          className={`relative rounded-full px-3 py-1.5 transition ${
            view === item.id ? "text-ivory" : "text-muted hover:text-wine"
          }`}
        >
          {view === item.id ? (
            <motion.span
              layoutId="notes-view-pill"
              className="absolute inset-0 rounded-full bg-wine"
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
            />
          ) : null}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
