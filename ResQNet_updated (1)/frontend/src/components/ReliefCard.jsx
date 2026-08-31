import { FiPackage, FiHome } from "react-icons/fi";
import ResultCardShell from "./ResultCardShell";

export default function ReliefCard({ data }) {
  if (!data) return null;
  const resources = data.allocated_resources || [];
  const shelters = data.recommended_shelters || [];

  return (
    <ResultCardShell icon={FiPackage} title="Relief Resources" accent="medium">
      <div className="space-y-4">
        {resources.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {resources.map((r, i) => (
              <div key={i} className="rounded-lg bg-medium/8 p-2.5">
                <p className="text-xs text-ink-600 dark:text-mist-200/60">{r.resource}</p>
                <p className="font-display text-sm font-bold text-ink-900 dark:text-mist-50">
                  {r.quantity_allocated} {r.unit || ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {shelters.length > 0 && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/50">
              <FiHome className="h-3.5 w-3.5" /> Recommended Shelters
            </p>
            <div className="space-y-1.5">
              {shelters.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-ink-700 dark:text-mist-200/80">{s.name}</span>
                  <span className="text-xs font-mono text-ink-600 dark:text-mist-200/50">cap. {s.capacity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.allocation_notes && (
          <p className="text-xs text-ink-600 dark:text-mist-200/60 pt-1 border-t border-ink-900/10 dark:border-mist-100/10">
            {data.allocation_notes}
          </p>
        )}
      </div>
    </ResultCardShell>
  );
}
