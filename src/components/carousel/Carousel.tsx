"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import {
  CarouselCaption,
  CarouselControl,
  CarouselControls,
  CarouselDot,
  CarouselDots,
  CarouselDotVisual,
  CarouselImage,
  CarouselRoot,
  CarouselSlide,
  CarouselSlides,
  CarouselViewport,
} from "./Carousel.styles";
import type { CarouselProps } from "./types";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "../icons/Arrow";

export type {
  CarouselDirection,
  CarouselItem,
  CarouselItems,
  CarouselMode,
  CarouselProps,
} from "./types";

const SLIDE_COUNT = 3;
const SWIPE_THRESHOLD_PX = 48;

/** Offset of a slide index from currentSlide (mod 3) → its stage position. */
const POSITIONS = ["current", "next", "prev"] as const;
type SlidePosition = (typeof POSITIONS)[number];

export function Carousel({
  items,
  label,
  direction = "horizontal",
  mode = "inset",
  height,
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  /**
   * graceful degredation for browsers that don't support container queries
   * set scene unit with js on resize
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    if (typeof CSS !== "undefined" && CSS.supports("container-type", "size")) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      const size =
        direction === "vertical"
          ? entry.contentRect.height
          : entry.contentRect.width;
      root.style.setProperty(
        "--scene-unit",
        `calc(var(--current-slide-fraction) * ${size}px / 100)`,
      );
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--scene-unit");
    };
  }, [direction]);

  const goTo = (index: number) =>
    setCurrentSlide(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  const next = () => goTo(currentSlide + 1);
  const prev = () => goTo(currentSlide - 1);

  const handleTouchStart = (event: ReactTouchEvent) => {
    const touch = event.touches[0];
    touchOrigin.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (event: ReactTouchEvent) => {
    // A null origin means this gesture already fired; touchstart re-arms it.
    if (!touchOrigin.current) return;
    const touch = event.touches[0];
    const delta =
      direction === "vertical"
        ? touch.clientY - touchOrigin.current.y
        : touch.clientX - touchOrigin.current.x;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) {
      next();
    } else {
      prev();
    }
    touchOrigin.current = null;
  };

  return (
    <CarouselRoot
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label={label}
      data-direction={direction}
      data-mode={mode}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      $height={height}
    >
      <CarouselViewport>
        <CarouselSlides aria-live="polite" aria-atomic="false">
          {items.map((item, index) => {
            const position: SlidePosition =
              POSITIONS[(index - currentSlide + SLIDE_COUNT) % SLIDE_COUNT];
            return (
              <CarouselSlide
                key={index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${SLIDE_COUNT}`}
                // Preview slivers are decorative, so only the current slide is
                // exposed — the live region then announces exactly one slide.
                aria-hidden={position !== "current" || undefined}
                className={`Carousel--${position}`}
              >
                <CarouselImage src={item.image.src} alt={item.image.alt} />
                <CarouselCaption>{item.caption}</CarouselCaption>
              </CarouselSlide>
            );
          })}
        </CarouselSlides>
        <CarouselDots role="group" aria-label="Choose slide to display">
          {items.map((_, index) => (
            <CarouselDot
              key={index}
              type="button"
              aria-label={`Slide ${index + 1}`}
              // aria-disabled (not disabled) keeps the current dot focusable,
              // per the APG grouped slide-picker variant.
              aria-disabled={index === currentSlide || undefined}
              onClick={() => goTo(index)}
            >
              <CarouselDotVisual />
            </CarouselDot>
          ))}
        </CarouselDots>
        <CarouselControls>
          <CarouselControl
            type="button"
            aria-label="Previous slide"
            onClick={prev}
          >
            {direction === "vertical" ? (
              <ArrowUpIcon aria-hidden />
            ) : (
              <ArrowLeftIcon aria-hidden />
            )}
          </CarouselControl>
          <CarouselControl type="button" aria-label="Next slide" onClick={next}>
            {direction === "vertical" ? (
              <ArrowDownIcon aria-hidden />
            ) : (
              <ArrowRightIcon aria-hidden />
            )}
          </CarouselControl>
        </CarouselControls>
      </CarouselViewport>
    </CarouselRoot>
  );
}
