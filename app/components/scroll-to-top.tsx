"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";

const SHOW_AFTER = 280;

function subscribe(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getSnapshot() {
  return (
    (window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0) > SHOW_AFTER
  );
}

export default function ScrollToTop() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function goTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="to-top"
          type="button"
          aria-label="Back to top"
          onClick={goTop}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed right-5 bottom-5 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full bg-wine text-ivory shadow-[0_16px_32px_-12px_rgba(42,22,24,0.55)] ring-1 ring-gold/35 hover:bg-wine-soft sm:right-8 sm:bottom-8"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 18V7.5M7.5 12 12 7.5 16.5 12"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
