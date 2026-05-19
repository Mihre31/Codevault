import { useMemo } from "react";
import LanguageFilter from "../../../components/filters/LanguageFilter";
import SearchBar from "../../../components/filters/SearchBar";
import { languages as defaultLanguages } from "../../../data/snippets";
import { useDashboardStore } from "../stores/dashboardStore";
import { getCollectionId } from "../utils/snippetUtils";

export default function DashboardFilters() {
  const collection = useDashboardStore((state) => state.collection);
  const collections = useDashboardStore((state) => state.collections);
  const isFilterOpen = useDashboardStore((state) => state.isFilterOpen);
  const language = useDashboardStore((state) => state.language);
  const query = useDashboardStore((state) => state.query);
  const snippets = useDashboardStore((state) => state.snippets);
  const tag = useDashboardStore((state) => state.tag);
  const setCollection = useDashboardStore((state) => state.setCollection);
  const setLanguage = useDashboardStore((state) => state.setLanguage);
  const setQuery = useDashboardStore((state) => state.setQuery);
  const setTag = useDashboardStore((state) => state.setTag);
  const languages = useMemo(
    () => [
      ...new Set([
        ...defaultLanguages,
        ...snippets.map((snippet) => snippet.language).filter(Boolean),
      ]),
    ],
    [snippets],
  );
  const collectionOptions = useMemo(() => {
    const hasUnassigned = snippets.some(
      (snippet) => !getCollectionId(snippet.collection),
    );

    return [
      { _id: "All", name: "All" },
      ...(hasUnassigned ? [{ _id: "__none", name: "Unassigned" }] : []),
      ...collections,
    ];
  }, [collections, snippets]);
  const tags = useMemo(
    () => [
      "All",
      ...new Set(snippets.flatMap((snippet) => snippet.tags || [])),
    ],
    [snippets],
  );

  if (!isFilterOpen) return null;

  return (
    <section className="mb-6 rounded-2xl bg-white p-3 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
          Filter snippets
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Search your saved snippets or narrow by language, collection, or tag.
        </p>
      </div>
      <div className="grid min-w-0 gap-4">
        <SearchBar query={query} onQueryChange={setQuery} />
        <div className="grid gap-4 xl:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Languages
            </p>
            <LanguageFilter
              languages={languages}
              selectedLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Collections
            </p>
            <div className="flex flex-wrap gap-2">
              {collectionOptions.map((currentCollection) => (
                <button
                  key={currentCollection._id}
                  type="button"
                  onClick={() => setCollection(currentCollection._id)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    collection === currentCollection._id
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {currentCollection.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((currentTag) => (
                <button
                  key={currentTag}
                  type="button"
                  onClick={() => setTag(currentTag)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    tag === currentTag
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {currentTag === "All" ? "All" : `#${currentTag}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
