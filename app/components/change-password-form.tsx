"use client";

import { useActionState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { changePassword } from "@/app/actions/auth";
import PendingButton from "@/app/components/pending-button";
import { PASSWORD_UPDATED } from "@/lib/auth-result";

const fieldClass =
  "h-12 rounded-xl border border-wine/12 bg-ivory px-4 text-[15px] text-wine outline-none placeholder:text-muted/50 focus:border-copper/60 focus:ring-4 focus:ring-gold/20";

export default function ChangePasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [result, formAction] = useActionState(changePassword, null);
  const updated = result === PASSWORD_UPDATED;
  const error = result && result !== PASSWORD_UPDATED ? result : null;

  useEffect(() => {
    if (updated) {
      formRef.current?.reset();
    }
  }, [updated]);

  return (
    <section className="rounded-2xl border border-wine/8 bg-white px-5 py-6 sm:px-6">
      <h3 className="font-serif text-2xl text-wine">Password</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        Choose a new password for this account.
      </p>
      <form ref={formRef} action={formAction} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="current-password" className="text-sm text-wine">
            Current password
          </label>
          <input
            id="current-password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="new-password" className="text-sm text-wine">
            New password
          </label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm text-wine">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className={fieldClass}
          />
        </div>

        <AnimatePresence>
          {error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]"
            >
              {error}
            </motion.p>
          ) : null}
          {updated ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-sand px-3 py-2.5 text-sm text-wine"
            >
              Password updated.
            </motion.p>
          ) : null}
        </AnimatePresence>

        <PendingButton
          idle="Update password"
          busy="Updating"
          className="mt-1 h-12 rounded-xl bg-wine text-[15px] font-medium text-ivory hover:bg-wine-soft disabled:cursor-wait disabled:opacity-70"
        />
      </form>
    </section>
  );
}
