import { useEffect, useMemo } from "react";
import {
  Check,
  Code2,
  FilePlus2,
  Folder,
  Keyboard,
  Rocket,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { languages as defaultLanguages } from "../../../data/snippets";
import { useDashboardStore } from "../stores/dashboardStore";
import { getCollectionId } from "../utils/snippetUtils";

const featuredLanguages = ["TypeScript", "JavaScript", "React", "CSS", "Other"];

const languageIcons = {
  TypeScript: "TS",
  JavaScript: "JS",
  React: "RE",
  CSS: "CSS",
  Other: "</>",
};

function getTagPreview(tags) {
  return tags
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

export default function CreateSnippetModal() {
  const collection = useDashboardStore((state) => state.draftCollection);
  const collectionDescription = useDashboardStore(
    (state) => state.draftCollectionDescription,
  );
  const collectionName = useDashboardStore(
    (state) => state.draftCollectionName,
  );
  const collections = useDashboardStore((state) => state.collections);
  const customLanguage = useDashboardStore(
    (state) => state.customDraftLanguage,
  );
  const language = useDashboardStore((state) => state.draftLanguage);
  const snippets = useDashboardStore((state) => state.snippets);
  const tags = useDashboardStore((state) => state.draftTags);
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
  const setCollection = useDashboardStore((state) => state.setDraftCollection);
  const setCollectionDescription = useDashboardStore(
    (state) => state.setDraftCollectionDescription,
  );
  const setCollectionName = useDashboardStore(
    (state) => state.setDraftCollectionName,
  );
  const setLanguage = useDashboardStore((state) => state.setDraftLanguage);
  const setTags = useDashboardStore((state) => state.setDraftTags);
  const setTitle = useDashboardStore((state) => state.setDraftTitle);

  const languageOptions = useMemo(() => {
    const projectLanguages = [
      ...new Set([
        ...featuredLanguages,
        ...defaultLanguages,
        ...snippets.map((snippet) => snippet.language).filter(Boolean),
      ]),
    ].filter((currentLanguage) => currentLanguage !== "All");

    return projectLanguages.slice(0, 8);
  }, [snippets]);

  const tagPreview = useMemo(() => getTagPreview(tags), [tags]);
  const isStartDisabled =
    !title.trim() ||
    (language === "Other" && !customLanguage.trim()) ||
    (collection === "new" && !collectionName.trim());

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeCreateSnippet();
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        const form = document.getElementById("create-snippet-form");
        form?.requestSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeCreateSnippet]);

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-snippet-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCreateSnippet();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 px-4 py-6 backdrop-blur-md"
    >
      <form
        id="create-snippet-form"
        onSubmit={createDraftFromForm}
        className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-violet-500/60 bg-[#081024]/95 shadow-[0_30px_110px_rgba(59,130,246,0.18)] ring-1 ring-sky-500/10"
      >
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/35 to-indigo-500/20 text-violet-300 shadow-[0_0_45px_rgba(124,58,237,0.35)]">
              <FilePlus2 size={34} />
            </div>
            <div className="min-w-0">
              <h2
                id="create-snippet-title"
                className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                Create New Snippet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400 sm:text-base">
                Save reusable code, commands, or logic to your vault. Organize
                and find it anytime.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Rocket size={18} className="text-violet-400" />
                Title
              </span>
              <input
                autoFocus
                maxLength={100}
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. React Auth Controller"
                className="h-14 w-full rounded-lg border border-violet-500/70 bg-slate-950/35 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
              />
              <div className="mt-3 flex items-start justify-between gap-4 text-sm text-slate-400">
                <span>
                  A clear, descriptive title helps you find your snippet quickly.
                </span>
                <span className="shrink-0">{title.length} / 100</span>
              </div>
            </label>

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Code2 size={18} className="text-violet-400" />
                Language
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {languageOptions.map((currentLanguage) => {
                  const isSelected = language === currentLanguage;

                  return (
                    <button
                      key={currentLanguage}
                      type="button"
                      onClick={() => setLanguage(currentLanguage)}
                      className={`flex h-14 items-center justify-between gap-3 rounded-lg border px-4 text-left text-sm font-semibold transition ${
                        isSelected
                          ? "border-violet-500 bg-violet-500/15 text-white shadow-[0_0_30px_rgba(124,58,237,0.18)]"
                          : "border-slate-700 bg-slate-950/30 text-slate-200 hover:border-violet-500/60 hover:bg-slate-900/70"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                            isSelected
                              ? "bg-violet-500 text-white"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {languageIcons[currentLanguage] ||
                            currentLanguage.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="truncate">{currentLanguage}</span>
                      </span>
                      {isSelected && (
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500 text-white">
                          <Check size={15} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {language === "Other" && (
              <label className="block">
                <span className="text-sm font-semibold text-white">
                  Custom language
                </span>
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(event) => setCustomLanguage(event.target.value)}
                  placeholder="Python, Java, Go..."
                  className="mt-2 h-12 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
                />
              </label>
            )}

            <div>
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Folder size={18} className="text-violet-400" />
                Collection
              </p>
              <div className="grid gap-3 lg:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setCollection("")}
                  className={`flex min-h-20 items-center gap-4 rounded-lg border px-4 text-left transition ${
                    collection === ""
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-700 bg-slate-950/30 hover:border-violet-500/60"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border ${
                      collection === ""
                        ? "border-violet-300 bg-violet-500/20"
                        : "border-slate-600"
                    }`}
                  >
                    {collection === "" && (
                      <span className="h-3 w-3 rounded-full bg-violet-400" />
                    )}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">
                      No collection
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                      Keep this snippet ungrouped
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCollection("new")}
                  className={`flex min-h-20 items-center gap-4 rounded-lg border px-4 text-left transition ${
                    collection === "new"
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-slate-700 bg-slate-950/30 hover:border-violet-500/60"
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border ${
                      collection === "new"
                        ? "border-violet-300 bg-violet-500/20"
                        : "border-slate-600"
                    }`}
                  >
                    {collection === "new" && (
                      <span className="h-3 w-3 rounded-full bg-violet-400" />
                    )}
                  </span>
                  <span>
                    <span className="block font-semibold text-white">
                      New collection
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                      Create a new collection for this snippet
                    </span>
                  </span>
                </button>
              </div>

              {collections.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {collections.map((currentCollection) => {
                    const collectionId = getCollectionId(currentCollection);
                    const isSelected = collection === collectionId;

                    return (
                      <button
                        key={collectionId || currentCollection.name}
                        type="button"
                        onClick={() => setCollection(collectionId || "")}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? "border-violet-500 bg-violet-500/15 text-white"
                            : "border-slate-700 bg-slate-950/30 text-slate-300 hover:border-violet-500/60"
                        }`}
                      >
                        {currentCollection.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {collection === "new" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-white">
                    Collection name
                  </span>
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(event) => setCollectionName(event.target.value)}
                    placeholder="React Hooks"
                    className="mt-2 h-12 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-white">
                    Collection description
                  </span>
                  <input
                    type="text"
                    value={collectionDescription}
                    onChange={(event) =>
                      setCollectionDescription(event.target.value)
                    }
                    placeholder="Reusable hook patterns"
                    className="mt-2 h-12 w-full rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
                  />
                </label>
              </div>
            )}

            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <Tags size={18} className="text-violet-400" />
                Tags <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <input
                type="text"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="e.g. auth, api, middleware"
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-950/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70"
              />
              <div className="mt-3 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <span>Add tags to describe your snippet. Use commas to add.</span>
                {tagPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {tagPreview.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200"
                      >
                        {tag}
                        <X size={13} className="text-indigo-300" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-800 p-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:p-7">
          <button
            type="button"
            onClick={closeCreateSnippet}
            className="flex h-14 items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-950/30 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/80"
          >
            Cancel
            <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
              Esc
            </span>
          </button>
          <button
            type="submit"
            disabled={isStartDisabled}
            className="flex h-14 items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-base font-bold text-white shadow-[0_18px_60px_rgba(124,58,237,0.35)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={18} fill="currentColor" />
            Start Writing
            <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-xs">
              <Keyboard size={13} />
              Ctrl Enter
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}
