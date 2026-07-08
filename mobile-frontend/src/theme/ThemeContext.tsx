import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { getTheme, Theme, ThemeMode } from "./theme";

const THEME_KEY = "chainfinity.theme";

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  // Default to dark to match the app's original look; the stored preference
  // (if any) overrides this once loaded.
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (!active) return;
      if (stored === "light" || stored === "dark") {
        setModeState(stored);
      } else if (systemScheme === "light" || systemScheme === "dark") {
        setModeState(systemScheme);
      }
    });
    return () => {
      active = false;
    };
  }, [systemScheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      AsyncStorage.setItem(THEME_KEY, next).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getTheme(mode),
      mode,
      isDark: mode === "dark",
      toggleTheme,
      setMode,
    }),
    [mode, toggleTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback so components remain usable even if a provider is missing
    // (e.g. in isolated unit tests).
    return {
      theme: getTheme("dark"),
      mode: "dark",
      isDark: true,
      toggleTheme: () => undefined,
      setMode: () => undefined,
    };
  }
  return ctx;
};

export default ThemeContext;
