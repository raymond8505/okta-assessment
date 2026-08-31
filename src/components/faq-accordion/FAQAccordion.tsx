import faq from "@/data/faq.json";
import { Accordion } from "../accordion/Accordion";
import type { AccordionItem } from "../accordion/Accordion";
import type { FAQAccordionProps } from "./types";

export type { FAQAccordionProps } from "./types";

function toItem(entry: (typeof faq)[number]): AccordionItem {
  return { id: entry.id, heading: entry.question, content: entry.answer };
}

/**
 * Accordion of the site FAQ from `src/data/faq.json`.
 *
 * Unlike QuoteCarousel this stays a synchronous Server Component — the data
 * is static, so no dynamic API is invoked and consuming routes keep their
 * static rendering. Entry ids seed the Accordion's deterministic element ids.
 */
export function FAQAccordion(props: FAQAccordionProps) {
  return <Accordion items={faq.map(toItem)} {...props} />;
}
