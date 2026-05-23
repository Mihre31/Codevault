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
  getTrashSnippets,
  getSnippets,
  permanentlyDeleteSnippet,
  restoreSnippet,
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
    const snippetTitle = String(snippet.title || "");
    const snippetDescription = String(snippet.description || "");
    const snippetTags = Array.isArray(snippet.tags) ? snippet.tags : [];
    const matchesSearch =
      searchValue === "" ||
      snippetTitle.toLowerCase().includes(searchValue) ||
      snippetDescription.toLowerCase().includes(searchValue) ||
      getSnippetCollectionName(snippet)?.toLowerCase().includes(searchValue) ||
      snippetTags.some((tag) =>
        String(tag).toLowerCase().includes(searchValue),
      );

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

function downloadTextFile({ content, filename, type }) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getCollectionName(collection) {
  if (typeof collection === "object") return collection?.name || "";
  return "";
}

function getCollectionDescription(collection) {
  if (typeof collection === "object") return collection?.description || "";
  return "";
}

function getExportedSnippet(snippet) {
  const collectionName =
    snippet.pendingCollectionName ||
    snippet.collectionName ||
    getCollectionName(snippet.collection);

  return {
    title: snippet.title || "Untitled snippet",
    description: snippet.description || "",
    language: snippet.language || "Plain Text",
    tags: Array.isArray(snippet.tags) ? snippet.tags : [],
    favorite: Boolean(snippet.favorite),
    code: snippet.code || "",
    collection: collectionName
      ? {
          name: collectionName,
          description: getCollectionDescription(snippet.collection),
        }
      : null,
    createdAt: snippet.createdAt || null,
    updatedAt: snippet.updatedAt || null,
  };
}

function getExportPayload({ collections, snippets }) {
  return {
    app: "CodeVault",
    version: 1,
    exportedAt: new Date().toISOString(),
    collections: collections.map((collection) => ({
      name: collection.name,
      description: collection.description || "",
    })),
    snippets: snippets.map(getExportedSnippet),
  };
}

