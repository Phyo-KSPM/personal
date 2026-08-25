import { signOut } from "@/app/actions/auth";
import PendingButton from "@/app/components/pending-button";

export default function WorkspaceHeader({ email }: { email?: string }) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-wine/8 px-6 py-4 sm:px-10">
      <p className="hidden text-sm text-muted sm:block">{email}</p>
      <form action={signOut}>
        <PendingButton
          idle="Sign out"
          busy="Signing out"
          className="h-10 rounded-xl border border-wine/12 px-4 text-sm text-wine transition hover:bg-sand disabled:cursor-wait disabled:opacity-70"
        />
      </form>
    </header>
  );
}
