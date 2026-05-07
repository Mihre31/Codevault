import { useState } from "react";
import SnippetActions from "./SnippetActions";

export default function SnippetPreview({
  copied,
  isDraft = false,
  onCodeSave,
  onCopy,
  onDelete,
  onDescriptionSave,
  onEdit,
  onToggleFavorite,
  snippet,
}) {
  const [codeDraft, setCodeDraft] = useState(snippet.code || "");

  return (
    <article className="min-w-0 rounded-2xl bg-white p-4 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white">
              {snippet.language}
            </span>
            {snippet.favorite && (
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Favorite
              </span>
            )}
          </div>
          <h2 className="break-words text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
            {snippet.title}
          </h2>
          <p
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            tabIndex={0}
            onBlur={(event) =>
              onDescriptionSave(event.currentTarget.textContent.trim())
            }
            className="mt-2 text-slate-500 outline-none dark:text-slate-400"
          >
            {snippet.description}
          </p>
        </div>

        <SnippetActions
          copied={copied}
          isFavorite={snippet.favorite}
          onCopy={onCopy}
          onDelete={onDelete}
          onEdit={onEdit}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div>
        <textarea
          value={codeDraft}
          onChange={(event) => setCodeDraft(event.target.value)}
          spellCheck="false"
          className="min-h-[320px] w-full resize-y rounded-2xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none ring-1 ring-slate-800 transition focus:ring-slate-500 sm:p-5 sm:text-sm sm:leading-7"
          placeholder="// Start writing your snippet here"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onCodeSave(codeDraft)}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isDraft ? "Save Snippet" : "Save Code"}
          </button>
        </div>
      </div>
    </article>
  );
}
