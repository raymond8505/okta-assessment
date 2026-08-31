import { Quote } from "@/components/quote-carousel/types";
import quotes from "@/data/quotes.json";

/** Three fixed quotes for deterministic QuoteCarousel tests and stories. */
export const quotesFixture: Quote[] = [quotes[3], quotes[0], quotes[2]];
