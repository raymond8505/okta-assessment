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

  label: string;

  direction?: CarouselDirection;

  /**
   * Root width in px below which `direction` flips to its opposite, tracked
   * live via ResizeObserver. Omit to keep `direction` fixed.
   */
  toggleDirectionBelow?: number;

  mode?: CarouselMode;

  height: string;
}
