export const snippets = [
  {
    id: 1,
    title: "Axios API Instance",
    description: "Reusable axios setup for API requests.",
    language: "TypeScript",
    tags: ["api", "axios"],
    favorite: true,
    code: `import axios from "axios";\n\nexport const axiosInstance = axios.create({\n  baseURL: import.meta.env.VITE_API_URL,\n  withCredentials: true,\n});`,
  },
  {
    id: 2,
    title: "Express Error Handler",
    description: "Centralized error handler middleware.",
    language: "JavaScript",
    tags: ["express", "backend"],
    favorite: false,
    code: `export const errorHandler = (err, req, res, next) => {\n  const status = err.statusCode || 500;\n  res.status(status).json({ message: err.message });\n};`,
  },
  {
    id: 3,
    title: "Zustand Auth Store",
    description: "Simple auth store with Zustand.",
    language: "TypeScript",
    tags: ["zustand", "auth"],
    favorite: true,
    code: `import { create } from "zustand";\n\nexport const useAuthStore = create((set) => ({\n  authUser: null,\n  setAuthUser: (user) => set({ authUser: user }),\n}));`,
  },
];

export const languages = ["All", "TypeScript", "JavaScript", "React", "CSS"];
