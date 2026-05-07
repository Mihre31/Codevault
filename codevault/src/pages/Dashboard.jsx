import { useEffect, useMemo, useState } from "react";
import LanguageFilter from "../components/filters/LanguageFilter";
import SearchBar from "../components/filters/SearchBar";
import DashboardHeader from "../components/layout/DashboardHeader";
import StatCard from "../components/layout/StatCard";
import SnippetList from "../components/snippets/SnippetList";
import SnippetPreview from "../components/snippets/SnippetPreview";
import MotionBackground from "../components/ui/MotionBackground";
import { languages as defaultLanguages, snippets as demoSnippets } from "../data/snippets";
import { logout } from "../services/authApi";
import {
  createSnippet,
  deleteSnippet,
  getSnippets,
  toggleSnippetFavorite,
  updateSnippet,
} from "../services/snippetApi";

function getSnippetId(snippet) {
  return snippet?._id || snippet?.id;
}

export default function CodeVaultDashboard({ onLogout }) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";

  useEffect(() => {
    async function loadSnippets() {
      try {
        setIsLoading(true);
        setError("");
        const data = await getSnippets();
        setSnippets(data);
        setSelectedSnippet(data[0] || null);
      } catch (apiError) {
        setError(apiError.message);
        setSnippets([]);
        setSelectedSnippet(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSnippets();
  }, []);

  const languages = useMemo(() => {
    return [
      ...new Set([
        ...defaultLanguages,
        ...snippets.map((snippet) => snippet.language).filter(Boolean),
      ]),
    ];
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    return snippets.filter((snippet) => {
      const searchValue = query.toLowerCase().trim();
      const matchesSearch =
        searchValue === "" ||
        snippet.title.toLowerCase().includes(searchValue) ||
        snippet.description.toLowerCase().includes(searchValue) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(searchValue));

      const matchesLanguage =
        language === "All" || snippet.language === language;

      return matchesSearch && matchesLanguage;
    });
  }, [query, language, snippets]);

  const copyCode = async () => {
    if (!selectedSnippet) return;

    await navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCreateSnippet = () => {
    const title = window.prompt("What title do you want for this snippet?");
    const trimmedTitle = title?.trim();

    if (!trimmedTitle) return;

    setError("");
    setSelectedSnippet({
      id: `draft-${Date.now()}`,
      isDraft: true,
      title: trimmedTitle,
      description: "Add a short description for this snippet.",
      language: "JavaScript",
      tags: ["new"],
      favorite: false,
      code: "// Start writing your snippet here",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Client state still needs to clear even if the cookie was already gone.
    } finally {
      localStorage.removeItem("codevault_token");
      onLogout?.();
    }
  };

  const handleDeleteSnippet = async () => {
    if (!selectedSnippet) return;

    if (selectedSnippet.isDraft) {
      setSelectedSnippet(snippets[0] || null);
      return;
    }

    const snippetId = getSnippetId(selectedSnippet);

    try {
      setError("");
      await deleteSnippet(snippetId);

      setSnippets((currentSnippets) => {
        const nextSnippets = currentSnippets.filter(
          (snippet) => getSnippetId(snippet) !== snippetId,
        );
        setSelectedSnippet(nextSnippets[0] || null);
        return nextSnippets;
      });
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleEditSnippet = async () => {
    if (!selectedSnippet) return;

    const title = window.prompt("Snippet title", selectedSnippet.title);
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return;

    if (selectedSnippet.isDraft) {
      setSelectedSnippet((currentSnippet) => ({
        ...currentSnippet,
        title: trimmedTitle,
      }));
      return;
    }

    try {
      setError("");
      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        title: trimmedTitle,
      });

      setSnippets((currentSnippets) =>
        currentSnippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      );
      setSelectedSnippet(updatedSnippet);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleDescriptionSave = async (description) => {
    if (!selectedSnippet || description === selectedSnippet.description) return;

    if (selectedSnippet.isDraft) {
      setSelectedSnippet((currentSnippet) => ({
        ...currentSnippet,
        description,
      }));
      return;
    }

    try {
      setError("");
      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        description,
      });

      setSnippets((currentSnippets) =>
        currentSnippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      );
      setSelectedSnippet(updatedSnippet);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleCodeSave = async (code) => {
    if (!selectedSnippet) return;

    try {
      setError("");

      if (selectedSnippet.isDraft) {
        const createdSnippet = await createSnippet({
          title: selectedSnippet.title,
          description: selectedSnippet.description,
          language: selectedSnippet.language,
          tags: selectedSnippet.tags,
          favorite: selectedSnippet.favorite,
          code,
        });

        setSnippets((currentSnippets) => [createdSnippet, ...currentSnippets]);
        setSelectedSnippet(createdSnippet);
        return;
      }

      if (code === selectedSnippet.code) return;

      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        code,
      });

      setSnippets((currentSnippets) =>
        currentSnippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      );
      setSelectedSnippet(updatedSnippet);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleToggleFavorite = async () => {
    if (!selectedSnippet) return;

    if (selectedSnippet.isDraft) {
      setSelectedSnippet((currentSnippet) => ({
        ...currentSnippet,
        favorite: !currentSnippet.favorite,
      }));
      return;
    }

    try {
      const snippetId = getSnippetId(selectedSnippet);
      const updatedSnippet = await toggleSnippetFavorite(snippetId);

      setSnippets((currentSnippets) =>
        currentSnippets.map((currentSnippet) =>
          getSnippetId(currentSnippet) === snippetId
            ? updatedSnippet
            : currentSnippet,
        ),
      );
      setSelectedSnippet(updatedSnippet);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const totalFavorites = snippets.filter((snippet) => snippet.favorite).length;
  const totalLanguages = new Set(
    snippets.map((snippet) => snippet.language).filter(Boolean),
  ).size;

  return (
    <main
      className={`relative min-h-screen overflow-hidden p-3 transition-colors sm:p-4 lg:p-8 ${
        isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <MotionBackground />
      <div className="relative z-10 mx-auto max-w-7xl">
        <DashboardHeader
          isDark={isDark}
          onCreateSnippet={handleCreateSnippet}
          onLogout={handleLogout}
          onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
        />

        {error && (
          <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}. Login first, then save your token as{" "}
            <code>localStorage.codevault_token</code>, or use the auth cookie.
          </section>
        )}

        <section className="mb-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <StatCard label="Total Snippets" value={String(snippets.length)} />
          <StatCard label="Favorites" value={String(totalFavorites)} />
          <StatCard label="Languages" value={String(totalLanguages)} />
        </section>

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
              onCodeSave={handleCodeSave}
              onCopy={copyCode}
              onDelete={handleDeleteSnippet}
              onDescriptionSave={handleDescriptionSave}
              onEdit={handleEditSnippet}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <article className="min-w-0 rounded-2xl bg-white p-6 text-center text-slate-500 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Create a snippet or connect with a valid token to load your saved
              snippets.
            </article>
          )}
        </section>
      </div>
    </main>
  );
}
