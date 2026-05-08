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
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
        dark
          ? "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
          : danger
            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950"
            : active
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-400/15 dark:text-yellow-300 dark:hover:bg-yellow-400/25"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
