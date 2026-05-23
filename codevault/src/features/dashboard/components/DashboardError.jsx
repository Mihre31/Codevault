import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardError() {
  const message = useDashboardStore((state) => state.error);

  if (!message) return null;

  const shouldShowAuthHint =
    message.toLowerCase().includes("token") ||
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("login");

  return (
    <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
      {message}
      {shouldShowAuthHint && (
        <>
          . Login first, then make sure your browser allows the auth cookie.
        </>
      )}
    </section>
  );
}
