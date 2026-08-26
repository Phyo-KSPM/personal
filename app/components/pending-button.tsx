"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "@/app/components/spinner";

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
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  const waiting = pending || Boolean(disabled);

  return (
    <button {...props} type={type} className={className} disabled={waiting}>
      <span className="inline-flex items-center justify-center gap-2">
        {pending ? (
          <>
            <Spinner />
            {busy}
          </>
        ) : (
          idle
        )}
      </span>
    </button>
  );
}
