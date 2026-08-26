import { signOut } from "@/app/actions/auth";
import PendingButton from "@/app/components/pending-button";
import HeaderBack from "@/app/components/workspace-back";
import type { NoteSummary } from "@/lib/notes";

export default function WorkspaceHeader({
  email,
  notes = [],
}: {
  email?: string;
  notes?: NoteSummary[];
}) {
  return (
    <header className="flex items-center gap-4 border-b border-wine/8 bg-ivory/90 px-6 py-4 backdrop-blur-md sm:px-10 lg:sticky lg:top-0 lg:z-30">
      <HeaderBack notes={notes} />
      <div className="ml-auto flex items-center gap-4">
        <p className="hidden text-sm text-muted sm:block">{email}</p>
        <form action={signOut}>
          <PendingButton
            idle={
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15.5 8.5 19 12l-3.5 3.5M19 12H10M9 5.5H7.2C6 5.5 5 6.5 5 7.7v8.6c0 1.2 1 2.2 2.2 2.2H9"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Sign out
              </>
            }
            busy="Signing out"
            className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-wine/25 bg-white px-3.5 text-sm font-medium text-wine transition hover:bg-sand disabled:cursor-wait disabled:opacity-70"
          />
        </form>
      </div>
    </header>
  );
}
