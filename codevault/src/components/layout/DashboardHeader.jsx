import {
  Archive,
  Folder,
  Heart,
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { useDashboardStore } from "../../features/dashboard/stores/dashboardStore";
import { getCollectionId } from "../../features/dashboard/utils/snippetUtils";

export default function DashboardHeader() {
  const collection = useDashboardStore((state) => state.collection);
  const collections = useDashboardStore((state) => state.collections);
  const logout = useDashboardStore((state) => state.logout);
  const openCreateSnippet = useDashboardStore(
    (state) => state.openCreateSnippet,
  );
  const setCollection = useDashboardStore((state) => state.setCollection);
  const snippets = useDashboardStore((state) => state.snippets);
  const setTag = useDashboardStore((state) => state.setTag);
  const setView = useDashboardStore((state) => state.setView);
  const trashedSnippets = useDashboardStore((state) => state.trashedSnippets);
  const view = useDashboardStore((state) => state.view);

  const navItems = [
    {
      icon: <LayoutDashboard size={19} />,
      label: "Dashboard",
      active: view === "dashboard" && collection === "All",
      onClick: () => {
        setView("dashboard");
        setCollection("All");
        setTag("All");
      },
    },
    {
      icon: <Archive size={19} />,
      label: "All Snippets",
      active: view === "dashboard" && collection === "All",
      onClick: () => {
        setView("dashboard");
        setCollection("All");
      },
    },
    {
      icon: <Heart size={19} />,
      label: "Favorites",
      active: false,
      onClick: () => {
        setView("dashboard");
        setTag("All");
      },
    },
    {
      icon: <Folder size={19} />,
      label: "Collections",
      active: false,
      onClick: () => {
        setView("dashboard");
        setCollection("All");
      },
    },
    {
      icon: <Trash2 size={19} />,
      label: "Trash",
      active: view === "trash",
      badge: trashedSnippets.length,
      onClick: () => setView("trash"),
    },
  ];

  return (
    <aside className="min-h-0 overflow-hidden border-b border-slate-200/70 bg-white/85 p-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#0b1024]/92 lg:flex lg:h-full lg:flex-col lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-500/20">
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            CodeVault
          </h2>
        </div>
      </div>

      <div className="mt-7 grid gap-3">
        <button
          type="button"
          onClick={openCreateSnippet}
          className="flex h-10 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01]"
        >
          <Plus size={16} />
          New Snippet
        </button>
      </div>

      <nav className="mt-4 grid gap-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
              item.active
                ? "bg-violet-500/15 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
            }`}
          >
            {item.icon}
            <span className="min-w-0 flex-1 text-left">{item.label}</span>
            {item.badge > 0 && (
              <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-500 dark:text-red-300">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800/80">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Collections
          </p>
          <Plus size={17} className="text-slate-400" />
        </div>
        <div className="grid max-h-40 gap-1 overflow-y-auto pr-1">
          {collections.length === 0 ? (
            <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              No collections yet
            </p>
          ) : (
            collections.map((currentCollection) => {
              const collectionId = getCollectionId(currentCollection);
              const count = snippets.filter(
                (snippet) => getCollectionId(snippet.collection) === collectionId,
              ).length;

              return (
                <button
                  key={collectionId || currentCollection.name}
                  type="button"
                  onClick={() => {
                    setView("dashboard");
                    setCollection(collectionId || "All");
                  }}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    collection === collectionId
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                  }`}
                >
                  <span className="min-w-0 truncate">{currentCollection.name}</span>
                  <span className="text-xs opacity-70">{count}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-auto flex h-10 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 text-sm font-semibold text-red-500 transition hover:bg-red-500/15 dark:text-red-300"
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
