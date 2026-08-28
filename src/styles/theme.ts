import { createTheme } from "styled-components";

/**
 * Design tokens.
 *
 * `createTheme` (styled-components v6.4+) turns every leaf into a CSS custom
 * property reference, so `theme.color.bg` is the *string*
 * `"var(--sc-color-bg, #ffffff)"` rather than a colour value. Three
 * consequences worth knowing:
 *
 *  1. This module is a plain constant — no React context, no ThemeProvider.
 *     It imports freely into Server Components.
 *  2. There is exactly ONE theme object for both light and dark. The CSS
 *     variable switches (see ThemeOverrides); the JS value never does. So
 *     class-name hashes are identical on server and client and a theme change
 *     triggers no React re-render at all.
 *  3. Token values below are only *fallbacks* baked into the var() call. The
 *     real declarations are emitted by `theme.GlobalStyle`.
 *
 * KEY NAMING: hyphens are inserted between path *segments*, not inside a key —
 * `colorPrimary` would emit `--sc-colorPrimary`. Every key here is therefore
 * written kebab-case so the emitted properties stay kebab-case throughout.
 */
export const theme = createTheme(
  {
    color: {
      bg: "#ffffff",
      surface: "#f6f7f9",
      "surface-raised": "#ffffff",
      fg: "#16191d",
      "fg-muted": "#5c636e",
      border: "#dfe3e8",
      accent: "#1662d4",
      "accent-hover": "#0f4ba8",
      "accent-fg": "#ffffff",
      focus: "#1662d4",
    },
    space: {
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.5rem",
      6: "2rem",
      7: "3rem",
      8: "4rem",
    },
    radius: {
      sm: "4px",
      md: "8px",
      lg: "16px",
      full: "9999px",
    },
    font: {
      sans: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    "font-size": {
      100: "0.75rem",
      200: "0.875rem",
      300: "1rem",
      400: "1.125rem",
      500: "1.5rem",
      600: "2rem",
      700: "2.5rem",
    },
    "line-height": {
      tight: "1.2",
      normal: "1.5",
    },
    "container-max": "72rem",
    transition: {
      fast: "120ms ease",
      medium: "200ms ease",
      slow: "400ms ease",
    },
  },
  { prefix: "sc", selector: ":root" },
);
