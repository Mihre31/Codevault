import { useState } from "react";
import {
  Code2,
  Eye,
  Globe2,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import {
  login,
  requestPasswordReset,
  resetPassword,
  signup,
  startGoogleAuth,
} from "../../services/authApi";
import { useAuthStore } from "../../stores/authStore";

function GoogleMark() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold">
      <span className="bg-gradient-to-r from-blue-500 via-green-500 to-red-500 bg-clip-text text-transparent">
        G
      </span>
    </span>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 shadow-[0_0_35px_rgba(99,102,241,0.18)]">
        {icon}
      </div>
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  );
}

export default function AuthPage() {
  const resetToken = new URL(window.location.href).searchParams.get("resetToken");
  const [mode, setMode] = useState(resetToken ? "reset" : "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authenticate = useAuthStore((state) => state.login);
  const isSignup = mode === "signup";
  const isForgotPassword = mode === "forgot";
  const isResetPassword = mode === "reset";
  const heading = isSignup
    ? "Create account"
    : isForgotPassword
      ? "Reset password"
      : isResetPassword
        ? "New password"
        : "Welcome back";
  const subheading = isSignup
    ? "Create your vault and start organizing reusable code snippets."
    : isForgotPassword
      ? "Enter your email and we will send a secure reset link."
      : isResetPassword
        ? "Choose a new password for your CodeVault account."
        : "Sign in to your vault and continue building amazing things.";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");
      setIsSubmitting(true);

      if (isForgotPassword) {
        const data = await requestPasswordReset(email);
        setMessage(data.message);
        return;
      }

      if (isResetPassword) {
        const data = await resetPassword(resetToken, password);
        const url = new URL(window.location.href);
        url.searchParams.delete("resetToken");
        window.history.replaceState({}, "", url.pathname + url.search);
        setPassword("");
        setMode("login");
        setMessage(data.message);
        return;
      }

      const data = isSignup
        ? await signup({ fullName, email, password })
        : await login({ email, password });

      authenticate(data.token, data);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  function switchMode(nextMode) {
    setError("");
    setMessage("");
    setMode(nextMode);
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#050816] px-5 py-5 text-slate-100 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:88px_88px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_19%_21%,rgba(99,102,241,0.16),transparent_24%),radial-gradient(circle_at_72%_45%,rgba(124,58,237,0.17),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(2,6,23,0.76))]" />

      <button
        type="button"
        className="absolute right-8 top-6 z-20 flex h-10 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/40 px-4 text-sm font-semibold text-slate-200 backdrop-blur"
      >
        <Globe2 size={17} />
        English
      </button>

      <section className="relative z-10 mx-auto grid h-[calc(100vh-40px)] max-w-[1440px] gap-8 lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center">
        <div className="min-h-0">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-950/45 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-500/25">
                <Zap size={20} fill="currentColor" />
              </div>
              <p className="text-xl font-bold text-white">CodeVault</p>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white">
              {heading}
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300">
              {subheading}
            </p>

            {!isForgotPassword && !isResetPassword && (
              <>
                <button
                  type="button"
                  onClick={startGoogleAuth}
                  className="mt-7 flex h-12 w-full items-center justify-center gap-4 rounded-lg border border-slate-700 bg-slate-900/60 text-sm font-bold text-white transition hover:border-violet-400/60 hover:bg-slate-900"
                >
                  <GoogleMark />
                  Continue with Google
                </button>

                <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-sm text-slate-500">
                  <span className="h-px bg-slate-800" />
                  or
                  <span className="h-px bg-slate-800" />
                </div>
              </>
            )}

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isSignup && (
                <label className="block">
                  <span className="text-sm font-bold text-white">Full name</span>
                  <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-slate-300 focus-within:border-violet-400/70">
                    <Code2 size={19} className="text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your name"
                      className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
              )}

              {!isResetPassword && (
                <label className="block">
                  <span className="text-sm font-bold text-white">Email</span>
                  <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-slate-300 focus-within:border-violet-400/70">
                    <Mail size={19} className="text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="mail@website.com"
                      className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                </label>
              )}

              {!isForgotPassword && (
                <label className="block">
                  <span className="text-sm font-bold text-white">Password</span>
                  <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-700 bg-slate-950/40 px-4 text-slate-300 focus-within:border-violet-400/70">
                    <Lock size={19} className="text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Min. 6 characters"
                      className="h-full min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-slate-400 transition hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      <Eye size={19} />
                    </button>
                  </div>
                </label>
              )}

              {!isSignup && !isForgotPassword && !isResetPassword && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-3 text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 accent-violet-500"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="font-semibold text-violet-300 transition hover:text-violet-200"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-base font-bold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Lock size={18} />
                {isSubmitting
                  ? "Please wait..."
                  : isSignup
                    ? "Create account"
                    : isForgotPassword
                      ? "Send reset link"
                      : isResetPassword
                        ? "Save new password"
                        : "Login"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-300">
              {isForgotPassword || isResetPassword ? (
                <>
                  Remembered your password?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-bold text-violet-300 hover:text-violet-200"
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(isSignup ? "login" : "signup")}
                    className="font-bold text-violet-300 hover:text-violet-200"
                  >
                    {isSignup ? "Login" : "Sign up"}
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6 px-5 text-xs text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Shield size={17} />
              Your data is encrypted and secure
            </span>
            <span className="hidden h-4 w-px bg-slate-800 sm:block" />
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>

        <div className="relative hidden h-[680px] min-h-0 lg:block">
          <div className="absolute left-[12%] top-[13%] flex items-start gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 shadow-[0_0_50px_rgba(124,58,237,0.35)]">
              <Code2 size={30} />
            </div>
            <div>
              <h2 className="text-3xl font-bold leading-tight text-white">
                Built for <span className="text-violet-400">developers.</span>
                <br />
                Designed for <span className="text-indigo-400">flow.</span>
              </h2>
              <p className="mt-5 max-w-sm text-base leading-7 text-slate-400">
                Store, organize, and access your code snippets anytime,
                anywhere.
              </p>
            </div>
          </div>

          <div className="absolute right-[9%] top-[20%] flex h-24 w-24 items-center justify-center rounded-2xl border border-violet-400/20 bg-slate-900/75 text-violet-400 shadow-[0_0_70px_rgba(124,58,237,0.25)]">
            <span className="text-4xl font-bold">{"{}"}</span>
          </div>

          <div className="absolute left-[9%] top-[39%] w-[560px] max-w-[80%] rounded-3xl border border-violet-400/25 bg-slate-950/65 shadow-[0_40px_120px_rgba(15,23,42,0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 px-7 py-4">
              <span className="h-3 w-3 rounded-full bg-violet-400" />
              <span className="h-3 w-3 rounded-full bg-indigo-400" />
              <span className="h-3 w-3 rounded-full bg-sky-400" />
              <span className="ml-7 rounded-md bg-violet-500/20 px-4 py-2 text-sm font-semibold text-violet-200">
                snippet.js
              </span>
            </div>
            <pre className="overflow-hidden px-10 py-6 font-mono text-sm leading-7 text-slate-300">
              <code>
                <span className="text-slate-500">1 </span>
                <span className="text-violet-300">function</span>{" "}
                <span className="text-sky-300">getCodeVault</span>() {" {"}
                {"\n"}
                <span className="text-slate-500">2 </span>
                {"  "}
                <span className="text-violet-300">return</span> {"{"}
                {"\n"}
                <span className="text-slate-500">3 </span>
                {"    "}secure: <span className="text-rose-300">true</span>,
                {"\n"}
                <span className="text-slate-500">4 </span>
                {"    "}sync: <span className="text-emerald-300">'real-time'</span>,
                {"\n"}
                <span className="text-slate-500">5 </span>
                {"    "}developers: <span className="text-amber-300">'happy'</span>
                {"\n"}
                <span className="text-slate-500">6 </span>
                {"  };"}{"\n"}
                <span className="text-slate-500">7 </span>
                {"}"}
              </code>
            </pre>
          </div>

          <div className="absolute right-[10%] top-[55%] flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-violet-400/30 bg-slate-900/80 text-center text-xs font-semibold text-white shadow-[0_0_70px_rgba(124,58,237,0.22)]">
            <Lock size={30} className="mb-3 text-violet-300" />
            End-to-end
            <br />
            encrypted
          </div>

          <div className="absolute bottom-3 left-[9%] right-[8%] grid grid-cols-3 gap-6">
            <Feature
              icon={<Zap size={23} fill="currentColor" />}
              title="Lightning fast"
              text="Instant access"
            />
            <Feature
              icon={<Shield size={23} />}
              title="Private by design"
              text="Your code, your rules"
            />
            <Feature
              icon={<RefreshCw size={23} />}
              title="Always in sync"
              text="Across all devices"
            />
          </div>

          <div className="absolute bottom-[25%] left-[1%] flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/60 text-sky-300">
            <Terminal size={30} />
          </div>
        </div>
      </section>
    </main>
  );
}
