import { useMemo } from "react";
import SnippetList from "../../../components/snippets/SnippetList";
import SnippetPreview from "../../../components/snippets/SnippetPreview";
import { snippets as demoSnippets } from "../../../data/snippets";
import { useDashboardStore } from "../stores/dashboardStore";
import { getCollectionId, getSnippetId } from "../utils/snippetUtils";

export default function SnippetWorkspace() {
  const copied = useDashboardStore((state) => state.copied);
  const collection = useDashboardStore((state) => state.collection);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const language = useDashboardStore((state) => state.language);
  const query = useDashboardStore((state) => state.query);
  const selectedSnippet = useDashboardStore((state) => state.selectedSnippet);
  const snippets = useDashboardStore((state) => state.snippets);
  const tag = useDashboardStore((state) => state.tag);
  const trashedSnippets = useDashboardStore((state) => state.trashedSnippets);
  const view = useDashboardStore((state) => state.view);
  const copyCode = useDashboardStore((state) => state.copyCode);
  const deleteSelectedSnippet = useDashboardStore(
    (state) => state.deleteSelectedSnippet,
  );
  const editSelectedSnippetTitle = useDashboardStore(
    (state) => state.editSelectedSnippetTitle,
  );
  const saveSelectedSnippetCode = useDashboardStore(
    (state) => state.saveSelectedSnippetCode,
  );
  const saveSelectedSnippetDescription = useDashboardStore(
    (state) => state.saveSelectedSnippetDescription,
  );
  const restoreSelectedSnippet = useDashboardStore(
    (state) => state.restoreSelectedSnippet,
  );
  const setSelectedSnippet = useDashboardStore(
    (state) => state.setSelectedSnippet,
  );
  const toggleSelectedSnippetFavorite = useDashboardStore(
    (state) => state.toggleSelectedSnippetFavorite,
  );
  const filteredSnippets = useMemo(() => {
    const searchValue = query.toLowerCase().trim();
    const sourceSnippets = view === "trash" ? trashedSnippets : snippets;

    return sourceSnippets.filter((snippet) => {
      const snippetTitle = String(snippet.title || "");
      const snippetDescription = String(snippet.description || "");
      const snippetTags = Array.isArray(snippet.tags) ? snippet.tags : [];
      const collectionName =
        snippet.pendingCollectionName ||
        snippet.collectionName ||
        snippet.collection?.name ||
        "";
      const matchesSearch =
        searchValue === "" ||
        snippetTitle.toLowerCase().includes(searchValue) ||
        snippetDescription.toLowerCase().includes(searchValue) ||
        collectionName.toLowerCase().includes(searchValue) ||
        snippetTags.some((currentTag) =>
          String(currentTag).toLowerCase().includes(searchValue),
        );
      const snippetCollectionId = getCollectionId(snippet.collection);
      const matchesCollection =
        view === "trash" ||
        collection === "All" ||
        (collection === "__none" && !snippetCollectionId) ||
        snippetCollectionId === collection;
      const matchesLanguage =
        view === "trash" ||
        language === "All" || snippet.language === language;
      const matchesTag =
        view === "trash" || tag === "All" || snippetTags.includes(tag);

      return (
        matchesSearch && matchesCollection && matchesLanguage && matchesTag
      );
    });
  }, [collection, language, query, snippets, tag, trashedSnippets, view]);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[330px_minmax(0,1fr)]">
      <aside className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white/85 shadow-sm dark:border-slate-800 dark:bg-[#0c1328]/90">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-950 dark:text-white">
            {view === "trash" ? "Trash" : "Recent Snippets"}
          </h2>
          <span className="text-xs font-semibold text-violet-500">
            {view === "trash"
              ? `${trashedSnippets.length} deleted`
              : "View all"}
          </span>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading snippets...
          </div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto p-3">
            <SnippetList
              snippets={filteredSnippets}
              selectedSnippet={
                selectedSnippet || (view === "trash" ? null : demoSnippets[0])
              }
              onSelectSnippet={setSelectedSnippet}
            />
          </div>
        )}
      </aside>

      {selectedSnippet ? (
        <SnippetPreview
          key={getSnippetId(selectedSnippet)}
          snippet={selectedSnippet}
          copied={copied}
          isDraft={Boolean(selectedSnippet.isDraft)}
          isTrash={view === "trash"}
          onCodeSave={saveSelectedSnippetCode}
          onCopy={copyCode}
          onDelete={deleteSelectedSnippet}
          onDescriptionSave={saveSelectedSnippetDescription}
          onEdit={editSelectedSnippetTitle}
          onRestore={restoreSelectedSnippet}
          onToggleFavorite={toggleSelectedSnippetFavorite}
        />
      ) : (
        <article className="min-w-0 rounded-2xl border border-slate-200 bg-white/85 p-6 text-center text-slate-500 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#0c1328]/90 dark:text-slate-400">
          {view === "trash"
            ? "Trash is empty. Deleted snippets will appear here before permanent deletion."
            : "Create a snippet or sign in again if your saved snippets do not load."}
        </article>
      )}
    </section>
  );
}
