import quotes from "@/data/quotes.json";
import type { QuoteTriple } from "@/components/quote-carousel/types";

/** Three fixed quotes for deterministic QuoteCarousel tests and stories. */
export const quotesFixture: QuoteTriple = [quotes[3], quotes[0], quotes[2]];
