import StatCard from "../../../components/layout/StatCard";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardStats() {
  const totalCollections = useDashboardStore((state) => state.collections.length);
  const totalFavorites = useDashboardStore((state) => state.getTotalFavorites());
  const totalLanguages = useDashboardStore((state) => state.getTotalLanguages());
  const totalSnippets = useDashboardStore((state) => state.snippets.length);

  return (
    <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
      <StatCard label="Total Snippets" value={String(totalSnippets)} />
      <StatCard label="Favorites" value={String(totalFavorites)} />
      <StatCard label="Languages" value={String(totalLanguages)} />
      <StatCard label="Collections" value={String(totalCollections)} />
    </section>
  );
}
