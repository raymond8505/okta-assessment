import type { ReactNode } from "react";

export type AccordionItem = {
  /** Rendered inside the header trigger button. */
  heading: ReactNode;
  /** Panel content. Stays in the DOM when collapsed. */
  content: ReactNode;
  /** Stable id base for the trigger/panel pair; defaults to a useId-derived value. */
  id?: string;
};

export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface AccordionProps {
  items: AccordionItem[];
  /**
   * Level of the heading element wrapping each trigger. Purely semantic —
   * pick it to fit the surrounding document outline.
   * @default 3
   */
  headingLevel?: AccordionHeadingLevel;
  /** Index of the panel expanded on first render; omit to start fully collapsed. */
  defaultExpandedIndex?: number;
}
