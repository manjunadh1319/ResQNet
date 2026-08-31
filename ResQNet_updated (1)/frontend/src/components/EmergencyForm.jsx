import { useState } from "react";
import { FiAlertTriangle, FiMapPin, FiUsers, FiPhone, FiFileText, FiSend } from "react-icons/fi";
import { DISASTER_TYPES, SEVERITY_LEVELS } from "../utils/helpers";

const initialForm = {
  disaster_type: "",
  location: "",
  victims: "",
  severity: "",
  description: "",
  contact: "",
};

export default function EmergencyForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.disaster_type) e.disaster_type = "Select a disaster type";
    if (!form.location || form.location.trim().length < 2) e.location = "Enter a valid location";
    if (form.victims === "" || Number(form.victims) < 0) e.victims = "Enter number of victims (0 or more)";
    if (!form.severity) e.severity = "Select a severity level";
    if (!form.contact || form.contact.trim().length < 5) e.contact = "Enter a valid contact number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, victims: Number(form.victims) });
  }

  const inputBase =
    "w-full rounded-xl border bg-white/60 dark:bg-ink-900/40 px-4 py-2.5 text-sm text-ink-900 dark:text-mist-50 placeholder:text-ink-600/40 dark:placeholder:text-mist-200/30 outline-none transition-colors focus:border-signal-500";

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <FiAlertTriangle className="h-5 w-5 text-critical" />
        <h2 className="font-display text-xl font-bold text-ink-900 dark:text-mist-50">
          Report an Emergency
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            Disaster Type
          </label>
          <select
            value={form.disaster_type}
            onChange={(e) => handleChange("disaster_type", e.target.value)}
            className={`${inputBase} ${errors.disaster_type ? "border-critical" : "border-ink-900/10 dark:border-mist-100/10"}`}
          >
            <option value="">Select type…</option>
            {DISASTER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.disaster_type && <p className="mt-1 text-xs text-critical">{errors.disaster_type}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            Severity
          </label>
          <select
            value={form.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
            className={`${inputBase} ${errors.severity ? "border-critical" : "border-ink-900/10 dark:border-mist-100/10"}`}
          >
            <option value="">Select severity…</option>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.severity && <p className="mt-1 text-xs text-critical">{errors.severity}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            <FiMapPin className="h-3.5 w-3.5" /> Location
          </label>
          <input
            type="text"
            placeholder="e.g. Vijayawada"
            value={form.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={`${inputBase} ${errors.location ? "border-critical" : "border-ink-900/10 dark:border-mist-100/10"}`}
          />
          {errors.location && <p className="mt-1 text-xs text-critical">{errors.location}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            <FiUsers className="h-3.5 w-3.5" /> Estimated Victims
          </label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 250"
            value={form.victims}
            onChange={(e) => handleChange("victims", e.target.value)}
            className={`${inputBase} ${errors.victims ? "border-critical" : "border-ink-900/10 dark:border-mist-100/10"}`}
          />
          {errors.victims && <p className="mt-1 text-xs text-critical">{errors.victims}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            <FiPhone className="h-3.5 w-3.5" /> Emergency Contact
          </label>
          <input
            type="text"
            placeholder="+91-9876543210"
            value={form.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
            className={`${inputBase} ${errors.contact ? "border-critical" : "border-ink-900/10 dark:border-mist-100/10"}`}
          />
          {errors.contact && <p className="mt-1 text-xs text-critical">{errors.contact}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-ink-600 dark:text-mist-200/60">
            <FiFileText className="h-3.5 w-3.5" /> Description (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Any additional details responders should know…"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`${inputBase} resize-none border-ink-900/10 dark:border-mist-100/10`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-signal-500 to-cyan-400 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-signal-500/30 transition-transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {submitting ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            Dispatching AI Response Agents…
          </>
        ) : (
          <>
            <FiSend className="h-4 w-4" />
            Submit Emergency Report
          </>
        )}
      </button>
    </form>
  );
}
