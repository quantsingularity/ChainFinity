import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AppProvider, useApp } from "./context/AppContext";

// Unified ChainFinity design tokens. These mirror the mobile app's
// src/theme/theme.ts (same brand gradient #3a36e0 -> #6c63ff, teal accent and
// semantic colours) so the web and mobile products feel like one design.
const getTheme = (mode) => {
  const isLight = mode === "light";
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#6c63ff",
        light: "#8f88ff",
        dark: "#4b44cc",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#03dac6",
        light: "#66fff8",
        dark: "#00a896",
        contrastText: "#04211d",
      },
      success: { main: "#22c55e", contrastText: "#ffffff" },
      warning: { main: "#f59e0b", contrastText: "#1a1a2e" },
      error: { main: "#ef4444", contrastText: "#ffffff" },
      info: { main: "#38bdf8", contrastText: "#04211d" },
      divider: isLight ? "#e4e7f0" : "#2c2c44",
      background: {
        default: isLight ? "#f6f7fb" : "#0f0f17",
        paper: isLight ? "#ffffff" : "#1a1a2e",
      },
      text: isLight
        ? { primary: "#151529", secondary: "#5a5a72" }
        : { primary: "#e8e8f0", secondary: "#a0a0b8" },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.5px" },
      h2: { fontWeight: 800, letterSpacing: "-0.3px" },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: "10px 24px",
            boxShadow: "none",
            "&:hover": { boxShadow: "0px 6px 16px rgba(108, 99, 255, 0.25)" },
          },
          containedPrimary: {
            background: "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)",
            "&:hover": {
              background: "linear-gradient(45deg, #322ec9 0%, #5f57f0 100%)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isLight ? "#e9ecf5" : "#26263f"}`,
            boxShadow: isLight
              ? "0px 6px 24px rgba(20, 21, 41, 0.06)"
              : "0px 8px 28px rgba(0, 0, 0, 0.35)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiTextField: {
        defaultProps: { variant: "outlined" },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": { borderRadius: 12 },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
    },
  });
};

const ThemedApp = () => {
  const { darkMode } = useApp();
  const theme = getTheme(darkMode ? "dark" : "light");

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ThemedApp />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
