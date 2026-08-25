"use client";

import { useFormStatus } from "react-dom";
import { motion } from "motion/react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "@/app/components/spinner";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragEnd" | "onDragStart"
>;

export default function PendingButton({
  idle,
  busy = "Please wait",
  className,
  disabled,
  type = "submit",
  ...props
}: {
  idle: ReactNode;
  busy?: ReactNode;
} & NativeButtonProps) {
  const { pending } = useFormStatus();
  const waiting = pending || Boolean(disabled);

  return (
    <motion.button
      {...props}
      type={type}
      className={className}
      disabled={waiting}
      whileTap={waiting ? undefined : { scale: 0.98 }}
    >
      <motion.span
        key={pending ? "busy" : "idle"}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="inline-flex items-center justify-center gap-2"
      >
        {pending ? (
          <>
            <Spinner />
            {busy}
          </>
        ) : (
          idle
        )}
      </motion.span>
    </motion.button>
  );
}
