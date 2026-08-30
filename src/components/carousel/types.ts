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

  mode?: CarouselMode;

  height: string;
}
