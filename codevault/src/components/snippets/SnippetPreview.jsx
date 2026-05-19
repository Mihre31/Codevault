import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import SnippetActions from "./SnippetActions";

const codeVaultEditorTheme = EditorView.theme({
  "&": {
    backgroundColor: "#020617",
    color: "#e2e8f0",
  },
  ".cm-content": {
    caretColor: "#f8fafc",
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    minHeight: "360px",
    padding: "20px 0",
  },
  ".cm-editor": {
    backgroundColor: "#020617",
  },
  ".cm-focused": {
    outline: "none",
  },
  ".cm-gutters": {
    backgroundColor: "#020617",
    borderRight: "1px solid #1e293b",
    color: "#64748b",
  },
  ".cm-gutter": {
    backgroundColor: "#020617",
  },
  ".cm-lineNumbers": {
    backgroundColor: "#020617",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    backgroundColor: "#020617",
    color: "#64748b",
    padding: "0 12px",
  },
  ".cm-line": {
    padding: "0 20px",
  },
  ".cm-activeLine": {
    backgroundColor: "#0f172a",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "#0f172a",
    color: "#cbd5e1",
  },
  ".cm-scroller": {
    backgroundColor: "#020617",
  },
  ".cm-selectionBackground": {
    backgroundColor: "#334155 !important",
  },
});

function getLanguageExtension(language) {
  const normalizedLanguage = language.toLowerCase();

  if (normalizedLanguage.includes("python")) return python();
  if (normalizedLanguage.includes("html")) return html();
  if (normalizedLanguage.includes("css")) return css();
  if (normalizedLanguage.includes("json")) return json();
  if (
    normalizedLanguage.includes("javascript") ||
    normalizedLanguage.includes("react")
  ) {
    return javascript({ jsx: true });
  }

  return javascript();
}

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
  const collectionName =
    snippet.pendingCollectionName ||
    snippet.collectionName ||
    snippet.collection?.name;

  return (
    <article className="min-w-0 rounded-2xl bg-white p-4 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5 flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap gap-2">
            {collectionName && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {collectionName}
              </span>
            )}
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
        <CodeMirror
          value={codeDraft}
          height="360px"
          theme={oneDark}
          extensions={[codeVaultEditorTheme, getLanguageExtension(snippet.language)]}
          onChange={(value) => setCodeDraft(value)}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            foldGutter: true,
            highlightActiveLine: true,
            lineNumbers: true,
          }}
          className="overflow-hidden rounded-2xl bg-slate-950 text-sm ring-1 ring-slate-800 transition focus-within:ring-slate-500"
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
