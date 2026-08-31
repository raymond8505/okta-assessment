import type { AccordionProps } from "../accordion/types";

/** Accordion props minus items, which FAQAccordion supplies from faq.json. */
export type FAQAccordionProps = Omit<AccordionProps, "items">;
