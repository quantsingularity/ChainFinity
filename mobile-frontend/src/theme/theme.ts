// Unified ChainFinity design tokens, shared in spirit with the web frontend.
// The same brand gradient (#3a36e0 -> #6c63ff), teal accent, spacing scale,
// radii and typography are used on both platforms so the two apps look and
// feel like one product.

export type ThemeMode = "light" | "dark";

// Brand colours are constant across light and dark modes.
export const brand = {
  primary: "#6c63ff",
  primaryLight: "#8f88ff",
  primaryDark: "#4b44cc",
  gradientStart: "#3a36e0",
  gradientEnd: "#6c63ff",
  secondary: "#03dac6",
  secondaryDark: "#00a896",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#38bdf8",
  onPrimary: "#ffffff",
};

export interface ThemePalette {
  mode: ThemeMode;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  gradientStart: string;
  gradientEnd: string;
  secondary: string;
  secondaryDark: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  onPrimary: string;
  background: string;
  surface: string;
  surfaceLight: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  divider: string;
  border: string;
  overlay: string;
}

const darkPalette: ThemePalette = {
  ...brand,
  mode: "dark",
  background: "#0f0f17",
  surface: "#1a1a2e",
  surfaceLight: "#23233a",
  surfaceAlt: "#20203a",
  textPrimary: "#e8e8f0",
  textSecondary: "#a0a0b8",
  textMuted: "#6f6f88",
  divider: "#2c2c44",
  border: "#2c2c44",
  overlay: "rgba(0,0,0,0.6)",
};

const lightPalette: ThemePalette = {
  ...brand,
  mode: "light",
  background: "#f6f7fb",
  surface: "#ffffff",
  surfaceLight: "#eef1f8",
  surfaceAlt: "#f0f2fa",
  textPrimary: "#151529",
  textSecondary: "#5a5a72",
  textMuted: "#8a8aa0",
  divider: "#e4e7f0",
  border: "#e4e7f0",
  overlay: "rgba(15,15,23,0.35)",
};

// 4pt spacing scale.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  display: { fontSize: 34, fontWeight: "800" as const, letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.3 },
  h2: { fontSize: 22, fontWeight: "700" as const },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  overline: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6 },
};

export interface Theme {
  mode: ThemeMode;
  colors: ThemePalette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export const lightTheme: Theme = {
  mode: "light",
  colors: lightPalette,
  spacing,
  radius,
  typography,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: darkPalette,
  spacing,
  radius,
  typography,
};

export const getTheme = (mode: ThemeMode): Theme =>
  mode === "light" ? lightTheme : darkTheme;
