import { useEffect, useState } from "react";
import CodeVaultUI from "./pages/Dashboard";
import AuthPage from "./pages/auth/AuthPage";

function getInitialAuthStatus() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    localStorage.setItem("codevault_token", token);
    return true;
  }

  return Boolean(localStorage.getItem("codevault_token"));
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthStatus);

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) return;

    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return <CodeVaultUI onLogout={() => setIsAuthenticated(false)} />;
}

export default App;
