import { create } from "zustand";
import { getMe } from "../services/authApi";

function readInitialToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    localStorage.setItem("codevault_token", token);
    return token;
  }

  return localStorage.getItem("codevault_token");
}

const initialToken = readInitialToken();

export const useAuthStore = create((set) => ({
  authError: "",
  isAuthenticated: Boolean(initialToken),
  isCheckingAuth: Boolean(initialToken),
  user: null,
  checkAuth: async () => {
    const token = localStorage.getItem("codevault_token");

    if (!token) {
      set({
        authError: "",
        isAuthenticated: false,
        isCheckingAuth: false,
        user: null,
      });
      return;
    }

    try {
      set({ authError: "", isCheckingAuth: true });
      const user = await getMe();

      set({
        isAuthenticated: true,
        isCheckingAuth: false,
        user,
      });
    } catch (error) {
      localStorage.removeItem("codevault_token");
      set({
        authError: error.message,
        isAuthenticated: false,
        isCheckingAuth: false,
        user: null,
      });
    }
  },
  clearOAuthTokenFromUrl: () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) return;

    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.pathname + url.search);
  },
  login: (token, user = null) => {
    if (!token) return;

    localStorage.setItem("codevault_token", token);
    set({
      authError: "",
      isAuthenticated: true,
      isCheckingAuth: false,
      user,
    });
  },
  logout: () => {
    localStorage.removeItem("codevault_token");
    set({
      authError: "",
      isAuthenticated: false,
      isCheckingAuth: false,
      user: null,
    });
  },
}));
