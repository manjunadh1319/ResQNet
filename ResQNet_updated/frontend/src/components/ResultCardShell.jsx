export default function ResultCardShell({ icon: Icon, title, accent = "signal", children }) {
  const accents = {
    signal: "from-signal-500 to-cyan-400",
    critical: "from-critical to-high",
    low: "from-low to-cyan-400",
    medium: "from-medium to-high",
  };

  return (
    <div className="glass-panel rounded-2xl p-6 animate-fade-up">
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accents[accent]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-display text-base font-bold text-ink-900 dark:text-mist-50">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
