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
  const normalizedLanguage = String(language || "javascript").toLowerCase();

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
  const snippetTags = Array.isArray(snippet.tags) ? snippet.tags : [];
  const languageLabel = snippet.language || "Plain Text";
  const collectionName =
    snippet.pendingCollectionName ||
    snippet.collectionName ||
    snippet.collection?.name;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#0c1328]/90">
      <div className="grid min-w-0 gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-2">
            {collectionName && (
              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
                {collectionName}
              </span>
            )}
            <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
              {languageLabel}
            </span>
            {snippet.favorite && (
              <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-500 dark:text-rose-300">
                Favorite
              </span>
            )}
          </div>
          <h2 className="truncate text-base font-bold text-slate-950 dark:text-white">
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
            className="mt-1 line-clamp-2 max-w-[520px] text-sm text-slate-500 outline-none dark:text-slate-400"
          >
            {snippet.description}
          </p>
        </div>

        <div className="min-w-fit">
          <SnippetActions
            copied={copied}
            isFavorite={snippet.favorite}
            onCopy={onCopy}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      </div>

      {snippetTags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {snippetTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="px-4 pb-4">
        <CodeMirror
          value={codeDraft}
          height="300px"
          theme={oneDark}
          extensions={[codeVaultEditorTheme, getLanguageExtension(languageLabel)]}
          onChange={(value) => setCodeDraft(value)}
          basicSetup={{
            autocompletion: true,
            bracketMatching: true,
            foldGutter: true,
            highlightActiveLine: true,
            lineNumbers: true,
          }}
          className="overflow-hidden rounded-lg bg-slate-950 text-sm ring-1 ring-slate-800 transition focus-within:ring-violet-500/70"
          placeholder="// Start writing your snippet here"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onCodeSave(codeDraft)}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:scale-[1.01]"
          >
            {isDraft ? "Save Snippet" : "Save Code"}
          </button>
        </div>
      </div>
    </article>
  );
}
