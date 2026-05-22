import { Code2, Folder, Heart, Languages } from "lucide-react";
import StatCard from "../../../components/layout/StatCard";
import { useDashboardStore } from "../stores/dashboardStore";

export default function DashboardStats() {
  const totalCollections = useDashboardStore((state) => state.collections.length);
  const totalFavorites = useDashboardStore((state) => state.getTotalFavorites());
  const totalLanguages = useDashboardStore((state) => state.getTotalLanguages());
  const totalSnippets = useDashboardStore((state) => state.snippets.length);

  return (
    <section className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        accent="violet"
        icon={<Code2 size={26} />}
        label="Total Snippets"
        meta="+ 12% from last week"
        value={String(totalSnippets)}
      />
      <StatCard
        accent="rose"
        icon={<Heart size={26} />}
        label="Favorites"
        meta="+ 5% from last week"
        value={String(totalFavorites)}
      />
      <StatCard
        accent="blue"
        icon={<Folder size={26} />}
        label="Collections"
        meta="+ 2 new collections"
        value={String(totalCollections)}
      />
      <StatCard
        accent="emerald"
        icon={<Languages size={26} />}
        label="Languages"
        meta="+ 1 new language"
        value={String(totalLanguages)}
      />
    </section>
  );
}
