"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { springSoft } from "@/lib/motion";
import { workspaceBackHref, type NoteSummary } from "@/lib/notes";

const MotionLink = motion.create(Link);

const backClassName =
  "inline-flex h-9 w-fit items-center gap-1.5 rounded-full border border-wine/12 bg-white px-3.5 text-sm font-medium text-wine shadow-[0_8px_20px_-16px_rgba(42,22,24,0.5)] hover:bg-sand";

export function BackChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 5.5 8.5 12 15 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeaderBack({ notes }: { notes: NoteSummary[] }) {
  const pathname = usePathname();
  const href = workspaceBackHref(pathname, notes);

  if (!href) {
    return null;
  }

  return (
    <MotionLink
      href={href}
      whileHover={{ y: -1 }}
      transition={springSoft}
      className={`hidden lg:inline-flex ${backClassName}`}
    >
      <BackChevron />
      Back
    </MotionLink>
  );
}
