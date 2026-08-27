import type { Breakpoint } from "@/styles/breakpoints";

/** A column span, 1–12. Matches GRID_COLUMNS in breakpoints.ts. */
export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Row gap, indexing the `space` token scale (--sc-space-1 … --sc-space-8). */
export type GapScale = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Align = "start" | "center" | "end" | "stretch" | "baseline";
export type Justify = "start" | "center" | "end" | "between" | "around";

/** Span props keyed by breakpoint — `$sm={12}` becomes the class `sm-12`. */
export type SpanProps = Partial<Record<`$${Breakpoint}`, ColSpan>>;
