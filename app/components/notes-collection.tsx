import Link from "next/link";
import { deleteNote } from "@/app/actions/notes";
import { excerptFromMarkdown, type Note } from "@/lib/notes";

export type NotesView = "cards" | "table";

export default function NotesCollection({
  notes,
  view,
}: {
  notes: Note[];
  view: NotesView;
}) {
  if (notes.length === 0) {
    return <p className="text-sm text-muted">No notes in this section yet.</p>;
  }

  if (view === "table") {
    return (
      <div className="overflow-x-auto rounded-2xl border border-wine/10 bg-white">
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
                  <Link href={`/home/notes/${note.id}`} className="text-wine hover:underline">
                    {note.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(note.updated_at || note.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteNote} className="inline">
                    <input type="hidden" name="id" value={note.id} />
                    <button type="submit" className="text-muted hover:text-wine">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {notes.map((note) => (
        <article
          key={note.id}
          className="flex flex-col rounded-2xl border border-wine/10 bg-white p-5"
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
          <form action={deleteNote} className="mt-4">
            <input type="hidden" name="id" value={note.id} />
            <button type="submit" className="text-sm text-muted hover:text-wine">
              Delete
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}

export function ViewToggle({
  view,
  hrefCards,
  hrefTable,
}: {
  view: NotesView;
  hrefCards: string;
  hrefTable: string;
}) {
  return (
    <div className="flex rounded-full border border-wine/12 p-1 text-sm">
      <Link
        href={hrefCards}
        className={`rounded-full px-3 py-1.5 ${
          view === "cards" ? "bg-wine text-ivory" : "text-muted hover:text-wine"
        }`}
      >
        Cards
      </Link>
      <Link
        href={hrefTable}
        className={`rounded-full px-3 py-1.5 ${
          view === "table" ? "bg-wine text-ivory" : "text-muted hover:text-wine"
        }`}
      >
        Table
      </Link>
    </div>
  );
}
