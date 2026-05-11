import { useState } from "react";
import { Code2 } from "lucide-react";
import { login, signup, startGoogleAuth } from "../../services/authApi";
import { useAuthStore } from "../../stores/authStore";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authenticate = useAuthStore((state) => state.login);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const data = isSignup
        ? await signup({ fullName, email, password })
        : await login({ email, password });

      authenticate(data.token);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:96px_96px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_78%_72%,rgba(148,163,184,0.12),transparent_26%)]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-32px)] max-w-7xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:min-h-[calc(100vh-48px)] lg:min-h-[calc(100vh-64px)] lg:grid-cols-[minmax(420px,0.95fr)_1.35fr]">
        <div className="flex min-h-[720px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
          <div className="w-full max-w-[420px]">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-950">
                <Code2 size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">CodeVault</p>
                <p className="text-xs text-slate-400">
                  Save, organize, and reuse code.
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-bold tracking-normal text-white sm:text-6xl">
              {isSignup ? "Sign up" : "Login"}
            </h1>
            <p className="mt-5 text-base text-slate-300">
              {isSignup
                ? "Create your vault and start organizing reusable code snippets."
                : "Welcome back. Open your vault and keep building."}
            </p>

            <button
              type="button"
              onClick={startGoogleAuth}
              className="mt-10 flex h-14 w-full items-center justify-center gap-4 rounded-2xl border border-slate-700 bg-slate-800 text-base font-semibold text-white transition hover:bg-slate-700"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold">
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-transparent">
                  G
                </span>
              </span>
              {isSignup ? "Sign up" : "Sign in"} with Google
            </button>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/40 px-5 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {isSignup && (
                <label className="block">
                  <span className="text-base font-semibold text-slate-100">
                    Full name*
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    className="mt-4 h-14 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500"
                  />
                </label>
              )}

              <label className="block">
                <span className="text-base font-semibold text-slate-100">
                  Email*
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="mail@website.com"
                  className="mt-4 h-14 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500"
                />
              </label>

              <label className="block">
                <span className="text-base font-semibold text-slate-100">
                  Password*
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Min. 6 character"
                  className="mt-4 h-14 w-full rounded-2xl border border-slate-700 bg-slate-950 px-5 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-slate-500"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-16 w-full rounded-2xl bg-slate-100 text-base font-semibold text-slate-950 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isSignup
                    ? "Create account"
                    : "Login"}
              </button>
            </form>

            <p className="mt-8 text-sm text-slate-400">
              {isSignup ? "Already have an account?" : "Need an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode(isSignup ? "login" : "signup");
                }}
                className="font-semibold text-white hover:text-slate-200"
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </p>
          </div>

          <p className="mt-auto pt-12 text-base text-slate-200">
            @2026 CodeVault All rights reserved
          </p>
        </div>

        <div className="relative hidden min-h-[720px] overflow-hidden border-l border-slate-800 bg-slate-950 lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:96px_96px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(255,255,255,0.09),transparent_18%),linear-gradient(180deg,rgba(15,23,42,0),rgba(2,6,23,0.75))]" />

          <div className="absolute left-[14%] top-[20%] h-48 w-48 rotate-12 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl" />
          <div className="absolute right-[16%] top-[30%] h-72 w-72 -rotate-[24deg] rounded-2xl border border-slate-700 bg-slate-800 shadow-[0_35px_90px_rgba(0,0,0,0.55)]" />
          <div className="absolute bottom-[13%] right-[18%] h-52 w-52 rotate-[22deg] rounded-2xl border border-slate-700 bg-slate-900 shadow-[0_35px_80px_rgba(0,0,0,0.65)]" />

          <div className="absolute left-[28%] top-[56%] flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-950 shadow-[0_0_44px_rgba(248,250,252,0.24)]">
            <Code2 size={34} />
          </div>
          <div className="absolute right-[23%] top-[22%] h-16 w-16 rounded-2xl border border-slate-600 bg-slate-100/10" />
          <div className="absolute bottom-[28%] left-[42%] h-10 w-28 rounded-full bg-slate-100/10" />
        </div>
      </section>
    </main>
  );
}
