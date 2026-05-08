import { Code2, LogOut, Moon, Plus, Sun } from "lucide-react";
import { useDashboardStore } from "../../features/dashboard/stores/dashboardStore";

export default function DashboardHeader() {
  const logout = useDashboardStore((state) => state.logout);
  const openCreateSnippet = useDashboardStore(
    (state) => state.openCreateSnippet,
  );
  const theme = useDashboardStore((state) => state.theme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);
  const isDark = theme === "dark";

  return (
    <header className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 sm:h-12 sm:w-12">
          <Code2 size={24} />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">
            CodeVault
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:max-w-none">
            Save, organize, and reuse your code snippets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row lg:shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? "Light" : "Dark"}
        </button>
        <button
          type="button"
          onClick={openCreateSnippet}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus size={18} />
          New Snippet
        </button>
        <button
          type="button"
          onClick={logout}
          className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950 sm:col-span-1"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
