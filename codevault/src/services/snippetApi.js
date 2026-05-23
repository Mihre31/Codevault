const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}

export function getSnippets() {
  return request("/snippets");
}

export function getTrashSnippets() {
  return request("/snippets/trash");
}

export function createSnippet(snippet) {
  return request("/snippets", {
    method: "POST",
    body: JSON.stringify(snippet),
  });
}

export function updateSnippet(snippetId, updates) {
  return request(`/snippets/${snippetId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteSnippet(snippetId) {
  return request(`/snippets/${snippetId}`, {
    method: "DELETE",
  });
}

export function permanentlyDeleteSnippet(snippetId) {
  return request(`/snippets/${snippetId}/permanent`, {
    method: "DELETE",
  });
}

export function restoreSnippet(snippetId) {
  return request(`/snippets/${snippetId}/restore`, {
    method: "PATCH",
  });
}

export function toggleSnippetFavorite(snippetId) {
  return request(`/snippets/${snippetId}/favorite`, {
    method: "PATCH",
  });
}
