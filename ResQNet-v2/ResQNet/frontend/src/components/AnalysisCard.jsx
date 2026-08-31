import { FiActivity, FiClock } from "react-icons/fi";
import ResultCardShell from "./ResultCardShell";
import { severityStyle } from "../utils/helpers";

export default function AnalysisCard({ data }) {
  if (!data) return null;
  const risk = data.risk_level || "Medium";
  const style = severityStyle(risk);

  return (
    <ResultCardShell icon={FiActivity} title="Disaster Analysis" accent="critical">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {risk} Risk
          </span>
          {data.estimated_response_time_minutes && (
            <span className="inline-flex items-center gap-1 text-xs font-mono text-ink-600 dark:text-mist-200/60">
              <FiClock className="h-3.5 w-3.5" />
              ~{data.estimated_response_time_minutes} min response
            </span>
          )}
        </div>

        {data.summary && (
          <p className="text-sm leading-relaxed text-ink-700 dark:text-mist-200/80">{data.summary}</p>
        )}

        {data.affected_population_estimate && (
          <p className="text-xs font-mono text-ink-600 dark:text-mist-200/60">
            Affected population estimate: <span className="text-ink-900 dark:text-mist-50">{data.affected_population_estimate}</span>
          </p>
        )}

        {Array.isArray(data.key_risks) && data.key_risks.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Key Risks</p>
            <div className="flex flex-wrap gap-1.5">
              {data.key_risks.map((risk, i) => (
                <span key={i} className="rounded-md bg-critical/10 px-2 py-1 text-xs text-critical">{risk}</span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(data.immediate_priorities) && data.immediate_priorities.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Immediate Priorities</p>
            <ul className="space-y-1">
              {data.immediate_priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-mist-200/80">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ResultCardShell>
  );
}
