import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDashboardStore } from "../stores/dashboardStore";

export default function CreateSnippetModal() {
  const customLanguage = useDashboardStore(
    (state) => state.customDraftLanguage,
  );
  const language = useDashboardStore((state) => state.draftLanguage);
  const languageOptions = useDashboardStore(
    useShallow((state) => state.getSnippetLanguageOptions()),
  );
  const title = useDashboardStore((state) => state.draftTitle);
  const closeCreateSnippet = useDashboardStore(
    (state) => state.closeCreateSnippet,
  );
  const createDraftFromForm = useDashboardStore(
    (state) => state.createDraftFromForm,
  );
  const setCustomLanguage = useDashboardStore(
    (state) => state.setCustomDraftLanguage,
  );
  const setLanguage = useDashboardStore((state) => state.setDraftLanguage);
  const setTitle = useDashboardStore((state) => state.setDraftTitle);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeCreateSnippet();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCreateSnippet]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-snippet-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCreateSnippet();
      }}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
    >
      <form
        onSubmit={createDraftFromForm}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        <div className="mb-5">
          <h2
            id="create-snippet-title"
            className="text-xl font-bold text-slate-950 dark:text-white"
          >
            New Snippet
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose a title and language before writing the code.
          </p>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Title
          </span>
          <input
            autoFocus
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Snippet title"
            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500"
          />
        </label>

        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Language
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {languageOptions.map((currentLanguage) => (
              <button
                key={currentLanguage}
                type="button"
                onClick={() => setLanguage(currentLanguage)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  language === currentLanguage
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {currentLanguage}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setLanguage("Other")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                language === "Other"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              Other
            </button>
          </div>
        </div>

        {language === "Other" && (
          <label className="mt-4 block">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Custom language
            </span>
            <input
              type="text"
              value={customLanguage}
              onChange={(event) => setCustomLanguage(event.target.value)}
              placeholder="Python, Java, Go..."
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500"
            />
          </label>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={closeCreateSnippet}
            className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !title.trim() || (language === "Other" && !customLanguage.trim())
            }
            className="h-12 rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Start Writing
          </button>
        </div>
      </form>
    </section>
  );
}
