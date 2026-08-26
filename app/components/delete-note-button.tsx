"use client";

import { useCallback, useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { deleteNote } from "@/app/actions/notes";
import PendingButton from "@/app/components/pending-button";

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export default function DeleteNoteButton({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-xl border border-wine/25 bg-white px-3.5 text-sm font-medium text-wine transition hover:border-[#8a3b32]/35 hover:bg-[#f4e4e0] hover:text-[#8a3b32]"
        }
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 7.5h14M10 7.5V5.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8v1.7M9.2 11v6M12 11v6M14.8 11v6M7 7.5l.7 11.2c.1.8.7 1.3 1.5 1.3h5.6c.8 0 1.4-.5 1.5-1.3L17 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Delete
      </button>
      <ConfirmDeleteDialog
        open={open}
        id={id}
        title={title}
        onCancel={close}
      />
    </>
  );
}

function ConfirmDeleteDialog({
  open,
  id,
  title,
  onCancel,
}: {
  open: boolean;
  id: string;
  title: string;
  onCancel: () => void;
}) {
  const headingId = useId();
  const isClient = useIsClient();

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!isClient) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="delete-confirm"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-wine/45 backdrop-blur-[2px]"
            onClick={onCancel}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-wine/10 bg-ivory p-5 shadow-[0_24px_48px_-24px_rgba(42,22,24,0.55)]"
          >
            <form action={deleteNote}>
              <input type="hidden" name="id" value={id} />
              <h2 id={headingId} className="font-serif text-2xl text-wine">
                Delete note
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                “{title}” will be permanently deleted. This cannot be undone.
              </p>
              <DialogActions onCancel={onCancel} />
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function DialogActions({ onCancel }: { onCancel: () => void }) {
  const { pending } = useFormStatus();

  return (
    <div className="mt-5 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        autoFocus
        className="h-10 rounded-xl px-4 text-sm text-wine transition hover:bg-sand disabled:cursor-wait disabled:opacity-70"
      >
        Cancel
      </button>
      <PendingButton
        idle="Delete"
        busy="Deleting"
        className="h-10 rounded-xl bg-wine px-4 text-sm font-medium text-ivory transition hover:bg-wine-soft disabled:cursor-wait disabled:opacity-70"
      />
    </div>
  );
}
