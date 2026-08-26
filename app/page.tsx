import FadeIn from "@/app/components/fade-in";
import LoginForm from "@/app/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="relative hidden w-[46%] overflow-hidden bg-wine text-ivory lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="login-grain pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
        <div className="pointer-events-none absolute -top-24 -left-16 size-[28rem] rounded-full border border-gold/20" />
        <div className="pointer-events-none absolute top-24 -left-8 size-[20rem] rounded-full border border-gold/15" />
        <div className="pointer-events-none absolute right-[-6rem] bottom-[-5rem] size-[22rem] rounded-full bg-copper/20 blur-3xl" />

        <p className="relative font-serif text-xl tracking-[0.28em] text-gold">KP</p>

        <FadeIn className="relative max-w-sm">
          <p className="text-sm tracking-wide text-gold/90">Private space</p>
          <h1 className="mt-4 font-serif text-6xl leading-[1.05] text-ivory">
            Ko Phyo
          </h1>
          <p className="mt-6 text-base leading-8 text-ivory/70">
            Welcome back. Sign in to your personal workspace.
          </p>
        </FadeIn>

        <p className="relative text-xs tracking-[0.22em] text-ivory/35 uppercase">
          Personal workspace
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-ivory px-6 py-16 sm:px-10">
        <FadeIn className="w-full max-w-[400px]" delay={0.08}>
          <div className="mb-10 lg:hidden">
            <p className="font-serif text-lg tracking-[0.28em] text-gold">KP</p>
            <h1 className="mt-3 font-serif text-4xl text-wine">Ko Phyo</h1>
            <p className="mt-2 text-sm text-muted">Sign in to your private space</p>
          </div>

          <div className="hidden lg:block">
            <h2 className="font-serif text-4xl text-wine">Sign in</h2>
            <p className="mt-2 text-[15px] leading-7 text-muted">
              Continue with your email and password.
            </p>
          </div>

          <div className="mt-8">
            <LoginForm />
          </div>
        </FadeIn>
      </main>
    </div>
  );
}
