import ChangePasswordForm from "@/app/components/change-password-form";
import FadeIn from "@/app/components/fade-in";
import IdleLockSetting from "@/app/components/idle-lock-setting";
import { getAuthUser } from "@/lib/data/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = readSupabaseEnv() ? await getAuthUser() : null;

  return (
    <FadeIn
      as="main"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8 sm:px-10"
    >
      <div>
        <h2 className="font-serif text-3xl text-wine">Settings</h2>
        <p className="mt-2 text-sm text-muted">Account and workspace preferences.</p>
      </div>

      <section className="rounded-2xl border border-wine/8 bg-white px-5 py-6 sm:px-6">
        <h3 className="font-serif text-2xl text-wine">Account</h3>
        <p className="mt-2 text-sm text-muted">Signed in as</p>
        <p className="mt-1 text-[15px] text-wine">{user?.email ?? "Unknown"}</p>
      </section>

      <IdleLockSetting />
      <ChangePasswordForm />
    </FadeIn>
  );
}
