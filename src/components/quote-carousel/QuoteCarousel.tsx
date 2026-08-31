import { connection } from "next/server";
import quotes from "@/data/quotes.json";
import { shuffle } from "@/lib/array";
import { QuoteCarouselView } from "./QuoteCarouselView";
import type { QuoteCarouselProps } from "./types";

export type { QuoteCarouselProps } from "./types";

/**
 * Carousel of three quotes drawn at random from `src/data/quotes.json` on
 * every page request.
 */
export async function QuoteCarousel(props: QuoteCarouselProps) {
  await connection();
  const picks = shuffle(quotes, 3);
  return <QuoteCarouselView quotes={picks} {...props} />;
}
