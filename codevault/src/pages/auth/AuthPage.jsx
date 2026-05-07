import { useState } from "react";
import { login, signup, startGoogleAuth } from "../../services/authApi";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const data = isSignup
        ? await signup({ fullName, email, password })
        : await login({ email, password });

      localStorage.setItem("codevault_token", data.token);
      onAuthSuccess(data);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#25323d] p-5 text-slate-100 sm:p-8 lg:p-14">
      <section className="mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl overflow-hidden bg-[#121e29] shadow-2xl sm:min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-112px)] lg:grid-cols-[minmax(420px,0.95fr)_1.35fr]">
        <div className="flex min-h-[720px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
          <div className="w-full max-w-[420px]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-indigo-300">
              CodeVault
            </p>
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
              className="mt-10 flex h-14 w-full items-center justify-center gap-4 rounded-full border border-slate-200/90 text-base font-medium text-white transition hover:border-white hover:bg-white/5"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold">
                <span className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-transparent">
                  G
                </span>
              </span>
              {isSignup ? "Sign up" : "Sign in"} with Google
            </button>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-950/40 px-5 py-3 text-sm text-red-100">
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
                    className="mt-4 h-14 w-full rounded-full border border-slate-200/90 bg-transparent px-6 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300"
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
                  className="mt-4 h-14 w-full rounded-full border border-slate-200/90 bg-transparent px-6 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300"
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
                  className="mt-4 h-14 w-full rounded-full border border-slate-200/90 bg-transparent px-6 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-300"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-16 w-full rounded-full bg-[#625cf6] text-base font-semibold text-white transition hover:bg-[#726df8] focus:outline-none focus:ring-4 focus:ring-indigo-400/30 disabled:cursor-not-allowed disabled:opacity-70"
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
                className="font-semibold text-white"
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </p>
          </div>

          <p className="mt-auto pt-12 text-base text-slate-200">
            @2026 CodeVault All rights reserved
          </p>
        </div>

        <div className="relative hidden min-h-[720px] overflow-hidden bg-[#111a25] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,rgba(249,115,22,0.22),transparent_12%),radial-gradient(circle_at_48%_58%,rgba(250,204,21,0.12),transparent_10%),linear-gradient(180deg,rgba(15,23,42,0.15),rgba(2,6,23,0.8))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:110px_110px] opacity-40" />

          <div className="absolute left-[8%] top-[17%] h-56 w-56 rotate-12 skew-y-6 bg-[#1e3448] shadow-2xl">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[#723716]/70" />
            <div className="absolute bottom-0 left-0 h-1/4 w-full bg-[#8b451e]/60" />
          </div>

          <div className="absolute right-[19%] top-[31%] h-72 w-72 -rotate-[28deg] skew-y-6 bg-[#2f2f3b] shadow-[0_35px_90px_rgba(0,0,0,0.55)]">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-[#a85b2f]/70" />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-[#f59e0b]/35" />
          </div>

          <div className="absolute bottom-[12%] right-[16%] h-56 w-56 rotate-[24deg] bg-[#1b1d28] shadow-[0_35px_80px_rgba(0,0,0,0.65)]">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[#2b2c39]" />
          </div>

          <div className="absolute right-[15%] top-[33%] h-32 w-16 rotate-[8deg] rounded-full bg-black shadow-2xl" />
          <div className="absolute bottom-[20%] left-[38%] h-36 w-16 rotate-[34deg] rounded-full bg-[#1c1015] shadow-2xl">
            <div className="h-12 rounded-full bg-[#7a5f51]" />
          </div>

          <div className="absolute right-[26%] top-[24%] h-20 w-20 rounded-full bg-[#fbff55] shadow-[0_0_44px_rgba(253,255,112,0.75)]" />
          <div className="absolute left-[21%] top-[53%] h-20 w-20 rounded-full bg-[#fbff55] shadow-[0_0_44px_rgba(253,255,112,0.65)]" />
        </div>
      </section>
    </main>
  );
}
