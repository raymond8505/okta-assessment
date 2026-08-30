"use client";

import { createGlobalStyle, css } from "styled-components";

import { theme } from "./theme";

const { vars } = theme;

/**
 * Dark palette, written through `theme.vars` so custom property names are never
 * hand-typed and can't drift from theme.ts.
 */
const darkPalette = css`
  color-scheme: dark;
  ${vars.color.bg}: #1E1E1E;
  ${vars.color.surface}: #181c22;
  ${vars.color["surface-raised"]}: #20252c;
  ${vars.color.fg}: #eef1f5;
  ${vars.color["fg-muted"]}: #a3acba;
  ${vars.color.border}: #2b313a;
  ${vars.color.accent}: #6ea8fe;
  ${vars.color["accent-hover"]}: #93c0ff;
  ${vars.color["accent-fg"]}: #0b1220;
  ${vars.color.focus}: #6ea8fe;
  ${vars["row-background"]}: linear-gradient(75.01deg, ${theme.color.bg} -65.58%, #181c22 29.37%, #20252c 217.98%);
  ${vars.carousel.caption.bg}: #191919;
`;

/**
 * Theme resolution, in pure CSS. No JS runs to pick the initial theme, so the
 * correct palette is live on first paint and survives JS being disabled.
 *
 * Order and selector shape are both load-bearing:
 *
 *   `:root:not([data-theme="light"])` has specificity (0,2,0). A bare
 *   `[data-theme="dark"]` would be (0,1,0) and LOSE to it, leaving an explicit
 *   dark choice broken on a light-preference machine. Writing the override as
 *   `:root[data-theme="dark"]` matches at (0,2,0), so the later rule wins.
 *   Keep it after the media block and keep the `:root` prefix.
 *
 * `color-scheme` is declared on both branches so native scrollbars, form
 * controls and overscroll background follow the theme.
 *
 * Nothing here reads or writes storage — the OS preference is the default and
 * the only persistent source. ThemeToggle sets `data-theme` for the current
 * page only; a reload drops it and the OS wins again.
 */
export const ThemeOverrides = createGlobalStyle`
  :root { color-scheme: light; }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { ${darkPalette} }
  }

  :root[data-theme="dark"] { ${darkPalette} }
`;
