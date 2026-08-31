"use client";

import { useId, useState } from "react";
import {
  AccordionHeading,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from "./Accordion.styles";
import type { AccordionProps } from "./types";
import { PlusMinusIcon } from "../icons/PlusMinus";

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
          <div key={itemId}>
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
                <PlusMinusIcon aria-hidden />
              </AccordionTrigger>
            </AccordionHeading>
            <AccordionPanel
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={expanded ? undefined : true}
            >
              {item.content}
            </AccordionPanel>
          </div>
        );
      })}
    </AccordionRoot>
  );
}
