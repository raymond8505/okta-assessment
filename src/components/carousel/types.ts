import type { ReactNode } from "react";

export type CarouselItem = {
  image: { src: string; alt: string };
  caption: ReactNode;
};

/** The carousel holds exactly three slides — enforced at the type level. */
export type CarouselItems = [CarouselItem, CarouselItem, CarouselItem];

export type CarouselDirection = "horizontal" | "vertical";

export type CarouselMode = "inset" | "overflow";

export interface CarouselProps {
  items: CarouselItems;
  /**
   * Accessible name for the carousel region.
   */
  label: string;
  /** Axis on which the prev/next slides are previewed. */
  direction?: CarouselDirection;
  /**
   * "inset" (default): the current slide is ~85% of the container with the
   * previews peeking inside its edges. "overflow": the current slide spans the
   * full container and the previews stick out beyond it — the consumer must
   * clip on an ancestor (overflow-x/y: clip) or the previews widen the page.
   */
  mode?: CarouselMode;

  height: string;
}
