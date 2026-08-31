import { FiShield, FiPhone, FiTruck } from "react-icons/fi";
import ResultCardShell from "./ResultCardShell";

export default function RescueCard({ data }) {
  if (!data) return null;
  const teams = data.deployed_teams || [];

  return (
    <ResultCardShell icon={FiShield} title="Rescue Planning" accent="signal">
      <div className="space-y-3">
        {teams.length === 0 && (
          <p className="text-sm text-ink-600 dark:text-mist-200/50">No rescue team data available.</p>
        )}
        {teams.map((t, i) => (
          <div key={i} className="rounded-xl border border-ink-900/10 dark:border-mist-100/10 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-ink-900 dark:text-mist-50">{t.team}</p>
                <p className="text-xs text-ink-600 dark:text-mist-200/60">{t.location}</p>
              </div>
              {t.contact && (
                <a href={`tel:${t.contact}`} className="flex items-center gap-1 text-xs font-mono text-signal-500 shrink-0">
                  <FiPhone className="h-3 w-3" /> {t.contact}
                </a>
              )}
            </div>
            {t.vehicles && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-mono text-ink-600 dark:text-mist-200/60">
                <FiTruck className="h-3.5 w-3.5" /> {t.vehicles}
              </p>
            )}
            {t.role && <p className="mt-1.5 text-xs italic text-ink-600 dark:text-mist-200/60">{t.role}</p>}
          </div>
        ))}

        {data.rescue_strategy && (
          <div className="rounded-xl bg-signal-500/8 p-3.5">
            <p className="mb-1 text-xs font-mono uppercase tracking-wide text-signal-500">Strategy</p>
            <p className="text-sm text-ink-700 dark:text-mist-200/80">{data.rescue_strategy}</p>
          </div>
        )}

        {Array.isArray(data.equipment_needed) && data.equipment_needed.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.equipment_needed.map((eq, i) => (
              <span key={i} className="rounded-md bg-signal-500/10 px-2 py-1 text-xs text-signal-500">{eq}</span>
            ))}
          </div>
        )}
      </div>
    </ResultCardShell>
  );
}
