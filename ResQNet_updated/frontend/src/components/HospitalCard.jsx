import { FiHeart, FiPhone } from "react-icons/fi";
import ResultCardShell from "./ResultCardShell";

export default function HospitalCard({ data }) {
  if (!data) return null;
  const hospitals = data.recommended_hospitals || [];

  return (
    <ResultCardShell icon={FiHeart} title="Hospital Recommendation" accent="low">
      <div className="space-y-3">
        {hospitals.length === 0 && (
          <p className="text-sm text-ink-600 dark:text-mist-200/50">No hospital data available.</p>
        )}
        {hospitals.map((h, i) => (
          <div key={i} className="rounded-xl border border-ink-900/10 dark:border-mist-100/10 p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-ink-900 dark:text-mist-50">{h.hospital}</p>
                <p className="text-xs text-ink-600 dark:text-mist-200/60">{h.location}</p>
              </div>
              {h.contact && (
                <a href={`tel:${h.contact}`} className="flex items-center gap-1 text-xs font-mono text-signal-500 shrink-0">
                  <FiPhone className="h-3 w-3" /> {h.contact}
                </a>
              )}
            </div>
            <div className="mt-2 flex gap-4 text-xs font-mono text-ink-600 dark:text-mist-200/60">
              {h.beds !== undefined && <span>Beds: <b className="text-ink-900 dark:text-mist-50">{h.beds}</b></span>}
              {h.icu !== undefined && <span>ICU: <b className="text-ink-900 dark:text-mist-50">{h.icu}</b></span>}
            </div>
            {h.reason && <p className="mt-1.5 text-xs italic text-ink-600 dark:text-mist-200/60">{h.reason}</p>}
          </div>
        ))}
        {data.notes && (
          <p className="text-xs text-ink-600 dark:text-mist-200/60 pt-1 border-t border-ink-900/10 dark:border-mist-100/10">{data.notes}</p>
        )}
      </div>
    </ResultCardShell>
  );
}
