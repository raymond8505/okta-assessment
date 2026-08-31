import { connection } from "next/server";
import quotes from "@/data/quotes.json";
import { sample } from "@/lib/sample";
import { QuoteCarouselView } from "./QuoteCarouselView";
import type { QuoteCarouselProps } from "./types";

export type { QuoteCarouselProps } from "./types";

/**
 * Carousel of three quotes drawn at random from `src/data/quotes.json` on
 * every page request.
 *
 * @remarks
 * `await connection()` opts any route rendering this component into dynamic
 * rendering; without it a static route would sample once at build and serve
 * the same three quotes until the next deploy. The blockquote markup is
 * server-rendered into the response, so the quotes are crawlable without
 * JavaScript.
 */
export async function QuoteCarousel(props: QuoteCarouselProps) {
  await connection();
  const [first, second, third] = sample(quotes, 3);
  return <QuoteCarouselView quotes={[first, second, third]} {...props} />;
}
