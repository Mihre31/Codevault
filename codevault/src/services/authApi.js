const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

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

export function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function signup(userData) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function logout() {
  return request("/auth/logout", {
    method: "POST",
  });
}

export function getMe() {
  const token = localStorage.getItem("codevault_token");

  return request("/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function startGoogleAuth() {
  window.location.href = `${API_ORIGIN}/api/auth/google`;
}