function getMarkdownFence(language) {
  const normalizedLanguage = String(language || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#-]/g, "");

  const aliases = {
    javascript: "javascript",
    typescript: "typescript",
    react: "jsx",
    html: "html",
    css: "css",
    python: "python",
    json: "json",
    "c++": "cpp",
    "c#": "csharp",
  };

  return aliases[normalizedLanguage] || normalizedLanguage || "text";
}

function getSnippetsMarkdown(snippets) {
  const lines = ["# CodeVault Snippets", ""];

  snippets.forEach((snippet, index) => {
    const exportedSnippet = getExportedSnippet(snippet);
    const collectionName = exportedSnippet.collection?.name || "Unassigned";
    const tags = exportedSnippet.tags.length
      ? exportedSnippet.tags.map((tag) => `#${tag}`).join(" ")
      : "None";

    lines.push(
      `## ${index + 1}. ${exportedSnippet.title}`,
      "",
      `- Language: ${exportedSnippet.language}`,
      `- Collection: ${collectionName}`,
      `- Tags: ${tags}`,
      `- Favorite: ${exportedSnippet.favorite ? "Yes" : "No"}`,
      "",
    );

    if (exportedSnippet.description) {
      lines.push(exportedSnippet.description, "");
    }

    lines.push(
      `\`\`\`${getMarkdownFence(exportedSnippet.language)}`,
      exportedSnippet.code,
      "```",
      "",
    );
  });

  return lines.join("\n");
}

function getImportCollectionName(collection) {
  if (!collection) return "";
  if (typeof collection === "string") return collection.trim();
  return String(collection.name || "").trim();
}

function getImportCollectionDescription(collection) {
  if (!collection || typeof collection === "string") return "";
  return String(collection.description || "").trim();
}

function normalizeImportedSnippet(snippet) {
  return {
    title: String(snippet.title || "Untitled snippet").trim() || "Untitled snippet",
    description: String(snippet.description || ""),
    language: String(snippet.language || "Plain Text").trim() || "Plain Text",
    tags: Array.isArray(snippet.tags)
      ? snippet.tags.map((tag) => String(tag).trim().replace(/^#/, "")).filter(Boolean)
      : [],
    favorite: Boolean(snippet.favorite),
    code: String(snippet.code || "// Imported snippet"),
    collectionName: getImportCollectionName(snippet.collection),
    collectionDescription: getImportCollectionDescription(snippet.collection),
  };
}

function parseSnippetImport(rawImport) {
  const parsedImport = JSON.parse(rawImport);
  const snippets = Array.isArray(parsedImport)
    ? parsedImport
    : parsedImport?.snippets;

  if (!Array.isArray(snippets) || snippets.length === 0) {
    throw new Error(
      'The JSON file must be a snippets array or an object with a "snippets" array.',
    );
  }

  return snippets.map(normalizeImportedSnippet);
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
  isImporting: false,
  isLoading: true,
  language: "All",
  portabilityMessage: "",
  query: "",
  selectedSnippet: null,
  snippets: [],
  tag: "All",
  theme: "dark",
  trashedSnippets: [],
  view: "dashboard",

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
      view: "dashboard",
    });
  },
  deleteSelectedSnippet: async () => {
    const { selectedSnippet, snippets, trashedSnippets, view } = get();
    if (!selectedSnippet) return;

    if (selectedSnippet.isDraft) {
      set({ selectedSnippet: snippets[0] || null });
      return;
    }

    const snippetId = getSnippetId(selectedSnippet);
    const deleteChoice = window
      .prompt(
        'Type "trash" to move this snippet to Trash, or "delete" to permanently delete it.',
        view === "trash" ? "delete" : "trash",
      )
      ?.trim()
      .toLowerCase();

    if (!deleteChoice) return;

    try {
      set({ error: "" });

      if (deleteChoice === "delete") {
        await permanentlyDeleteSnippet(snippetId);

        const nextSnippets = snippets.filter(
          (snippet) => getSnippetId(snippet) !== snippetId,
        );
        const nextTrashedSnippets = trashedSnippets.filter(
          (snippet) => getSnippetId(snippet) !== snippetId,
        );

        set({
          portabilityMessage: "Snippet permanently deleted.",
          selectedSnippet:
            view === "trash"
              ? nextTrashedSnippets[0] || null
              : nextSnippets[0] || null,
          snippets: nextSnippets,
          trashedSnippets: nextTrashedSnippets,
        });
        return;
      }

      if (deleteChoice !== "trash") {
        set({ error: 'Use "trash" or "delete" for the delete action.' });
        return;
      }

      const trashedSnippet = await deleteSnippet(snippetId);

      const nextSnippets = snippets.filter(
        (snippet) => getSnippetId(snippet) !== snippetId,
      );

      set({
        portabilityMessage: "Snippet moved to Trash.",
        selectedSnippet: nextSnippets[0] || null,
        snippets: nextSnippets,
        trashedSnippets: [trashedSnippet, ...trashedSnippets],
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
      const snippetTags = Array.isArray(snippet.tags) ? snippet.tags : [];
      const matchesTag = tag === "All" || snippetTags.includes(tag);

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
  exportSnippetsAsJson: () => {
    const { collections, snippets } = get();

    if (!snippets.length) {
      set({ portabilityMessage: "", error: "No snippets to export yet." });
      return;
    }

    downloadTextFile({
      content: JSON.stringify(getExportPayload({ collections, snippets }), null, 2),
      filename: "codevault-snippets.json",
      type: "application/json",
    });
    set({ error: "", portabilityMessage: "JSON backup downloaded." });
  },
  downloadSnippetsAsMarkdown: () => {
    const { snippets } = get();

    if (!snippets.length) {
      set({ portabilityMessage: "", error: "No snippets to download yet." });
      return;
    }

    downloadTextFile({
      content: getSnippetsMarkdown(snippets),
      filename: "codevault-snippets.md",
      type: "text/markdown",
    });
    set({ error: "", portabilityMessage: "Markdown file downloaded." });
  },
  importSnippetsFromJson: async (file) => {
    if (!file) return;

    try {
      set({ error: "", isImporting: true, portabilityMessage: "" });

      const importedSnippets = parseSnippetImport(await file.text());
      const { collections, snippets } = get();
      const nextCollections = [...collections];
      const collectionByName = new Map(
        nextCollections
          .map((collection) => [
            String(collection.name || "").toLowerCase(),
            collection,
          ])
          .filter(([collectionName]) => collectionName),
      );
      const createdSnippets = [];

      for (const importedSnippet of importedSnippets) {
        let collection = null;

        if (importedSnippet.collectionName) {
          const collectionKey = importedSnippet.collectionName.toLowerCase();
          collection = collectionByName.get(collectionKey);

          if (!collection) {
            collection = await createCollection({
              name: importedSnippet.collectionName,
              description: importedSnippet.collectionDescription,
            });
            nextCollections.push(collection);
            collectionByName.set(collectionKey, collection);
          }
        }

        const createdSnippet = await createSnippet({
          title: importedSnippet.title,
          collection: getCollectionId(collection),
          description: importedSnippet.description,
          language: importedSnippet.language,
          tags: importedSnippet.tags,
          favorite: importedSnippet.favorite,
          code: importedSnippet.code,
        });

        createdSnippets.push(createdSnippet);
      }

      set({
        collection: "All",
        collections: nextCollections,
        isImporting: false,
        portabilityMessage: `${createdSnippets.length} snippet${
          createdSnippets.length === 1 ? "" : "s"
        } imported.`,
        selectedSnippet: createdSnippets[0] || get().selectedSnippet,
        snippets: [...createdSnippets, ...snippets],
      });
    } catch (apiError) {
      set({
        error:
          apiError instanceof Error
            ? apiError.message
            : "Unable to import snippets.",
        isImporting: false,
        portabilityMessage: "",
      });
    }
  },
  loadSnippets: async () => {
    try {
      set({ error: "", isLoading: true });
      const [snippets, collections, trashedSnippets] = await Promise.all([
        getSnippets(),
        getCollections(),
        getTrashSnippets(),
      ]);
      set({
        collections,
        isLoading: false,
        selectedSnippet: snippets[0] || null,
        snippets,
        trashedSnippets,
      });
    } catch (apiError) {
      set({
        collections: [],
        error: apiError.message,
        isLoading: false,
        selectedSnippet: null,
        snippets: [],
        trashedSnippets: [],
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
      view: "dashboard",
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
  setView: (view) => {
    const { snippets, trashedSnippets } = get();

    set({
      collection: view === "trash" ? "All" : get().collection,
      selectedSnippet:
        view === "trash"
          ? trashedSnippets[0] || null
          : snippets[0] || null,
      tag: view === "trash" ? "All" : get().tag,
      view,
    });
  },
  restoreSelectedSnippet: async () => {
    const { selectedSnippet, snippets, trashedSnippets } = get();
    if (!selectedSnippet) return;

    try {
      set({ error: "" });
      const restoredSnippet = await restoreSnippet(getSnippetId(selectedSnippet));
      const nextTrashedSnippets = trashedSnippets.filter(
        (snippet) => getSnippetId(snippet) !== getSnippetId(restoredSnippet),
      );

      set({
        portabilityMessage: "Snippet restored.",
        selectedSnippet: nextTrashedSnippets[0] || null,
        snippets: [restoredSnippet, ...snippets],
        trashedSnippets: nextTrashedSnippets,
      });
    } catch (apiError) {
      set({ error: apiError.message });
    }
  },
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
