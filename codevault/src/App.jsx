import { useEffect } from "react";
import CodeVaultUI from "./pages/Dashboard";
import AuthPage from "./pages/auth/AuthPage";
import { useAuthStore } from "./stores/authStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearOAuthTokenFromUrl = useAuthStore(
    (state) => state.clearOAuthTokenFromUrl,
  );

  useEffect(() => {
    checkAuth();
    clearOAuthTokenFromUrl();
  }, [checkAuth, clearOAuthTokenFromUrl]);

  if (isCheckingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5 text-center shadow-2xl">
          <p className="text-sm font-semibold text-white">Opening CodeVault</p>
          <p className="mt-1 text-sm text-slate-400">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <CodeVaultUI />;
}

export default App;
