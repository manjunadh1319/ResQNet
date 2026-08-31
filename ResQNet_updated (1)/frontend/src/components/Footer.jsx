import { FiRadio, FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-900/10 dark:border-mist-100/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FiRadio className="h-4 w-4 text-signal-500" />
            <span className="font-display text-sm font-semibold text-ink-900 dark:text-mist-50">
              ResQNet
            </span>
            <span className="text-xs text-ink-600 dark:text-mist-200/60 font-mono">
              — AI Disaster Response System
            </span>
          </div>
          <p className="text-xs text-ink-600 dark:text-mist-200/50 font-mono text-center">
            Built for rapid, coordinated emergency response · B.Tech Final Year Project
            <br className="sm:hidden" />
            <span className="sm:before:content-['·'] sm:before:mx-2">
              Made by <span className="text-signal-500 font-semibold">Manjunadh</span>
            </span>
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-ink-600 hover:text-signal-500 dark:text-mist-200/60 dark:hover:text-signal-400 transition-colors"
          >
            <FiGithub className="h-3.5 w-3.5" />
            Source
          </a>
        </div>
      </div>
    </footer>
  );
}
