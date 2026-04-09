/** Instant feedback while a dashboard page chunk loads (dev compilation feels much snappier). */
export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary dark:border-cyan-500/20 dark:border-t-cyan-400 animate-spin" />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading…</p>
    </div>
  );
}
