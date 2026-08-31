import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import { emergencyApi } from "../services/api";
import { severityStyle, formatDate, SEVERITY_LEVELS } from "../utils/helpers";

const PAGE_SIZE = 8;

export default function History() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await emergencyApi.getHistory(0, 500);
      setEmergencies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this emergency report? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await emergencyApi.remove(id);
      setEmergencies((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(() => {
    return emergencies.filter((e) => {
      const matchesSearch =
        !search ||
        e.disaster_type.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = severityFilter === "All" || e.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [emergencies, search, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, severityFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-mist-50">Emergency History</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-mist-200/60">
          Browse, search, and manage all previously reported emergencies.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-600/50 dark:text-mist-200/40" />
          <input
            type="text"
            placeholder="Search by disaster type or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl glass-panel border-0 pl-10 pr-4 py-2.5 text-sm text-ink-900 dark:text-mist-50 placeholder:text-ink-600/40 dark:placeholder:text-mist-200/30 outline-none focus:ring-2 focus:ring-signal-500/40"
          />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-xl glass-panel border-0 px-4 py-2.5 text-sm text-ink-900 dark:text-mist-50 outline-none focus:ring-2 focus:ring-signal-500/40"
        >
          <option value="All">All Severities</option>
          {SEVERITY_LEVELS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl bg-critical/10 border border-critical/30 p-4 text-sm text-critical">{error}</div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading history…" />
      ) : paginated.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center">
          <FiInbox className="mx-auto h-8 w-8 text-ink-600/40 dark:text-mist-200/30" />
          <p className="mt-3 text-sm text-ink-600 dark:text-mist-200/50">
            {emergencies.length === 0 ? "No emergencies reported yet." : "No results match your search."}
          </p>
        </div>
      ) : (
        <>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 dark:border-mist-100/10 text-left">
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Type</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Location</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Severity</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Victims</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50">Reported</th>
                  <th className="px-5 py-3 font-mono text-xs uppercase tracking-wide text-ink-600 dark:text-mist-200/50 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((e) => {
                  const style = severityStyle(e.severity);
                  return (
                    <tr key={e.id} className="border-b border-ink-900/5 dark:border-mist-100/5 last:border-0 hover:bg-signal-500/[0.03] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-ink-900 dark:text-mist-50">{e.disaster_type}</td>
                      <td className="px-5 py-3.5 text-ink-700 dark:text-mist-200/70">{e.location}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {e.severity}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-ink-700 dark:text-mist-200/70">{e.victims}</td>
                      <td className="px-5 py-3.5 text-xs text-ink-600 dark:text-mist-200/50">{formatDate(e.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/emergency/${e.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-signal-500 hover:bg-signal-500/10 transition-colors"
                            aria-label="View details"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(e.id)}
                            disabled={deletingId === e.id}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-critical hover:bg-critical/10 transition-colors disabled:opacity-50"
                            aria-label="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-ink-600 dark:text-mist-200/50 font-mono">
                Page {page} of {totalPages} · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass-panel disabled:opacity-40"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass-panel disabled:opacity-40"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
