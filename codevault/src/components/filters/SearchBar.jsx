import { Search } from "lucide-react";

export default function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative min-w-0">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={20}
      />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search snippets by title, description, or tag..."
        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:bg-slate-950"
      />
    </div>
  );
}
