export default function StatisticsCard({ icon: Icon, label, value, accent = "signal", suffix = "" }) {
  const accents = {
    signal: "from-signal-500 to-cyan-400 shadow-signal-500/25",
    critical: "from-critical to-high shadow-critical/25",
    low: "from-low to-cyan-400 shadow-low/25",
    medium: "from-medium to-high shadow-medium/25",
  };

  return (
    <div className="glass-panel rounded-2xl p-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-ink-600 dark:text-mist-200/60">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-ink-900 dark:text-mist-50">
            {value}
            {suffix && <span className="text-lg text-ink-600 dark:text-mist-200/50">{suffix}</span>}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${accents[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
