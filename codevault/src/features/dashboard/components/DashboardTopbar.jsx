import { Bell, ChevronDown, Filter, Moon, Search, Sun } from "lucide-react";
import { useDashboardStore } from "../stores/dashboardStore";
import { useAuthStore } from "../../../stores/authStore";

export default function DashboardTopbar() {
  const isFilterOpen = useDashboardStore((state) => state.isFilterOpen);
  const language = useDashboardStore((state) => state.language);
  const query = useDashboardStore((state) => state.query);
  const setQuery = useDashboardStore((state) => state.setQuery);
  const theme = useDashboardStore((state) => state.theme);
  const toggleFilters = useDashboardStore((state) => state.toggleFilters);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const isDark = theme === "dark";
  const hasActiveFilter = query.trim() !== "" || language !== "All";
  const displayName = user?.fullName || user?.name || "Developer";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="mb-6 flex flex-col gap-3 border-b border-slate-200/70 pb-4 dark:border-slate-800/80 xl:flex-row xl:items-center xl:justify-between">
      <label className="relative min-w-0 xl:max-w-[560px] xl:flex-1">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search snippets, tags, collections..."
          className="h-10 w-full rounded-lg border border-slate-200 bg-white/80 pl-10 pr-16 text-xs text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-800 dark:bg-[#0c1328] dark:text-slate-100 dark:focus:border-violet-500"
        />
        <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:inline">
          Ctrl K
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleFilters}
          aria-expanded={isFilterOpen}
          className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${
            isFilterOpen || hasActiveFilter
              ? "border-violet-400 bg-violet-500/15 text-violet-600 dark:text-violet-300"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <Filter size={18} />
          Filter
        </button>
        <div className="flex h-10 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-[#0c1328]">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Switch theme"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              isDark
                ? "bg-indigo-500/20 text-indigo-300"
                : "bg-amber-400/20 text-amber-600"
            }`}
          >
            <Sun size={19} />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Switch theme"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              isDark
                ? "text-slate-500"
                : "bg-slate-900/10 text-slate-700"
            }`}
          >
            <Moon size={18} />
          </button>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-[#0c1328] dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell size={19} />
        </button>
        <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-800 dark:bg-[#0c1328] dark:text-slate-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-violet-500 text-white">
            {initial}
          </span>
          <span className="hidden sm:inline">{displayName}</span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
