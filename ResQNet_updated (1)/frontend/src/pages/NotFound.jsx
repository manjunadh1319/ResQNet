import { Link } from "react-router-dom";
import { FiRadio, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
        <span className="absolute h-20 w-20 rounded-full border-2 border-signal-500/30 animate-pulse-ring" />
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-signal-500 to-cyan-400 text-white">
          <FiRadio className="h-7 w-7" />
        </span>
      </div>
      <h1 className="font-display text-5xl font-bold text-ink-900 dark:text-mist-50">404</h1>
      <p className="mt-2 font-mono text-sm text-ink-600 dark:text-mist-200/60">
        Signal lost — this location isn't on the map.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-signal-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-signal-500/25"
      >
        <FiHome className="h-4 w-4" /> Return to Dashboard
      </Link>
    </div>
  );
}
