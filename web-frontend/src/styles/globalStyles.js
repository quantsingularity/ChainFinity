// Global style constants and helpers
// The primary theme is defined in src/index.js via getTheme()
// This file provides shared design tokens and CSS-in-JS helpers

export const GRADIENT_PRIMARY =
  "linear-gradient(45deg, #3a36e0 0%, #6c63ff 100%)";
export const GRADIENT_HERO_LIGHT =
  "linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%)";
export const GRADIENT_HERO_DARK =
  "linear-gradient(135deg, #121212 0%, #1e1e2d 100%)";

export const glassMorphism = (mode) => ({
  backgroundColor:
    mode === "light" ? "rgba(255,255,255,0.7)" : "rgba(26,26,46,0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
});

export const cardHoverEffect = {
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  "&:hover": {
    transform: "translateY(-6px)",
  },
};
