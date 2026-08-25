"use client";

import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="login-rise rounded-2xl border border-gold/30 bg-sand/70 px-6 py-8 text-center">
        <p className="font-serif text-3xl text-wine">Ko Phyo</p>
        <p className="mt-3 text-sm leading-7 text-muted">
          You are signed in.
          <br />
          Welcome to your personal workspace.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm text-wine">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
          className="size-4 rounded border-wine/20 accent-wine"
        />
        <span>Remember me</span>
      </label>

      {error ? (
        <p className="rounded-xl bg-[#f4e4e0] px-3 py-2.5 text-sm text-[#8a3b32]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-12 rounded-xl bg-wine text-[15px] font-medium tracking-wide text-ivory transition hover:bg-wine-soft disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Checking..." : "Sign in"}
      </button>
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
