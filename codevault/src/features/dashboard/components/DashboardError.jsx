import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardError() {
  const message = useDashboardStore((state) => state.error);

  if (!message) return null;

  return (
    <section className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
      {message}. Login first, then save your token as{" "}
      <code>localStorage.codevault_token</code>, or use the auth cookie.
    </section>
  );
}
