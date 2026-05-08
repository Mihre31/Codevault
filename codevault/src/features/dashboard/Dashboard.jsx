import { useEffect } from "react";
import DashboardHeader from "../../components/layout/DashboardHeader";
import MotionBackground from "../../components/ui/MotionBackground";
import CreateSnippetModal from "./components/CreateSnippetModal";
import DashboardError from "./components/DashboardError";
import DashboardFilters from "./components/DashboardFilters";
import DashboardStats from "./components/DashboardStats";
import SnippetWorkspace from "./components/SnippetWorkspace";
import { useDashboardStore } from "./stores/dashboardStore";

export default function CodeVaultDashboard() {
  const isCreateOpen = useDashboardStore((state) => state.isCreateOpen);
  const loadSnippets = useDashboardStore((state) => state.loadSnippets);
  const theme = useDashboardStore((state) => state.theme);
  const isDark = theme === "dark";

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets]);

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-3 transition-colors sm:p-4 lg:p-8 ${
        isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <MotionBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        <DashboardHeader />

        {isCreateOpen && <CreateSnippetModal />}

        <DashboardError />

        <DashboardStats />

        <DashboardFilters />

        <SnippetWorkspace />
      </div>
    </main>
  );
}
