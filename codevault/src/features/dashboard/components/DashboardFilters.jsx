import { useShallow } from "zustand/react/shallow";
import LanguageFilter from "../../../components/filters/LanguageFilter";
import SearchBar from "../../../components/filters/SearchBar";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardFilters() {
  const language = useDashboardStore((state) => state.language);
  const languages = useDashboardStore(
    useShallow((state) => state.getLanguages()),
  );
  const query = useDashboardStore((state) => state.query);
  const setLanguage = useDashboardStore((state) => state.setLanguage);
  const setQuery = useDashboardStore((state) => state.setQuery);

  return (
    <section className="mb-6 rounded-2xl bg-white p-3 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-4">
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
