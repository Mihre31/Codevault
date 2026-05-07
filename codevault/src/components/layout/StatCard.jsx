export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition-colors dark:border dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
        {value}
      </h2>
    </div>
  );
}
