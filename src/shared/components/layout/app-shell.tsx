import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-24 lg:pb-0 min-h-0 flex flex-col">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
