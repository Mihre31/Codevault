import { create } from "zustand";
import { languages as defaultLanguages } from "../../../data/snippets";
import {
  createCollection,
  getCollections,
} from "../../../services/collectionApi";
import { logout as logoutRequest } from "../../../services/authApi";
import {
  createSnippet,
  deleteSnippet,
  getSnippets,
  toggleSnippetFavorite,
  updateSnippet,
} from "../../../services/snippetApi";
import { useAuthStore } from "../../../stores/authStore";
import {
  createDraftSnippet,
  getCollectionId,
  getSnippetId,
} from "../utils/snippetUtils";

function getLanguages(snippets, extraLanguages = []) {
  return [
    ...new Set([
      ...defaultLanguages,
      ...extraLanguages.filter(Boolean),
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
      getSnippetCollectionName(snippet)?.toLowerCase().includes(searchValue) ||
      snippet.tags.some((tag) => tag.toLowerCase().includes(searchValue));

    const matchesLanguage = language === "All" || snippet.language === language;

    return matchesSearch && matchesLanguage;
  });
}

function normalizeTagsInput(tagsInput) {
  return tagsInput
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean);
}

function getSnippetCollectionId(snippet) {
  return getCollectionId(snippet.collection);
}

function getSnippetCollectionName(snippet) {
  if (snippet.pendingCollectionName) return snippet.pendingCollectionName;
  if (snippet.collectionName) return snippet.collectionName;
  if (typeof snippet.collection === "object") return snippet.collection?.name;
  return "";
}

