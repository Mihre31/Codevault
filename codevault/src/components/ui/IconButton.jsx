export default function IconButton({
  active = false,
  icon,
  label,
  dark = false,
  danger = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition ${
        dark
          ? "border border-slate-200 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          : danger
            ? "border border-red-500/20 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-300"
            : active
              ? "border border-yellow-400/30 bg-yellow-400/15 text-yellow-600 hover:bg-yellow-400/20 dark:text-yellow-300"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
