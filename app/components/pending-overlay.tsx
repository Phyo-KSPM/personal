"use client";

import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import Spinner from "@/app/components/spinner";

export default function PendingOverlay({
  label = "Uploading",
  active,
}: {
  label?: string;
  active?: boolean;
}) {
  const { pending } = useFormStatus();
  const show = active ?? pending;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-ivory/80 backdrop-blur-sm"
        >
          <Spinner className="size-7 text-wine" />
          <p className="text-sm text-wine">{label}…</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
