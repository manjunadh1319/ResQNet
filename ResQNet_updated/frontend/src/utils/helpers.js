export const SEVERITY_STYLES = {
  Low: {
    text: "text-[var(--color-low)]",
    bg: "bg-[var(--color-low)]/12",
    ring: "ring-[var(--color-low)]/30",
    dot: "bg-[var(--color-low)]",
  },
  Medium: {
    text: "text-[var(--color-medium)]",
    bg: "bg-[var(--color-medium)]/14",
    ring: "ring-[var(--color-medium)]/30",
    dot: "bg-[var(--color-medium)]",
  },
  High: {
    text: "text-[var(--color-high)]",
    bg: "bg-[var(--color-high)]/14",
    ring: "ring-[var(--color-high)]/30",
    dot: "bg-[var(--color-high)]",
  },
  Critical: {
    text: "text-[var(--color-critical)]",
    bg: "bg-[var(--color-critical)]/14",
    ring: "ring-[var(--color-critical)]/30",
    dot: "bg-[var(--color-critical)]",
  },
};

export function severityStyle(severity) {
  return SEVERITY_STYLES[severity] || SEVERITY_STYLES.Medium;
}

export function formatDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function timeAgo(dateString) {
  const d = new Date(dateString);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const DISASTER_TYPES = [
  "Flood",
  "Earthquake",
  "Cyclone",
  "Fire",
  "Landslide",
  "Building Collapse",
  "Industrial Accident",
  "Drought",
  "Other",
];

export const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];
