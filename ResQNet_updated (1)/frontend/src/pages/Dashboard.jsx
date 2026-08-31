import { useEffect, useState, useCallback } from "react";
import {
  FiAlertOctagon,
  FiActivity,
  FiHeart,
  FiShield,
  FiCalendar,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

import EmergencyForm from "../components/EmergencyForm";
import StatisticsCard from "../components/StatisticsCard";
import AnalysisCard from "../components/AnalysisCard";
import HospitalCard from "../components/HospitalCard";
import RescueCard from "../components/RescueCard";
import ReliefCard from "../components/ReliefCard";
import CommunicationCard from "../components/CommunicationCard";
import LoadingSpinner from "../components/LoadingSpinner";
import DisasterMap from "../components/DisasterMap";
import { useTheme } from "../context/ThemeContext";
import { emergencyApi } from "../services/api";

const SEVERITY_COLORS = {
  Low: "#22c55e",
  Medium: "#f5b93d",
  High: "#fb7a3c",
  Critical: "#ff4757",
};
const CHART_COLORS = ["#2f6fed", "#22d3ee", "#f5b93d", "#fb7a3c", "#ff4757", "#22c55e"];

function useChartTooltipStyle() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    contentStyle: {
      background: isDark ? "#111a2e" : "#ffffff",
      border: `1px solid ${isDark ? "rgba(139,180,255,0.25)" : "rgba(47,111,237,0.2)"}`,
      borderRadius: "10px",
      color: isDark ? "#e9eff9" : "#0b1220",
      fontSize: "12px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
    },
    labelStyle: { color: isDark ? "#e9eff9" : "#0b1220", fontWeight: 600, marginBottom: 4 },
    itemStyle: { color: isDark ? "#cdd9ee" : "#172441" },
    cursor: { fill: isDark ? "rgba(139,180,255,0.06)" : "rgba(47,111,237,0.06)" },
  };
}

export default function Dashboard() {
  const tooltipStyle = useChartTooltipStyle();
  const [stats, setStats] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const [s, m] = await Promise.all([emergencyApi.getStats(), emergencyApi.getMapData()]);
      setStats(s);
      setMapData(m);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    setError(null);
    setResult(null);
    try {
      const data = await emergencyApi.create(payload);
      setResult(data);
      loadStats();
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const pieData = stats
    ? Object.entries(stats.by_severity).map(([name, value]) => ({ name, value }))
    : [];
  const barData = stats
    ? Object.entries(stats.by_type).map(([name, value]) => ({ name, value }))
    : [];
  const lineData = stats?.timeline || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-panel-strong p-8 sm:p-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-signal-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-low/12 px-3 py-1 text-xs font-mono font-semibold text-low ring-1 ring-low/30 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-low animate-pulse" />
            System Online — 6 AI Agents Standing By
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 dark:text-mist-50 max-w-2xl">
            Coordinate disaster response in minutes, not hours.
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-ink-600 dark:text-mist-200/70">
            Report an emergency and ResQNet's multi-agent AI pipeline instantly analyzes risk,
            matches hospitals, deploys rescue teams, allocates relief resources, and drafts the
            communication plan.
          </p>
        </div>
      </div>

      {/* Stats */}
      {loadingStats ? (
        <LoadingSpinner label="Loading statistics…" />
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatisticsCard icon={FiAlertOctagon} label="Total Emergencies" value={stats.total_emergencies} accent="signal" />
          <StatisticsCard icon={FiActivity} label="High Priority" value={stats.high_priority} accent="critical" />
          <StatisticsCard icon={FiHeart} label="Hospitals" value={stats.total_hospitals} accent="low" />
          <StatisticsCard icon={FiShield} label="Rescue Teams" value={stats.total_rescue_teams} accent="signal" />
          <StatisticsCard icon={FiCalendar} label="Today's Reports" value={stats.today_reports} accent="medium" />
        </div>
      ) : null}

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <EmergencyForm onSubmit={handleSubmit} submitting={submitting} />
          {error && (
            <div className="mt-4 rounded-xl bg-critical/10 border border-critical/30 p-4 text-sm text-critical">
              {error}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="mb-3 font-display text-sm font-bold text-ink-900 dark:text-mist-50">
                Emergencies by Severity
              </h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={SEVERITY_COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-16 text-center text-xs text-ink-600 dark:text-mist-200/40">No data yet</p>
              )}
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <h3 className="mb-3 font-display text-sm font-bold text-ink-900 dark:text-mist-50">
                Emergencies by Type
              </h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" fill="#2f6fed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-16 text-center text-xs text-ink-600 dark:text-mist-200/40">No data yet</p>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-ink-900 dark:text-mist-50">
              Reports — Last 7 Days
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip {...tooltipStyle} labelFormatter={(d) => d} />
                <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel rounded-2xl p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-ink-900 dark:text-mist-50">
              Live Situation Map
            </h3>
            <DisasterMap data={mapData} />
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div id="results-section" className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-signal-500/30 to-transparent" />
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-mist-50 shrink-0">
              AI Response Plan
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-signal-500/30 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <AnalysisCard data={result.disaster_analysis} />
            <HospitalCard data={result.hospital} />
            <RescueCard data={result.rescue_team} />
            <ReliefCard data={result.relief_resources} />
          </div>
          <CommunicationCard data={result.communication_report} />
        </div>
      )}
    </div>
  );
}
