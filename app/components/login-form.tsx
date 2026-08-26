"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { signIn } from "@/app/actions/auth";
import PendingOverlay from "@/app/components/pending-overlay";
import Spinner from "@/app/components/spinner";
import { SIGNED_IN_RESULT } from "@/lib/auth-result";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error === SIGNED_IN_RESULT) {
      window.location.replace("/home");
    }
  }, [error]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    setShowPassword(false);
    requestAnimationFrame(() => {
      const password = form.elements.namedItem("password");
      if (password instanceof HTMLInputElement) {
        password.value = "";
      }
    });
  }

  const visibleError =
    error && error !== SIGNED_IN_RESULT ? error : null;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-5 overflow-hidden"
      noValidate
      autoComplete="off"
    >
      <PendingOverlay
        label="Signing in"
        active={pending || error === SIGNED_IN_RESULT}
      />
      <fieldset
        disabled={pending || error === SIGNED_IN_RESULT}
        className="flex flex-col gap-5 border-0 p-0 disabled:opacity-100"
      >
        <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-wine">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="you@email.com"
          className="h-12 rounded-xl border border-wine/12 bg-white px-4 text-[15px] text-wine outline-none transition placeholder:text-muted/50 focus:border-copper/60 focus:ring-4 focus:ring-gold/20"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm text-wine">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={6}
            placeholder="••••••••"
            className="h-12 w-full rounded-xl border border-wine/12 bg-white px-4 pr-12 text-[15px] text-wine outline-none transition placeholder:text-muted/50 focus:border-copper/60 focus:ring-4 focus:ring-gold/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted transition hover:text-wine"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-muted">
        <input
          type="checkbox"
          name="remember"
          defaultChecked
          className="size-4 rounded border-wine/20 accent-wine"
        />
        <span>Remember me</span>
      </label>

      <AnimatePresence>
        {visibleError ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]"
          >
            {visibleError}
          </motion.p>
        ) : null}
      </AnimatePresence>

        <motion.button
          type="submit"
          whileHover={{ y: -1 }}
          disabled={pending || error === SIGNED_IN_RESULT}
          className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-wine text-[15px] font-medium tracking-wide text-ivory hover:bg-wine-soft disabled:cursor-wait disabled:opacity-70"
        >
          {pending || error === SIGNED_IN_RESULT ? (
            <>
              <Spinner className="size-4 text-ivory" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </motion.button>
      </fieldset>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M6.1 6.4C4 8 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.3M10.7 5.2C11.1 5.1 11.5 5 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.3 3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
