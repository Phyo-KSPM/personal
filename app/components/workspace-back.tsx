"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { springSoft } from "@/lib/motion";

const MotionLink = motion.create(Link);

export default function PageBack({ href }: { href: string }) {
  return (
    <MotionLink
      href={href}
      whileHover={{ y: -1 }}
      transition={springSoft}
      className="mb-5 inline-flex h-9 w-fit items-center gap-1.5 rounded-full border border-wine/12 bg-white px-3.5 text-sm font-medium text-wine shadow-[0_8px_20px_-16px_rgba(42,22,24,0.5)] hover:bg-sand"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M15 5.5 8.5 12 15 18.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </MotionLink>
  );
}
