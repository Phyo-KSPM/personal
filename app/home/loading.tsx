"use client";

import { motion } from "motion/react";

export default function HomeLoading() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <motion.span
          className="size-8 rounded-full border-2 border-wine/15 border-t-wine"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-muted">Loading…</p>
      </motion.div>
    </div>
  );
}
