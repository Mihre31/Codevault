export function getSnippetId(snippet) {
  return snippet?._id || snippet?.id;
}

export function getCollectionId(collection) {
  return collection?._id || collection?.id || collection || null;
}

export function createDraftSnippet({
  collection = null,
  collectionName = "",
  language,
  pendingCollectionDescription = "",
  pendingCollectionName = "",
  tags = [],
  title,
}) {
  return {
    id: `draft-${Date.now()}`,
    isDraft: true,
    title,
    collection,
    collectionName,
    pendingCollectionDescription,
    pendingCollectionName,
    description: "Add a short description for this snippet.",
    language,
    tags,
    favorite: false,
    code: "// Start writing your snippet here",
  };
}
