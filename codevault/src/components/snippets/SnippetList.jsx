import SnippetCard from "./SnippetCard";

export default function SnippetList({
  snippets,
  selectedSnippet,
  onSelectSnippet,
}) {
  if (snippets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-950/60">
        <h2 className="font-semibold text-slate-950 dark:text-white">
          No snippets found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet._id || snippet.id}
          snippet={snippet}
          isSelected={
            (selectedSnippet._id || selectedSnippet.id) ===
            (snippet._id || snippet.id)
          }
          onSelect={onSelectSnippet}
        />
      ))}
    </div>
  );
}
