import { Carousel } from "@/components/carousel/Carousel";
import type { CarouselItem } from "@/components/carousel/Carousel";
import { QuoteCaption } from "./QuoteCaption";
import type { Quote, QuoteCarouselViewProps } from "./types";

export const DEFAULT_LABEL = "Some of our favourite quotes";

function toItem(quote: Quote): CarouselItem {
  return {
    image: quote.image,
    caption: <QuoteCaption quote={quote.quote} author={quote.author} />,
  };
}

/**
 * Presentational half of QuoteCarousel: renders three given quotes as
 * Carousel slides with blockquote captions.
 *
 * @remarks
 * Holds no randomness or request dependency so Storybook and tests can render
 * it deterministically; `QuoteCarousel` supplies the per-request random
 * quotes.
 */
export function QuoteCarouselView({
  quotes,
  label = DEFAULT_LABEL,
  ...carouselProps
}: QuoteCarouselViewProps) {
  const [first, second, third] = quotes;
  return (
    <Carousel
      items={[toItem(first), toItem(second), toItem(third)]}
      label={label}
      {...carouselProps}
    />
  );
}
