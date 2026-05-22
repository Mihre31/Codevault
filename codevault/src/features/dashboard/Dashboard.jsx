import { useEffect } from "react";
import DashboardHeader from "../../components/layout/DashboardHeader";
import MotionBackground from "../../components/ui/MotionBackground";
import CreateSnippetModal from "./components/CreateSnippetModal";
import DashboardError from "./components/DashboardError";
import DashboardFilters from "./components/DashboardFilters";
import DashboardPortability from "./components/DashboardPortability";
import DashboardStats from "./components/DashboardStats";
import DashboardTopbar from "./components/DashboardTopbar";
import SnippetWorkspace from "./components/SnippetWorkspace";
import { useDashboardStore } from "./stores/dashboardStore";
import { useAuthStore } from "../../stores/authStore";

export default function CodeVaultDashboard() {
  const isCreateOpen = useDashboardStore((state) => state.isCreateOpen);
  const loadSnippets = useDashboardStore((state) => state.loadSnippets);
  const theme = useDashboardStore((state) => state.theme);
  const user = useAuthStore((state) => state.user);
  const isDark = theme === "dark";
  const displayName = user?.fullName || user?.name || "Developer";

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-3 transition-colors sm:p-4 ${
        isDark ? "dark bg-[#070b1a] text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <MotionBackground />
      <div className="relative z-10 mx-auto grid h-[calc(100vh-24px)] max-w-[1360px] overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50 shadow-2xl shadow-slate-950/20 dark:border-slate-800/80 dark:bg-[#080d1d] sm:h-[calc(100vh-32px)] lg:grid-cols-[250px_minmax(0,1fr)]">
        <DashboardHeader />

        <section className="min-w-0 overflow-y-auto bg-slate-50/90 px-4 py-4 backdrop-blur-xl dark:bg-[#080d1d]/92 sm:px-6">
          <DashboardTopbar />

          {isCreateOpen && <CreateSnippetModal />}

          <DashboardError />

          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                Welcome back, {displayName}!
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Here's what's happening with your code snippets.
              </p>
            </div>
            <div className="w-fit rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-[#0c1328] dark:text-slate-300">
              Last 7 days
            </div>
          </div>

          <DashboardStats />

          <DashboardPortability />

          <DashboardFilters />

          <SnippetWorkspace />
        </section>
      </div>
    </main>
  );
}
