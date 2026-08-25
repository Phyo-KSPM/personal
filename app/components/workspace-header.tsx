import { signOut } from "@/app/actions/auth";

export default function WorkspaceHeader({ email }: { email?: string }) {
  return (
    <header className="flex items-center justify-end gap-4 border-b border-wine/8 px-6 py-4 sm:px-10">
      <p className="hidden text-sm text-muted sm:block">{email}</p>
      <form action={signOut}>
        <button
          type="submit"
          className="h-10 rounded-xl border border-wine/12 px-4 text-sm text-wine transition hover:bg-sand"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
