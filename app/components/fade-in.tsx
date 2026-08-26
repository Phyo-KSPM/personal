"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { easeOut } from "@/lib/motion";

export default function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "main";
}) {
  const Tag = as === "main" ? motion.main : motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay, ease: easeOut }}
    >
      {children}
    </Tag>
  );
}
