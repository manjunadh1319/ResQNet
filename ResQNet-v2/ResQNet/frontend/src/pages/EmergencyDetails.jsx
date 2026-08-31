import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiUsers, FiPhone, FiTrash2 } from "react-icons/fi";
import LoadingSpinner from "../components/LoadingSpinner";
import AnalysisCard from "../components/AnalysisCard";
import HospitalCard from "../components/HospitalCard";
import RescueCard from "../components/RescueCard";
import ReliefCard from "../components/ReliefCard";
import CommunicationCard from "../components/CommunicationCard";
import { emergencyApi } from "../services/api";
import { severityStyle, formatDate } from "../utils/helpers";

export default function EmergencyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    emergencyApi
      .getById(id)
      .then((data) => active && setEmergency(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this emergency report? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await emergencyApi.remove(id);
      navigate("/history");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <LoadingSpinner label="Loading report…" />
      </div>
    );
  }

  if (error || !emergency) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="text-sm text-critical">{error || "Emergency not found."}</p>
        <Link to="/history" className="mt-4 inline-flex items-center gap-1.5 text-sm text-signal-500">
          <FiArrowLeft className="h-4 w-4" /> Back to History
        </Link>
      </div>
    );
  }

  const style = severityStyle(emergency.severity);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/history" className="inline-flex items-center gap-1.5 text-sm text-ink-600 hover:text-signal-500 dark:text-mist-200/60 transition-colors">
        <FiArrowLeft className="h-4 w-4" /> Back to History
      </Link>

      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style.bg} ${style.text} ${style.ring}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {emergency.severity} Severity
            </span>
            <h1 className="mt-3 font-display text-2xl font-bold text-ink-900 dark:text-mist-50">
              {emergency.disaster_type} — {emergency.location}
            </h1>
            <p className="mt-1 text-xs font-mono text-ink-600 dark:text-mist-200/50">
              Reported {formatDate(emergency.created_at)} · ID: {emergency.id}
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-lg border border-critical/30 px-3 py-2 text-xs font-semibold text-critical hover:bg-critical/10 transition-colors disabled:opacity-50"
          >
            <FiTrash2 className="h-3.5 w-3.5" /> {deleting ? "Deleting…" : "Delete Report"}
          </button>
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-4 border-t border-ink-900/10 dark:border-mist-100/10 pt-5">
          <div className="flex items-center gap-2 text-sm">
            <FiMapPin className="h-4 w-4 text-ink-600 dark:text-mist-200/50" />
            <span className="text-ink-700 dark:text-mist-200/80">{emergency.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiUsers className="h-4 w-4 text-ink-600 dark:text-mist-200/50" />
            <span className="text-ink-700 dark:text-mist-200/80">{emergency.victims} victims reported</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FiPhone className="h-4 w-4 text-ink-600 dark:text-mist-200/50" />
            <a href={`tel:${emergency.contact}`} className="text-signal-500">{emergency.contact}</a>
          </div>
        </div>

        {emergency.description && (
          <p className="mt-4 text-sm text-ink-700 dark:text-mist-200/80 border-t border-ink-900/10 dark:border-mist-100/10 pt-4">
            {emergency.description}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AnalysisCard data={emergency.disaster_analysis} />
        <HospitalCard data={emergency.hospital} />
        <RescueCard data={emergency.rescue_team} />
        <ReliefCard data={emergency.relief_resources} />
      </div>
      <CommunicationCard data={emergency.communication_report} />
    </div>
  );
}
