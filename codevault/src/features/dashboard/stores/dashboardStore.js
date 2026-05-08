import { create } from "zustand";
import { languages as defaultLanguages } from "../../../data/snippets";
import { logout as logoutRequest } from "../../../services/authApi";
import {
  createSnippet,
  deleteSnippet,
  getSnippets,
  toggleSnippetFavorite,
  updateSnippet,
} from "../../../services/snippetApi";
import { useAuthStore } from "../../../stores/authStore";
import { createDraftSnippet, getSnippetId } from "../utils/snippetUtils";

function getLanguages(snippets) {
  return [
    ...new Set([
      ...defaultLanguages,
      ...snippets.map((snippet) => snippet.language).filter(Boolean),
    ]),
  ];
}

function getFilteredSnippets({ language, query, snippets }) {
  return snippets.filter((snippet) => {
    const searchValue = query.toLowerCase().trim();
    const matchesSearch =
      searchValue === "" ||
      snippet.title.toLowerCase().includes(searchValue) ||
      snippet.description.toLowerCase().includes(searchValue) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchValue));

    const matchesLanguage = language === "All" || snippet.language === language;

    return matchesSearch && matchesLanguage;
  });
}

export const useDashboardStore = create((set, get) => ({
  copied: false,
  customDraftLanguage: "",
  draftLanguage: "JavaScript",
  draftTitle: "",
  error: "",
  isCreateOpen: false,
  isLoading: true,
  language: "All",
  query: "",
  selectedSnippet: null,
  snippets: [],
  theme: "dark",

  closeCreateSnippet: () => set({ isCreateOpen: false }),
  copyCode: async () => {
    const { selectedSnippet } = get();
    if (!selectedSnippet) return;

    await navigator.clipboard.writeText(selectedSnippet.code);
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 1200);
  },
  createDraftFromForm: (event) => {
    event.preventDefault();

    const { customDraftLanguage, draftLanguage, draftTitle } = get();
    const trimmedTitle = draftTitle.trim();
    const selectedDraftLanguage =
      draftLanguage === "Other" ? customDraftLanguage.trim() : draftLanguage;

    if (!trimmedTitle || !selectedDraftLanguage) return;

    set({
      error: "",
      isCreateOpen: false,
      language: selectedDraftLanguage,
      selectedSnippet: createDraftSnippet({
        language: selectedDraftLanguage,
        title: trimmedTitle,
      }),
    });
  },
  deleteSelectedSnippet: async () => {
    const { selectedSnippet, snippets } = get();
    if (!selectedSnippet) return;

    if (selectedSnippet.isDraft) {
      set({ selectedSnippet: snippets[0] || null });
      return;
    }

    const snippetId = getSnippetId(selectedSnippet);

    try {
      set({ error: "" });
      await deleteSnippet(snippetId);

      const nextSnippets = snippets.filter(
        (snippet) => getSnippetId(snippet) !== snippetId,
      );

      set({
        selectedSnippet: nextSnippets[0] || null,
        snippets: nextSnippets,
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
  editSelectedSnippetTitle: async () => {
    const { selectedSnippet, snippets } = get();
    if (!selectedSnippet) return;

    const title = window.prompt("Snippet title", selectedSnippet.title);
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return;

    if (selectedSnippet.isDraft) {
      set({ selectedSnippet: { ...selectedSnippet, title: trimmedTitle } });
      return;
    }

    try {
      set({ error: "" });
      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        title: trimmedTitle,
      });

      set({
        selectedSnippet: updatedSnippet,
        snippets: snippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
  getFilteredSnippets: () => getFilteredSnippets(get()),
  getLanguages: () => getLanguages(get().snippets),
  getSnippetLanguageOptions: () =>
    getLanguages(get().snippets).filter(
      (currentLanguage) => currentLanguage !== "All",
    ),
  getTotalFavorites: () =>
    get().snippets.filter((snippet) => snippet.favorite).length,
  getTotalLanguages: () =>
    new Set(get().snippets.map((snippet) => snippet.language).filter(Boolean))
      .size,
  loadSnippets: async () => {
    try {
      set({ error: "", isLoading: true });
      const data = await getSnippets();
      set({
        isLoading: false,
        selectedSnippet: data[0] || null,
        snippets: data,
      });
    } catch (apiError) {
      set({
        error: apiError.message,
        isLoading: false,
        selectedSnippet: null,
        snippets: [],
      });
    }
  },
  logout: async () => {
    try {
      await logoutRequest();
    } catch {
      // Client state still needs to clear even if the cookie was already gone.
    } finally {
      useAuthStore.getState().logout();
    }
  },
  openCreateSnippet: () => {
    const { language } = get();

    set({
      customDraftLanguage: "",
      draftLanguage: language === "All" ? "JavaScript" : language,
      draftTitle: "",
      isCreateOpen: true,
    });
  },
  saveSelectedSnippetCode: async (code) => {
    const { selectedSnippet, snippets } = get();
    if (!selectedSnippet) return;

    try {
      set({ error: "" });

      if (selectedSnippet.isDraft) {
        const createdSnippet = await createSnippet({
          title: selectedSnippet.title,
          description: selectedSnippet.description,
          language: selectedSnippet.language,
          tags: selectedSnippet.tags,
          favorite: selectedSnippet.favorite,
          code,
        });

        set({
          selectedSnippet: createdSnippet,
          snippets: [createdSnippet, ...snippets],
        });
        return;
      }

      if (code === selectedSnippet.code) return;

      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        code,
      });

      set({
        selectedSnippet: updatedSnippet,
        snippets: snippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
  saveSelectedSnippetDescription: async (description) => {
    const { selectedSnippet, snippets } = get();
    if (!selectedSnippet || description === selectedSnippet.description) return;

    if (selectedSnippet.isDraft) {
      set({ selectedSnippet: { ...selectedSnippet, description } });
      return;
    }

    try {
      set({ error: "" });
      const updatedSnippet = await updateSnippet(getSnippetId(selectedSnippet), {
        description,
      });

      set({
        selectedSnippet: updatedSnippet,
        snippets: snippets.map((snippet) =>
          getSnippetId(snippet) === getSnippetId(updatedSnippet)
            ? updatedSnippet
            : snippet,
        ),
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
  setCustomDraftLanguage: (customDraftLanguage) => set({ customDraftLanguage }),
  setDraftLanguage: (draftLanguage) => set({ draftLanguage }),
  setDraftTitle: (draftTitle) => set({ draftTitle }),
  setLanguage: (language) => set({ language }),
  setQuery: (query) => set({ query }),
  setSelectedSnippet: (selectedSnippet) => set({ selectedSnippet }),
  toggleSelectedSnippetFavorite: async () => {
    const { selectedSnippet, snippets } = get();
    if (!selectedSnippet) return;

    if (selectedSnippet.isDraft) {
      set({
        selectedSnippet: {
          ...selectedSnippet,
          favorite: !selectedSnippet.favorite,
        },
      });
      return;
    }

    try {
      set({ error: "" });
      const snippetId = getSnippetId(selectedSnippet);
      const updatedSnippet = await toggleSnippetFavorite(snippetId);

      set({
        selectedSnippet: updatedSnippet,
        snippets: snippets.map((currentSnippet) =>
          getSnippetId(currentSnippet) === snippetId
            ? updatedSnippet
            : currentSnippet,
        ),
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
}));
