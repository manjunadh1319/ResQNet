import { NavLink } from "react-router-dom";
import { FiSun, FiMoon, FiRadio } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 glass-panel-strong border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-signal-500 to-cyan-400 text-white shadow-lg shadow-signal-500/30">
              <FiRadio className="h-4.5 w-4.5" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-low ring-2 ring-white dark:ring-ink-900" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink-900 dark:text-mist-50">
              ResQ<span className="text-signal-500">Net</span>
            </span>
          </NavLink>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-signal-500/12 text-signal-500"
                      : "text-ink-600 hover:bg-ink-900/5 dark:text-mist-200/70 dark:hover:bg-mist-100/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-900/10 text-ink-600 transition-colors hover:bg-ink-900/5 dark:border-mist-100/10 dark:text-mist-200 dark:hover:bg-mist-100/10"
            >
              {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>
            <NavLink
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-signal-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-signal-500/25 transition-transform hover:scale-[1.02]"
            >
              Report Emergency
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
