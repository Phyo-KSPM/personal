"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  isTopicSlug,
  parseTopic,
  TOPICS,
  topicNewPath,
  topicPath,
  type NoteSummary,
  type TopicSlug,
} from "@/lib/notes";

export default function WorkspaceSidebar({ notes }: { notes: NoteSummary[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const noteId = pathname.startsWith("/home/notes/")
    ? pathname.slice("/home/notes/".length).split("/")[0]
    : null;
  const topicFromPath = pathname.startsWith("/home/c/")
    ? pathname.slice("/home/c/".length).split("/")[0]
    : null;
  const openNote = notes.find((note) => note.id === noteId);
  let activeTopic: TopicSlug | undefined;
  if (openNote) {
    activeTopic = parseTopic(openNote.category);
  } else if (topicFromPath && isTopicSlug(topicFromPath)) {
    activeTopic = topicFromPath;
  }

  const nav = (
    <nav className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <NavRow
          href="/home"
          label="All notes"
          count={notes.length}
          active={pathname === "/home"}
          onNavigate={() => setOpen(false)}
        />
        {TOPICS.map((topic) => (
          <NavRow
            key={topic.slug}
            href={topicPath(topic.slug)}
            label={topic.label}
            count={notes.filter((note) => note.category === topic.slug).length}
            active={activeTopic === topic.slug}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-col">
        <Link
          href={topicNewPath(activeTopic ?? "software")}
          onClick={() => setOpen(false)}
          className="flex h-10 items-center rounded-lg px-3 text-sm text-gold hover:bg-ivory/8"
        >
          Add
        </Link>
        <NavRow
          href="/home/settings"
          label="Settings"
          active={pathname === "/home/settings"}
          onNavigate={() => setOpen(false)}
        />
      </div>
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-wine px-4 py-3 text-ivory lg:hidden">
        <p className="font-serif text-lg">Ko Phyo</p>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="text-sm text-ivory/70 hover:text-ivory"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex max-h-[75vh] flex-col bg-wine px-3 py-3 text-ivory">
                {nav}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

      <aside className="relative sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-hidden bg-wine text-ivory lg:flex">
        <div className="login-grain pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
        <div className="relative flex h-full min-h-0 flex-col px-3 py-5">
          <div className="mb-4 flex items-center gap-2.5 px-3 py-2">
            <span className="font-serif text-sm tracking-[0.22em] text-gold">KP</span>
            <span className="font-serif text-lg leading-none">Ko Phyo</span>
          </div>
          {nav}
        </div>
      </aside>
    </>
  );
}

function NavRow({
  href,
  label,
  count,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  count?: number;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex h-10 items-center gap-2 rounded-md px-3 text-sm ${
        active ? "text-ivory" : "text-ivory/65 hover:bg-ivory/8 hover:text-ivory"
      }`}
    >
      {active ? (
        <motion.span
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-md bg-ivory/12"
          transition={{ type: "spring", stiffness: 400, damping: 34 }}
        />
      ) : null}
      <span className="relative min-w-0 flex-1 truncate">{label}</span>
      {typeof count === "number" ? (
        <span className="relative text-[11px] tabular-nums text-ivory/35">{count}</span>
      ) : null}
    </Link>
  );
}
