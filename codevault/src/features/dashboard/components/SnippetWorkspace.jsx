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
  const setSelectedSnippet = useDashboardStore(
    (state) => state.setSelectedSnippet,
  );
  const toggleSelectedSnippetFavorite = useDashboardStore(
    (state) => state.toggleSelectedSnippetFavorite,
  );
  const filteredSnippets = useMemo(() => {
    const searchValue = query.toLowerCase().trim();

    return snippets.filter((snippet) => {
      const collectionName =
        snippet.pendingCollectionName ||
        snippet.collectionName ||
        snippet.collection?.name ||
        "";
      const matchesSearch =
        searchValue === "" ||
        snippet.title.toLowerCase().includes(searchValue) ||
        snippet.description.toLowerCase().includes(searchValue) ||
        collectionName.toLowerCase().includes(searchValue) ||
        snippet.tags.some((currentTag) =>
          currentTag.toLowerCase().includes(searchValue),
        );
      const snippetCollectionId = getCollectionId(snippet.collection);
      const matchesCollection =
        collection === "All" ||
        (collection === "__none" && !snippetCollectionId) ||
        snippetCollectionId === collection;
      const matchesLanguage =
        language === "All" || snippet.language === language;
      const matchesTag = tag === "All" || snippet.tags.includes(tag);

      return (
        matchesSearch && matchesCollection && matchesLanguage && matchesTag
      );
    });
  }, [collection, language, query, snippets, tag]);

  return (
    <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] xl:gap-6">
      <aside className="min-w-0 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading snippets...
          </div>
        ) : (
          <SnippetList
            snippets={filteredSnippets}
            selectedSnippet={selectedSnippet || demoSnippets[0]}
            onSelectSnippet={setSelectedSnippet}
          />
        )}
      </aside>

      {selectedSnippet ? (
        <SnippetPreview
          key={getSnippetId(selectedSnippet)}
          snippet={selectedSnippet}
          copied={copied}
          isDraft={Boolean(selectedSnippet.isDraft)}
          onCodeSave={saveSelectedSnippetCode}
          onCopy={copyCode}
          onDelete={deleteSelectedSnippet}
          onDescriptionSave={saveSelectedSnippetDescription}
          onEdit={editSelectedSnippetTitle}
          onToggleFavorite={toggleSelectedSnippetFavorite}
        />
      ) : (
        <article className="min-w-0 rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Create a snippet or connect with a valid token to load your saved
          snippets.
        </article>
      )}
    </section>
  );
}
