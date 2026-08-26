"use client";

import Link from "next/link";
import { motion } from "motion/react";
import DeleteNoteButton from "@/app/components/delete-note-button";
import { easeOut, springSoft } from "@/lib/motion";
import { type NoteSummary } from "@/lib/notes";

export type NotesView = "cards" | "table";

export default function NotesCollection({
  notes,
  view,
}: {
  notes: NoteSummary[];
  view: NotesView;
}) {
  if (notes.length === 0) {
    return <p className="text-sm text-muted">No notes in this section yet.</p>;
  }

  if (view === "table") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: easeOut }}
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
              <tr
                key={note.id}
                className="border-b border-wine/6 last:border-0 hover:bg-sand/50"
              >
                <td className="px-4 py-3">
                  <Link href={`/home/notes/${note.id}`} className="text-wine hover:underline">
                    {note.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(note.updated_at || note.created_at || "").toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteNoteButton
                    id={note.id}
                    title={note.title}
                    className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-wine/25 bg-ivory px-2.5 text-xs font-medium text-wine transition hover:border-[#8a3b32]/35 hover:bg-[#f4e4e0] hover:text-[#8a3b32]"
                  />
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
      {notes.map((note, index) => (
        <motion.article
          key={note.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04, ease: easeOut }}
          whileHover={{ y: -3 }}
          className="flex flex-col rounded-2xl border border-wine/10 bg-white p-5 hover:shadow-[0_12px_30px_-18px_rgba(42,22,24,0.35)]"
        >
          <Link href={`/home/notes/${note.id}`} className="min-w-0 flex-1">
            <h3 className="font-medium text-wine">{note.title}</h3>
            <p className="mt-4 text-xs text-muted">
              {new Date(note.updated_at || note.created_at || "").toLocaleString()}
            </p>
          </Link>
          <div className="mt-4">
            <DeleteNoteButton
              id={note.id}
              title={note.title}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-wine/25 bg-ivory px-3 text-sm font-medium text-wine transition hover:border-[#8a3b32]/35 hover:bg-[#f4e4e0] hover:text-[#8a3b32]"
            />
          </div>
        </motion.article>
      ))}
    </div>
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
          className={`relative rounded-full px-3 py-1.5 ${
            view === item.id ? "text-ivory" : "text-muted hover:text-wine"
          }`}
        >
          {view === item.id ? (
            <motion.span
              layoutId="notes-view-pill"
              className="absolute inset-0 rounded-full bg-wine"
              transition={springSoft}
            />
          ) : null}
          <span className="relative z-10">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
