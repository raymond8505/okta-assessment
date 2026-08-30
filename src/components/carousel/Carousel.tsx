"use client";

import { useRef, useState } from "react";
import type { ReactNode, TouchEvent as ReactTouchEvent } from "react";
import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { UnstyledButton } from "../primitives/buttons";

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
}

const SLIDE_COUNT = 3;
const SWIPE_THRESHOLD_PX = 48;

/** Offset of a slide index from currentSlide (mod 3) → its stage position. */
const POSITIONS = ["current", "next", "prev"] as const;
type SlidePosition = (typeof POSITIONS)[number];

const CarouselRoot = styled.section`
  /*
   * Geometry knobs. Each direction × mode combination only overrides these
   * values; the transform declarations on CarouselSlide are shared.
   * --preview-shift translates along the travel axis, so % resolves against
   * the slide's own width (horizontal) or height (vertical) — which is why
   * the two directions keep separate values.
   */
  --current-slide-size: 85.42%;
  --current-slide-inset: calc((100% - var(--current-slide-size)) / 2);
  --preview-shift: var(--current-slide-inset);

  width: 100%;
  height: 628px;

  &[data-direction="vertical"] {
    --current-slide-size: 80%;
    --preview-shift: 18%;
  }

  /*
   * && outranks the direction block (0,3,0 vs 0,2,0) so overflow wins on both
   * axes regardless of source order. Stylis cannot parse a tag-qualified &,
   * so the class is doubled instead.
   */
  &&[data-mode="overflow"] {
    --current-slide-size: 100%;
    /*
     * scale(0.7) about center pulls each slide edge in by 15%, so an 85%
     * shift puts the scaled inner edge at the container edge before the 3D
     * projection nudges it. Tune visually in Storybook (~78–88% band).
     */
    --preview-shift: 85%;
  }
`;

const CarouselViewport = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  /* Overflow mode's whole point: previews escape the container. Clipping is
     the consumer's job (overflow-x/y: clip on an ancestor). */
  [data-mode="overflow"] & {
    overflow: visible;
  }
`;

const CarouselSlides = styled.div`
  position: absolute;
  inset: 0;
  /* Gives the slides' translate3d z-component visible depth. */
  perspective: 1000px;
`;

/*
 * The current slide sits inset by --current-slide-inset on the travel axis;
 * prev/next are the same box shifted by ±--preview-shift, shrunk and rotated,
 * so their projected slivers fill whatever space the mode leaves them —
 * inside the viewport margins (inset mode) or beyond it (overflow mode).
 */
const CarouselSlide = styled.div`
  position: absolute;
  inset: 0 var(--current-slide-inset);
  overflow: hidden;
  transition: transform ${theme.transition.slow};
  border-radius: ${theme.radius.lg};

  &.Carousel--current {
    border-radius: ${theme.radius.xl};
    transform: translate3d(0, 0, 0);
    z-index: 2;
  }

  &.Carousel--next {
    transition: transform ${theme.transition.medium};
    transform: translateX(var(--preview-shift)) translateZ(54px) scale(0.7)
      rotateY(-32deg);
    z-index: 1;
  }

  &.Carousel--prev {
    transition: transform ${theme.transition.medium};
    transform: translateX(calc(-1 * var(--preview-shift))) translateZ(54px)
      scale(0.7) rotateY(32deg);
    z-index: 1;
  }

  [data-direction="vertical"] & {
    inset: var(--current-slide-inset) 0;
  }

  [data-direction="vertical"] &.Carousel--next {
    transform: translateY(var(--preview-shift)) translateZ(54px) scale(0.7)
      rotateX(32deg);
  }

  [data-direction="vertical"] &.Carousel--prev {
    transform: translateY(calc(-1 * var(--preview-shift))) translateZ(54px)
      scale(0.7) rotateX(-32deg);
  }
`;

const CarouselImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const CarouselCaption = styled.div`
  position: absolute;
  z-index: 1;
  left: ${theme.space[6]};
  top: ${theme.space[6]};
  max-width: 80%;
  border-radius: ${theme.radius.lg};
  color: ${theme.color.fg};
  padding: 0;
  background: ${theme.color.carousel.caption.bg};
  backdrop-filter: blur(50px);
`;

const CarouselControls = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  gap: ${theme.space[2]};
  /* Offset by the slide inset so the controls hug the current slide's
     corner — which is the viewport corner in overflow mode (inset 0). */
  bottom: ${theme.space[3]};
  right: calc(var(--current-slide-inset) + ${theme.space[3]});

  [data-direction="vertical"] & {
    bottom: calc(var(--current-slide-inset) + ${theme.space[3]});
    right: ${theme.space[3]};
  }
`;

const CarouselControl = styled(UnstyledButton)`
  display: grid;
  place-items: center;
  width: ${theme.space[6]};
  height: ${theme.space[6]};
  border-radius: ${theme.radius.full};
  background: ${theme.color["surface-raised"]};
  color: ${theme.color.fg};

  /* UnstyledButton's all:unset removes the default focus ring. */
  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  gap: ${theme.space[2]};
  left: 50%;
  transform: translateX(-50%);
  bottom: ${theme.space[2]};

  [data-direction="vertical"] & {
    bottom: calc(var(--current-slide-inset) + ${theme.space[2]});
  }
`;

const CarouselDot = styled(UnstyledButton)`
  width: ${theme.space[3]};
  height: ${theme.space[3]};
  border-radius: ${theme.radius.full};
  background: ${theme.color.border};

  &[aria-disabled="true"] {
    background: ${theme.color.accent};
  }

  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
  }
`;

export function Carousel({
  items,
  label,
  direction = "horizontal",
  mode = "inset",
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchOrigin = useRef<{ x: number; y: number } | null>(null);

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
      aria-roledescription="carousel"
      aria-label={label}
      data-direction={direction}
      data-mode={mode}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
            />
          ))}
        </CarouselDots>
        <CarouselControls>
          <CarouselControl
            type="button"
            aria-label="Previous slide"
            onClick={prev}
          >
            ‹
          </CarouselControl>
          <CarouselControl type="button" aria-label="Next slide" onClick={next}>
            ›
          </CarouselControl>
        </CarouselControls>
      </CarouselViewport>
    </CarouselRoot>
  );
}
