import { Suspense } from "react";
import IdleLock from "@/app/components/idle-lock";
import ScrollToTop from "@/app/components/scroll-to-top";
import WorkspaceHeader from "@/app/components/workspace-header";
import WorkspaceSidebar from "@/app/components/workspace-sidebar";
import { getAuthUser, listNoteSummaries } from "@/lib/data/notes";
import { readSupabaseEnv } from "@/lib/supabase/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false, follow: false },
};

export default function HomeLayout({ children }: LayoutProps<"/home">) {
  if (!readSupabaseEnv()) {
    return (
      <>
        <IdleLock />
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-ivory lg:flex-row">
      <IdleLock />
      <Suspense fallback={<WorkspaceSidebar notes={[]} />}>
        <SidebarFromDb />
      </Suspense>
      <div className="flex min-h-full min-w-0 flex-1 flex-col">
        <Suspense fallback={<WorkspaceHeader />}>
          <HeaderFromDb />
        </Suspense>
        {children}
        <ScrollToTop />
      </div>
    </div>
  );
}

async function SidebarFromDb() {
  const { notes } = await listNoteSummaries();
  return <WorkspaceSidebar notes={notes} />;
}

async function HeaderFromDb() {
  const [user, { notes }] = await Promise.all([getAuthUser(), listNoteSummaries()]);
  return <WorkspaceHeader email={user?.email} notes={notes} />;
}
