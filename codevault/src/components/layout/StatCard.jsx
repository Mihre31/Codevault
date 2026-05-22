export default function StatCard({ accent = "violet", icon, label, meta, value }) {
  const accentClasses = {
    blue: "from-sky-500/25 to-sky-500/5 text-sky-400",
    emerald: "from-emerald-500/25 to-emerald-500/5 text-emerald-400",
    rose: "from-rose-500/25 to-rose-500/5 text-rose-400",
    violet: "from-violet-500/25 to-violet-500/5 text-violet-400",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-[#0c1328]/90">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
            {value}
          </h2>
        </div>
        {icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentClasses[accent]}`}
          >
            {icon}
          </div>
        )}
      </div>
      {meta && (
        <p className="mt-4 text-sm font-medium text-emerald-500 dark:text-emerald-400">
          {meta}
        </p>
      )}
    </div>
  );
}
