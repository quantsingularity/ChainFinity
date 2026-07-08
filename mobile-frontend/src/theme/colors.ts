// Backward-compatible export. The canonical design tokens now live in
// theme.ts (light + dark). This module keeps the original dark palette so
// existing imports (`import { colors } from "../theme/colors"`) keep working.
import { darkTheme } from "./theme";

export const colors = darkTheme.colors;

export default colors;