export const useDashboardStore = create((set, get) => ({
  collection: "All",
  collections: [],
  copied: false,
  draftCollection: "",
  draftCollectionDescription: "",
  draftCollectionName: "",
  customDraftLanguage: "",
  draftLanguage: "JavaScript",
  draftTags: "",
  draftTitle: "",
  error: "",
  isCreateOpen: false,
  isFilterOpen: false,
  isLoading: true,
  language: "All",
  query: "",
  selectedSnippet: null,
  snippets: [],
  tag: "All",
  theme: "dark",

  closeCreateSnippet: () => set({ isCreateOpen: false }),
  copyCode: async () => {
    const { selectedSnippet } = get();
    if (!selectedSnippet) return;

    try {
      set({ error: "" });
      await navigator.clipboard.writeText(selectedSnippet.code);
      set({ copied: true });
      setTimeout(() => set({ copied: false }), 1200);
    } catch (apiError) {
      set({
        error:
          apiError instanceof Error ? apiError.message : "Unable to copy code.",
      });
    }
  },
  createDraftFromForm: (event) => {
    event.preventDefault();

    const {
      customDraftLanguage,
      draftCollection,
      draftCollectionDescription,
      draftCollectionName,
      draftLanguage,
      draftTags,
      draftTitle,
    } = get();
    const trimmedTitle = draftTitle.trim();
    const selectedDraftLanguage =
      draftLanguage === "Other" ? customDraftLanguage.trim() : draftLanguage;
    const pendingCollectionName = draftCollectionName.trim();

    if (!trimmedTitle || !selectedDraftLanguage) return;
    if (draftCollection === "new" && !pendingCollectionName) return;

    set({
      error: "",
      isCreateOpen: false,
      language: selectedDraftLanguage,
      selectedSnippet: createDraftSnippet({
        collection: draftCollection && draftCollection !== "new"
          ? draftCollection
          : null,
        collectionName:
          draftCollection && draftCollection !== "new"
            ? get().getCollectionName(draftCollection) || ""
            : "",
        language: selectedDraftLanguage,
        pendingCollectionDescription: draftCollectionDescription.trim(),
        pendingCollectionName:
          draftCollection === "new" ? pendingCollectionName : "",
        tags: normalizeTagsInput(draftTags),
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
      const updatedSnippet = await updateSnippet(
        getSnippetId(selectedSnippet),
        {
          title: trimmedTitle,
        },
      );

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
  getFilteredSnippets: () => {
    const { collection, language, query, snippets, tag } = get();
    const languageFiltered = getFilteredSnippets({ language, query, snippets });

    return languageFiltered.filter((snippet) => {
      const matchesCollection =
        collection === "All" ||
        (collection === "__none" && !getSnippetCollectionId(snippet)) ||
        getSnippetCollectionId(snippet) === collection;
      const matchesTag = tag === "All" || snippet.tags.includes(tag);

      return matchesCollection && matchesTag;
    });
  },
  getCollectionName: (collectionId) => {
    const { collections } = get();
    return collections.find((item) => getCollectionId(item) === collectionId)
      ?.name;
  },
  getCollectionsForFilters: () => {
    const { collections, snippets } = get();
    const hasUnassigned = snippets.some(
      (snippet) => !getSnippetCollectionId(snippet),
    );

    return [
      { _id: "All", name: "All" },
      ...(hasUnassigned ? [{ _id: "__none", name: "Unassigned" }] : []),
      ...collections,
    ];
  },
  getLanguages: () => {
    const { language, selectedSnippet, snippets } = get();
    return getLanguages(snippets, [
      language === "All" ? null : language,
      selectedSnippet?.language,
    ]);
  },
  getSnippetLanguageOptions: () =>
    getLanguages(get().snippets).filter(
      (currentLanguage) => currentLanguage !== "All",
    ),
  getTotalFavorites: () =>
    get().snippets.filter((snippet) => snippet.favorite).length,
  getTags: () => [
    "All",
    ...new Set(get().snippets.flatMap((snippet) => snippet.tags || [])),
  ],
  getTotalLanguages: () =>
    new Set(
      get()
        .snippets.map((snippet) => snippet.language)
        .filter(Boolean),
    ).size,
  loadSnippets: async () => {
    try {
      set({ error: "", isLoading: true });
      const [snippets, collections] = await Promise.all([
        getSnippets(),
        getCollections(),
      ]);
      set({
        collections,
        isLoading: false,
        selectedSnippet: snippets[0] || null,
        snippets,
      });
    } catch (apiError) {
      set({
        collections: [],
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
    const { collection, language } = get();

    set({
      customDraftLanguage: "",
      draftCollection: collection === "All" ? "" : collection,
      draftCollectionDescription: "",
      draftCollectionName: "",
      draftLanguage: language === "All" ? "JavaScript" : language,
      draftTags: "",
      draftTitle: "",
      isCreateOpen: true,
    });
  },
  saveSelectedSnippetCode: async (code) => {
    const { collections, selectedSnippet, snippets } = get();
    if (!selectedSnippet) return;

    try {
      set({ error: "" });

      if (selectedSnippet.isDraft) {
        let collection = getSnippetCollectionId(selectedSnippet);
        let nextCollections = collections;

        if (selectedSnippet.pendingCollectionName) {
          const createdCollection = await createCollection({
            name: selectedSnippet.pendingCollectionName,
            description: selectedSnippet.pendingCollectionDescription,
          });

          collection = getCollectionId(createdCollection);
          nextCollections = [...collections, createdCollection];
        }

        const createdSnippet = await createSnippet({
          title: selectedSnippet.title,
          collection,
          description: selectedSnippet.description,
          language: selectedSnippet.language,
          tags: selectedSnippet.tags,
          favorite: selectedSnippet.favorite,
          code,
        });

        set({
          collection: collection || "All",
          collections: nextCollections,
          selectedSnippet: createdSnippet,
          snippets: [createdSnippet, ...snippets],
        });
        return;
      }

      if (code === selectedSnippet.code) return;

      const updatedSnippet = await updateSnippet(
        getSnippetId(selectedSnippet),
        {
          code,
        },
      );

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
      const updatedSnippet = await updateSnippet(
        getSnippetId(selectedSnippet),
        {
          description,
        },
      );

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
  setCollection: (collection) => set({ collection }),
  setDraftCollection: (draftCollection) => set({ draftCollection }),
  setDraftCollectionDescription: (draftCollectionDescription) =>
    set({ draftCollectionDescription }),
  setDraftCollectionName: (draftCollectionName) => set({ draftCollectionName }),
  setDraftLanguage: (draftLanguage) => set({ draftLanguage }),
  setDraftTags: (draftTags) => set({ draftTags }),
  setDraftTitle: (draftTitle) => set({ draftTitle }),
  setLanguage: (language) => set({ language }),
  setQuery: (query) => set({ query }),
  setSelectedSnippet: (selectedSnippet) => set({ selectedSnippet }),
  setTag: (tag) => set({ tag }),
  toggleFilters: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),
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
