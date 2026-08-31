/**
 * Breakpoints are the ONE token family that cannot be a CSS custom property:
 * `@media (min-width: var(--x))` is invalid CSS — custom properties are not
 * allowed in media query conditions. So these live in TS and are duplicated
 * literally in grid.css. Keep the two in sync by hand; there is no way around
 * it short of a build step.
 */
export const breakpoints = {
  sm: "390px",
  md: "900px",
  lg: "1600px",
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** Mobile-first order — narrowest first, so later entries override earlier. */
export const breakpointOrder = ["sm", "md", "lg"] as const;

/** Number of columns in the grid. Span props are validated against this. */
export const GRID_COLUMNS = 12;
