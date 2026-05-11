import { useShallow } from "zustand/react/shallow";
import LanguageFilter from "../../../components/filters/LanguageFilter";
import SearchBar from "../../../components/filters/SearchBar";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardFilters() {
  const isFilterOpen = useDashboardStore((state) => state.isFilterOpen);
  const language = useDashboardStore((state) => state.language);
  const languages = useDashboardStore(
    useShallow((state) => state.getLanguages()),
  );
  const query = useDashboardStore((state) => state.query);
  const setLanguage = useDashboardStore((state) => state.setLanguage);
  const setQuery = useDashboardStore((state) => state.setQuery);

  if (!isFilterOpen) return null;

  return (
    <section className="mb-6 rounded-2xl bg-white p-3 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
          Filter snippets
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Search your saved snippets or choose a language.
        </p>
      </div>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <SearchBar query={query} onQueryChange={setQuery} />
        <LanguageFilter
          languages={languages}
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </section>
  );
}
