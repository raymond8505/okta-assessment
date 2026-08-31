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
 * Renders three given quotes as Carousel slides with blockquote captions.
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
