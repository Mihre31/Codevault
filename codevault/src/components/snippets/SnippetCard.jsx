import { Star } from "lucide-react";

export default function SnippetCard({ snippet, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(snippet)}
      className={`w-full rounded-2xl border p-4 text-left shadow-sm transition sm:p-5 ${
        isSelected
          ? "border-slate-900 bg-white dark:border-slate-200 dark:bg-slate-900"
          : "border-transparent bg-white hover:border-slate-300 dark:bg-slate-900 dark:hover:border-slate-700"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-slate-950 dark:text-white">
            {snippet.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {snippet.description}
          </p>
        </div>
        <Star
          size={18}
          className={
            snippet.favorite
              ? "shrink-0 fill-yellow-400 text-yellow-400"
              : "shrink-0 text-slate-300"
          }
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
          {snippet.language}
        </span>
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
