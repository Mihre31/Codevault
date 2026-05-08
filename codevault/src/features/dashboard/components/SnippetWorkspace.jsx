import { useShallow } from "zustand/react/shallow";
import SnippetList from "../../../components/snippets/SnippetList";
import SnippetPreview from "../../../components/snippets/SnippetPreview";
import { snippets as demoSnippets } from "../../../data/snippets";
import { useDashboardStore } from "../stores/dashboardStore";
import { getSnippetId } from "../utils/snippetUtils";

export default function SnippetWorkspace() {
  const copied = useDashboardStore((state) => state.copied);
  const filteredSnippets = useDashboardStore(
    useShallow((state) => state.getFilteredSnippets()),
  );
  const isLoading = useDashboardStore((state) => state.isLoading);
  const selectedSnippet = useDashboardStore((state) => state.selectedSnippet);
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
