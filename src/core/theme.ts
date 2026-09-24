/**
 * Unified Design Tokens & Theme Engine for Pradyumn.js.
 */

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryGlow: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  danger: string;
  dangerBg: string;
  info: string;
  infoBg: string;
}

export interface ThemeTokens {
  mode: "dark" | "light";
  colors: ThemeColors;
  radii: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    glow: string;
  };
  typography: {
    fontFamily: string;
    monoFamily: string;
  };
}

export const defaultDarkTheme: ThemeTokens = {
  mode: "dark",
  colors: {
    primary: "#ff3366",
    primaryHover: "#ff1a53",
    primaryGlow: "rgba(255, 51, 102, 0.35)",
    secondary: "#ff9933",
    background: "#090d16",
    surface: "rgba(17, 24, 39, 0.75)",
    surfaceHover: "rgba(30, 41, 59, 0.8)",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    textSubtle: "#64748b",
    success: "#10b981",
    successBg: "rgba(16, 185, 129, 0.12)",
    warning: "#f59e0b",
    warningBg: "rgba(245, 158, 11, 0.12)",
    danger: "#ef4444",
    dangerBg: "rgba(239, 68, 68, 0.12)",
    info: "#38bdf8",
    infoBg: "rgba(56, 189, 248, 0.12)",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.3)",
    md: "0 4px 12px rgba(0,0,0,0.4)",
    lg: "0 12px 32px rgba(0,0,0,0.5)",
    glow: "0 0 20px rgba(255, 51, 102, 0.35)",
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
  },
};

export const defaultLightTheme: ThemeTokens = {
  mode: "light",
  colors: {
    primary: "#e11d48",
    primaryHover: "#be123c",
    primaryGlow: "rgba(225, 29, 72, 0.25)",
    secondary: "#f97316",
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceHover: "#f1f5f9",
    border: "rgba(0, 0, 0, 0.08)",
    text: "#0f172a",
    textMuted: "#475569",
    textSubtle: "#94a3b8",
    success: "#059669",
    successBg: "rgba(5, 150, 105, 0.1)",
    warning: "#d97706",
    warningBg: "rgba(217, 119, 6, 0.1)",
    danger: "#dc2626",
    dangerBg: "rgba(220, 38, 38, 0.1)",
    info: "#0284c7",
    infoBg: "rgba(2, 132, 199, 0.1)",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.05)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 12px 32px rgba(0,0,0,0.12)",
    glow: "0 0 20px rgba(225, 29, 72, 0.25)",
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    monoFamily: "'JetBrains Mono', monospace",
  },
};

/**
 * Creates custom theme tokens by overriding defaults.
 */
export function createPradyumnTheme(overrides: Partial<ThemeTokens>): ThemeTokens {
  const base = overrides.mode === "light" ? defaultLightTheme : defaultDarkTheme;
  return {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...(overrides.colors || {}) },
    radii: { ...base.radii, ...(overrides.radii || {}) },
    shadows: { ...base.shadows, ...(overrides.shadows || {}) },
    typography: { ...base.typography, ...(overrides.typography || {}) },
  };
}
