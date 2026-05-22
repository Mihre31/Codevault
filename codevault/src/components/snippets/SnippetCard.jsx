import { Code2, Star } from "lucide-react";

const languageStyles = {
  css: "bg-sky-500 text-white",
  html: "bg-orange-500 text-white",
  javascript: "bg-yellow-400 text-slate-950",
  json: "bg-emerald-500 text-white",
  python: "bg-blue-500 text-white",
  react: "bg-violet-500 text-white",
  typescript: "bg-blue-500 text-white",
};

function getLanguageStyle(language) {
  return languageStyles[String(language).toLowerCase()] || "bg-slate-700 text-white";
}

export default function SnippetCard({ snippet, isSelected, onSelect }) {
  const collectionName =
    snippet.pendingCollectionName ||
    snippet.collectionName ||
    snippet.collection?.name;

  return (
    <button
      type="button"
      onClick={() => onSelect(snippet)}
      className={`w-full rounded-lg border p-3 text-left transition ${
        isSelected
          ? "border-violet-400 bg-violet-500/10 dark:bg-violet-500/10"
          : "border-transparent hover:border-slate-200 hover:bg-slate-100/70 dark:hover:border-slate-800 dark:hover:bg-slate-950/50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${getLanguageStyle(
            snippet.language,
          )}`}
        >
          {snippet.language?.slice(0, 2).toUpperCase() || <Code2 size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-950 dark:text-white">
            {snippet.title}
          </h3>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {snippet.language}
            </span>
            {collectionName && <span className="truncate">{collectionName}</span>}
          </div>
        </div>
        <Star
          size={18}
          className={
            snippet.favorite
              ? "shrink-0 fill-yellow-400 text-yellow-400"
              : "shrink-0 text-slate-300 dark:text-slate-600"
          }
        />
      </div>
    </button>
  );
}
