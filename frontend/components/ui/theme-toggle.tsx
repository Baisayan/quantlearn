"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("quantlearn-theme");
    const isDark = stored ? stored === "dark" : true;
    setTheme(isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("quantlearn-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("quantlearn-theme", "light");
    }
  }

  if (!mounted) {
    return <div className={`size-9 rounded-xl border border-border/80 ${className || ""}`} />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex size-9 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-all duration-200 hover:border-primary/40 hover:bg-muted active:scale-95 ${className || ""}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="size-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="size-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
