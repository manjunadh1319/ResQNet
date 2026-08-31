export default function LoadingSpinner({ label = "Loading", size = "md" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-14 h-14 border-[3px]",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative flex items-center justify-center">
        <span
          className={`absolute rounded-full ${sizes[size]} border-[var(--color-signal-400)]/40 animate-pulse-ring`}
        />
        <span
          className={`rounded-full ${sizes[size]} border-[var(--color-signal-500)] border-t-transparent animate-spin`}
        />
      </div>
      {label && (
        <p className="text-sm font-mono tracking-wide text-ink-600 dark:text-mist-200/70">
          {label}
        </p>
      )}
    </div>
  );
}
