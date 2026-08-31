"use client";

import { useId, useState } from "react";
import {
  AccordionHeading,
  AccordionItem,
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
          <AccordionItem key={itemId}>
            <AccordionHeading as={`h${headingLevel}`}>
              <AccordionTrigger
                type="button"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
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
          </AccordionItem>
        );
      })}
    </AccordionRoot>
  );
}
