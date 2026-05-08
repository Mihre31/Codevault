import { useEffect } from "react";
import CodeVaultUI from "./pages/Dashboard";
import AuthPage from "./pages/auth/AuthPage";
import { useAuthStore } from "./stores/authStore";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearOAuthTokenFromUrl = useAuthStore(
    (state) => state.clearOAuthTokenFromUrl,
  );

  useEffect(() => {
    clearOAuthTokenFromUrl();
  }, [clearOAuthTokenFromUrl]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <CodeVaultUI />;
}

export default App;
