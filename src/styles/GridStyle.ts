"use client";

import { createGlobalStyle } from "styled-components";

import type { Align, Justify } from "@/components/grid/types";

import { breakpoints, GRID_COLUMNS } from "./breakpoints";
import { theme } from "./theme";

/**
 * Formerly grid.css, kept static because its rules never changed at runtime.
 * That tradeoff no longer applies now that styles are moving inline for CWV,
 * and folding it in here lets the column/gap/align/justify blocks be looped
 * from GRID_COLUMNS/theme.space instead of hand-copied, and lets breakpoints
 * be imported directly instead of duplicated (a static .css file couldn't
 * import breakpoints.ts, which is why the values used to be retyped there).
 */

const GAP_SCALE = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const alignItems: Record<Align, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyContent: Record<Justify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

const gapRules = GAP_SCALE.map(
  (n) => `
  .row.gap-${n} {
    --row-gap: ${theme.space[n]};
  }`,
).join("");

const alignRules = Object.entries(alignItems)
  .map(
    ([key, value]) => `
  .row.align-${key} {
    align-items: ${value};
  }`,
  )
  .join("");

const justifyRules = Object.entries(justifyContent)
  .map(
    ([key, value]) => `
  .row.justify-${key} {
    justify-content: ${value};
  }`,
  )
  .join("");

/** One pixel above `md`, computed rather than re-hardcoded, so it can't drift from breakpoints.ts. */
const lgMin = `${parseInt(breakpoints.md, 10) + 1}px`;

const columnSpanRules = (bp: "sm" | "md" | "lg") =>
  Array.from({ length: GRID_COLUMNS }, (_, i) => i + 1)
    .map(
      (n) => `
    .col.${bp}-${n} {
      flex: 0 0 auto;
      width: calc(${n} / ${GRID_COLUMNS} * (100% + var(--row-gap)) - var(--row-gap));
    }`,
    )
    .join("");

const columnBreakpointBlocks = [
  { condition: `(max-width: ${breakpoints.sm})`, rules: columnSpanRules("sm") },
  { condition: `(max-width: ${breakpoints.md})`, rules: columnSpanRules("md") },
  { condition: `(min-width: ${lgMin})`, rules: columnSpanRules("lg") },
]
  .map(
    ({ condition, rules }) => `
  @media ${condition} {${rules}
  }`,
  )
  .join("");

export const GridStyle = createGlobalStyle`
  .container {
    width: 100%;
    max-width: ${theme.container.max};
    margin-inline: auto;
    padding-inline: ${theme.space[4]};
  }

  .container.fluid {
    max-width: none;
  }

  .row {
    --row-gap: ${theme.space[4]};

    display: flex;
    flex-wrap: wrap;
    gap: var(--row-gap);
  }

  .row.nowrap {
    flex-wrap: nowrap;
  }
  .row.column {
    flex-direction: column;
  }
  ${gapRules}
  ${alignRules}
  ${justifyRules}

  .col {
    flex: 1 1 0;
    min-width: 0;
  }
  ${columnBreakpointBlocks}
`;
