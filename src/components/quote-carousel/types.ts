import type quotesData from "@/data/quotes.json";
import type {
  CarouselDirection,
  CarouselMode,
} from "@/components/carousel/types";

/** One entry of src/data/quotes.json — derived so the type cannot drift. */
export type Quote = (typeof quotesData)[number];

export interface QuoteCarouselProps {
  /** Forwarded to Carousel as its CSS height (e.g. `"90vh"`). */
  height: string;
  /**
   * Accessible name of the carousel region.
   * @defaultValue "Some of our favourite quotes"
   */
  label?: string;
  direction?: CarouselDirection;
  mode?: CarouselMode;
}

export interface QuoteCarouselViewProps extends QuoteCarouselProps {
  /** The three quotes to render, in slide order. */
  quotes: Quote[];
}
