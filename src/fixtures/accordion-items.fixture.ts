import type { AccordionItem } from "@/components/accordion/Accordion";

export const accordionItemsFixture: AccordionItem[] = [
  { heading: "Section one", content: "Content of section one" },
  { heading: "Section two", content: "Content of section two" },
  { heading: "Section three", content: "Content of section three" },
];

/** FAQ-flavoured items for stories — realistic copy rather than test labels. */
export const accordionFaqFixture: AccordionItem[] = [
  {
    heading: "How is the site rendered?",
    content:
      "Pages are server-rendered React with styled-components. Only the " +
      "interactive islands opt into a client boundary.",
  },
  {
    heading: "How does dark mode work?",
    content:
      "The OS preference is the default and the only durable source. The " +
      "toggle sets a data-theme attribute for the session; pure CSS resolves " +
      "the palette.",
  },
  {
    heading: "Why is the home page dynamic?",
    content:
      "The quote carousel samples three random quotes per request so " +
      "crawlers always receive fully rendered blockquote markup.",
  },
];

/** A single item whose panel holds several sentences, for the LongContent story. */
export const accordionLongContentFixture: AccordionItem[] = [
  accordionFaqFixture[0],
  {
    heading: "What is in the theme object?",
    content:
      "Every leaf of the theme is a var() reference to a CSS custom " +
      "property, not a literal value. There is exactly one theme object for " +
      "both palettes; the CSS variable switches while the JS value never " +
      "does, so class-name hashes are identical on server and client. Token " +
      "keys are written kebab-case because hyphens are only inserted between " +
      "path segments, and a camelCase key would silently break the emitted " +
      "property naming convention. The literal values live on theme.raw, " +
      "which is what ThemeProvider must be fed for GlobalStyle to emit real " +
      "declarations instead of circular variable references.",
  },
  accordionFaqFixture[2],
];
