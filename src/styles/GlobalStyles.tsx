"use client";

import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "./GlobalStyle";
import { ThemeOverrides } from "./ThemeOverrides";
import { theme } from "./theme";

/**
 * Mounts every global style block, in dependency order:
 *   1. theme.GlobalStyle  — declares the custom properties on :root
 *   2. ThemeOverrides     — redeclares the dark subset
 *   3. GlobalStyle        — consumes them (body, focus ring, reduced motion)
 *
 * THE ThemeProvider IS REQUIRED, AND IT MUST RECEIVE `theme.raw`.
 *
 * `theme.GlobalStyle` reads its values from styled-components' theme context,
 * not from the object it was created with. Rendering it bare throws
 * "Cannot read properties of undefined (reading 'color')". Passing `theme`
 * instead of `theme.raw` renders but emits circular junk —
 * `--sc-color-bg: var(--sc-color-bg, #ffffff)` — because every leaf of `theme`
 * is already a var() reference. Only `theme.raw` holds the literal values.
 *
 * This ThemeProvider exists solely to feed that one component. Application
 * components import `theme` directly and interpolate `var()` strings, so they
 * never read context and never re-render when the theme changes.
 *
 * "use client" is required because createGlobalStyle components cannot be
 * instantiated from a Server Component. They still render during SSR — the
 * directive marks a module boundary, it does not make this browser-only — so
 * the CSS ships in the initial HTML and there is no flash.
 */
export function GlobalStyles() {
  return (
    <ThemeProvider theme={theme.raw}>
      <theme.GlobalStyle />
      <ThemeOverrides />
      <GlobalStyle />
    </ThemeProvider>
  );
}
