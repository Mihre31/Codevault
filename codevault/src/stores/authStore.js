import { create } from "zustand";

function readInitialAuthStatus() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    localStorage.setItem("codevault_token", token);
    return true;
  }

  return Boolean(localStorage.getItem("codevault_token"));
}

export const useAuthStore = create((set) => ({
  isAuthenticated: readInitialAuthStatus(),
  clearOAuthTokenFromUrl: () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) return;

    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.pathname + url.search);
  },
  login: (token) => {
    if (token) {
      localStorage.setItem("codevault_token", token);
    }

    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("codevault_token");
    set({ isAuthenticated: false });
  },
}));
