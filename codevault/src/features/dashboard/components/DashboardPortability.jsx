import { useRef } from "react";
import { CloudUpload, FileJson, FileText, Upload } from "lucide-react";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardPortability() {
  const fileInputRef = useRef(null);
  const downloadSnippetsAsMarkdown = useDashboardStore(
    (state) => state.downloadSnippetsAsMarkdown,
  );
  const exportSnippetsAsJson = useDashboardStore(
    (state) => state.exportSnippetsAsJson,
  );
  const importSnippetsFromJson = useDashboardStore(
    (state) => state.importSnippetsFromJson,
  );
  const isImporting = useDashboardStore((state) => state.isImporting);
  const portabilityMessage = useDashboardStore(
    (state) => state.portabilityMessage,
  );
  const snippetsCount = useDashboardStore((state) => state.snippets.length);

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    await importSnippetsFromJson(file);
    event.target.value = "";
  }

  return (
    <section className="mb-5 overflow-hidden rounded-xl border border-violet-400/70 bg-white/85 shadow-sm shadow-violet-500/5 transition-colors dark:bg-[#0c1328]/90">
      <div className="grid gap-0 xl:grid-cols-[1fr_auto]">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800 xl:border-b-0 xl:border-r">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-violet-500/20">
              <CloudUpload size={23} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                Portable Snippets
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Export your vault as JSON, restore snippets from a backup, or
                save a readable Markdown copy.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  {snippetsCount} snippets
                </span>
                {portabilityMessage && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-300">
                    {portabilityMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2 p-4 sm:grid-cols-3 xl:min-w-[460px]">
          <button
            type="button"
            onClick={exportSnippetsAsJson}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <FileJson size={18} />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Upload size={18} />
            {isImporting ? "Importing" : "Import JSON"}
          </button>
          <button
            type="button"
            onClick={downloadSnippetsAsMarkdown}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01]"
          >
            <FileText size={18} />
            Export Markdown
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </section>
  );
}
