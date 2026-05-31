import { useEffect, useRef } from "react";
import { AlertTriangle, ArchiveRestore, ShieldAlert, Trash2, X } from "lucide-react";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DeleteSnippetDialog() {
  const isDeleteOpen = useDashboardStore((state) => state.isDeleteOpen);
  const selectedSnippet = useDashboardStore((state) => state.selectedSnippet);
  const view = useDashboardStore((state) => state.view);
  const closeDeleteSnippet = useDashboardStore(
    (state) => state.closeDeleteSnippet,
  );
  const confirmDeleteSelectedSnippet = useDashboardStore(
    (state) => state.confirmDeleteSelectedSnippet,
  );
  const dialogRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isDeleteOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      dialogRef.current?.scrollTo({ top: 0, left: 0 });
      panelRef.current?.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    });

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isDeleteOpen]);

  if (!isDeleteOpen || !selectedSnippet) return null;

  const isTrashView = view === "trash";

  return (
    <section
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-snippet-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDeleteSnippet();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-3 py-4 backdrop-blur-md sm:grid sm:place-items-center sm:p-4"
    >
      <div
        ref={panelRef}
        className="mx-auto mt-0 w-full max-w-xl overflow-hidden rounded-2xl border border-violet-500/40 bg-[#081024]/95 shadow-[0_30px_110px_rgba(15,23,42,0.65)] ring-1 ring-sky-500/10 sm:mt-0"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4 sm:gap-4 sm:p-6">
          <div className="flex min-w-0 gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-300 shadow-[0_0_45px_rgba(239,68,68,0.18)] sm:h-14 sm:w-14 sm:rounded-2xl">
              <ShieldAlert size={24} />
            </div>
            <div className="min-w-0">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
                <AlertTriangle size={14} />
                Delete action
              </p>
              <h2
                id="delete-snippet-title"
                className="text-xl font-bold tracking-tight text-white sm:text-2xl"
              >
                What should happen to this snippet?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                <span className="break-words font-semibold text-slate-200">
                  {selectedSnippet.title || "Untitled snippet"}
                </span>{" "}
                can be moved to Trash for recovery, or removed permanently.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDeleteSnippet}
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-950/40 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white"
            aria-label="Close delete dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 p-4 sm:p-6">
          {!isTrashView && (
            <button
              type="button"
              onClick={() => confirmDeleteSelectedSnippet("trash")}
              className="group grid gap-3 rounded-xl border border-violet-500/45 bg-violet-500/10 p-4 text-left transition hover:border-violet-300 hover:bg-violet-500/15 sm:grid-cols-[44px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">
                <ArchiveRestore size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">Move to Trash</span>
                <span className="mt-1 block text-sm leading-5 text-slate-400">
                  Keep it recoverable. You can restore it later from Trash.
                </span>
              </span>
              <span className="w-fit rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-violet-100">
                Recommended
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => confirmDeleteSelectedSnippet("delete")}
            className="group grid gap-3 rounded-xl border border-red-500/35 bg-red-500/10 p-4 text-left transition hover:border-red-300 hover:bg-red-500/15 sm:grid-cols-[44px_minmax(0,1fr)] sm:items-center"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-200">
              <Trash2 size={22} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-bold text-red-100">
                Delete Forever
              </span>
              <span className="mt-1 block text-sm leading-5 text-red-100/70">
                Permanently remove this snippet. This cannot be undone.
              </span>
            </span>
          </button>
        </div>

        <div className="flex border-t border-slate-800 px-4 py-4 sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={closeDeleteSnippet}
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950/35 px-5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
