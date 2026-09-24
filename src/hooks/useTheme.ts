import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

export interface UseThemeResult {
  mode: ThemeMode;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Universal theme hook that toggles dark/light mode and automatically updates the document root.
 */
export function useTheme(defaultMode: ThemeMode = "dark"): UseThemeResult {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("pradyumn_theme");
      if (stored === "dark" || stored === "light") return stored;
      if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    }
    return defaultMode;
  });

  const applyMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("pradyumn_theme", newMode);
      } catch {
        // Ignore
      }
      const root = document.documentElement;
      if (newMode === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    }
  };

  useEffect(() => {
    applyMode(mode);
  }, []);

  const toggleTheme = () => {
    applyMode(mode === "dark" ? "light" : "dark");
  };

  return {
    mode,
    isDark: mode === "dark",
    isLight: mode === "light",
    toggleTheme,
    setTheme: applyMode,
  };
}
