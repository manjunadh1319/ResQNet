import { FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import ResultCardShell from "./ResultCardShell";

export default function CommunicationCard({ data }) {
  if (!data) return null;

  return (
    <ResultCardShell icon={FiMessageSquare} title="Communication Report" accent="signal">
      <div className="space-y-4">
        {data.title && (
          <h4 className="font-display text-lg font-bold text-ink-900 dark:text-mist-50">{data.title}</h4>
        )}

        {data.status && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-low/12 px-3 py-1 text-xs font-semibold text-low ring-1 ring-low/30">
            <FiCheckCircle className="h-3.5 w-3.5" /> {data.status}
          </span>
        )}

        {data.public_alert && (
          <div className="rounded-xl bg-critical/8 p-3.5">
            <p className="mb-1 text-xs font-mono uppercase tracking-wide text-critical">Public Alert</p>
            <p className="text-sm text-ink-700 dark:text-mist-200/80">{data.public_alert}</p>
          </div>
        )}

        {data.responder_briefing && (
          <div className="rounded-xl bg-signal-500/8 p-3.5">
            <p className="mb-1 text-xs font-mono uppercase tracking-wide text-signal-500">Responder Briefing</p>
            <p className="text-sm text-ink-700 dark:text-mist-200/80">{data.responder_briefing}</p>
          </div>
        )}

        {Array.isArray(data.next_steps) && data.next_steps.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Next Steps</p>
            <ol className="space-y-1.5">
              {data.next_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-mist-200/80">
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-signal-500/15 text-[10px] font-bold text-signal-500">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </ResultCardShell>
  );
}
