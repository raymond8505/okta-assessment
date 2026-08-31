"use client";

import { useId, useState } from "react";
import {
  AccordionHeading,
  AccordionItemRoot,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "./Accordion.styles";
import type { AccordionProps } from "./types";

export type {
  AccordionHeadingLevel,
  AccordionItem,
  AccordionProps,
} from "./types";

/**
 * Single-expand accordion per the W3C APG pattern.
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Keyboard support is the APG-required set only — Enter/Space via the native
 * button and document Tab order. Arrow/Home/End header navigation is an APG
 * *optional* behaviour deliberately left out of this scaffold.
 */
export function Accordion({
  items,
  headingLevel = 3,
  defaultExpandedIndex,
}: AccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    defaultExpandedIndex ?? null,
  );
  const baseId = useId();

  return (
    <AccordionRoot>
      {items.map((item, index) => {
        const expanded = index === expandedIndex;
        const itemId = item.id ?? `${baseId}-${index}`;
        const triggerId = `${itemId}-trigger`;
        const panelId = `${itemId}-panel`;
        return (
          <AccordionItemRoot key={itemId}>
            {/* The trigger must be the heading's only child, per the APG. */}
            <AccordionHeading as={`h${headingLevel}`}>
              <AccordionTrigger
                type="button"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                // Replacing the single index collapses the previous panel;
                // re-clicking the open trigger collapses to none.
                onClick={() => setExpandedIndex(expanded ? null : index)}
              >
                {item.heading}
              </AccordionTrigger>
            </AccordionHeading>
            {/* hidden (not conditional render) keeps collapsed content in the
                SSR payload for crawlers while removing it from the a11y tree
                and tab order. hidden="until-found" would also allow
                find-in-page into collapsed panels, but needs a beforematch
                listener to sync aria-expanded — future enhancement. */}
            <AccordionPanel
              id={panelId}
              // At most one panel is ever perceivable under single-expand, so
              // region landmarks cannot proliferate (the APG's caveat for
              // accordions with >~6 simultaneously open panels).
              role="region"
              aria-labelledby={triggerId}
              hidden={!expanded}
            >
              {item.content}
            </AccordionPanel>
          </AccordionItemRoot>
        );
      })}
    </AccordionRoot>
  );
}
