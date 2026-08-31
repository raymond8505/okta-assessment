import { QuoteBlockquote } from "./QuoteCarousel.styles";
import type { Quote } from "./types";

/** A quote and its attribution, rendered as a carousel slide's caption. */
export function QuoteCaption({
  quote,
  author,
}: Pick<Quote, "quote" | "author">) {
  return (
    <QuoteBlockquote>
      <p>{quote}</p>
      <footer>— {author}</footer>
    </QuoteBlockquote>
  );
}
