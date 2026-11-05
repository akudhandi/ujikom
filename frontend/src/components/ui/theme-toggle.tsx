"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/icon";

const THEME_STORAGE_KEY = "ucn_theme";

type ThemeMode = "light" | "dark";

function applyDocumentTheme(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const attr = document.documentElement.getAttribute("data-theme");
    const initial: ThemeMode =
      stored === "dark" || stored === "light"
        ? stored
        : attr === "dark"
          ? "dark"
          : "light";

    applyDocumentTheme(initial);
    Promise.resolve().then(() => {
      setTheme(initial);
      setMounted(true);
    });
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    applyDocumentTheme(next);
  };

  return (
    <button
      aria-label={theme === "dark" ? "Ubah ke mode terang" : "Ubah ke mode gelap"}
      className="topbar__icon-btn theme-toggle-btn"
      onClick={toggleTheme}
      title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
      type="button"
    >
      <Icon name={mounted && theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
