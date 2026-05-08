export function getSnippetId(snippet) {
  return snippet?._id || snippet?.id;
}

export function createDraftSnippet({ language, title }) {
  return {
    id: `draft-${Date.now()}`,
    isDraft: true,
    title,
    description: "Add a short description for this snippet.",
    language,
    tags: ["new"],
    favorite: false,
    code: "// Start writing your snippet here",
  };
}
