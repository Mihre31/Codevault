import { create } from "zustand";
import { getMe } from "../services/authApi";

function removeLegacyStoredToken() {
  localStorage.removeItem("codevault_token");
}

export const useAuthStore = create((set) => ({
  authError: "",
  isAuthenticated: false,
  isCheckingAuth: true,
  user: null,
  checkAuth: async () => {
    try {
      removeLegacyStoredToken();
      set({ authError: "", isCheckingAuth: true });
      const user = await getMe();

      set({
        authError: "",
        isAuthenticated: true,
        isCheckingAuth: false,
        user,
      });
    } catch (error) {
      set({
        authError: error.message,
        isAuthenticated: false,
        isCheckingAuth: false,
        user: null,
      });
    }
  },
  clearOAuthParamsFromUrl: () => {
    const url = new URL(window.location.href);
    const hasAuthError = url.searchParams.has("authError");

    if (!hasAuthError) return;

    url.searchParams.delete("authError");
    window.history.replaceState({}, "", url.pathname + url.search);
  },
  login: (user = null) => {
    set({
      authError: "",
      isAuthenticated: true,
      isCheckingAuth: false,
      user,
    });
  },
  logout: () => {
    set({
      authError: "",
      isAuthenticated: false,
      isCheckingAuth: false,
      user: null,
    });
  },
}));
