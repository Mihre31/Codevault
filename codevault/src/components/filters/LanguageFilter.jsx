import { Filter } from "lucide-react";

export default function LanguageFilter({
  languages,
  selectedLanguage,
  onLanguageChange,
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <Filter size={18} className="shrink-0 text-slate-400" />
      {languages.map((language) => (
        <button
          key={language}
          type="button"
          onClick={() => onLanguageChange(language)}
          className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition ${
            selectedLanguage === language
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          }`}
        >
          {language}
        </button>
      ))}
    </div>
  );
}
