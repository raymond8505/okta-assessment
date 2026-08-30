import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { UnstyledButton } from "../primitives/buttons";

export const CarouselRoot = styled.section<{ $height: string }>`
  --current-slide-fraction: 0.8542;
  --current-slide-size: calc(var(--current-slide-fraction) * 100%);
  --current-slide-inset: calc((100% - var(--current-slide-size)) / 2);

  --preview-shift: 10.29%;
  --preview-scale: 0.62;

  --scene-unit: calc(
    var(--current-slide-fraction) * min(100vw, ${theme.container.max}) / 100
  );
  --scene-perspective: calc(var(--scene-unit) * 102);
  --scene-depth: calc(var(--scene-unit) * 5.5);

  @supports (container-type: size) {
    --scene-unit: calc(var(--current-slide-fraction) * 1cqw);
  }

  width: 100%;
  height: ${(props) => props.$height};

  /*
   * Reserve the travel axis for the swipe handler. React's touch listeners are
   * passive (preventDefault is a no-op), so this is the only way to stop the
   * browser scrolling the page on the same gesture; the cross axis still pans.
   */
  touch-action: pan-y pinch-zoom;

  &[data-direction="vertical"] {
    touch-action: pan-x pinch-zoom;
    --current-slide-fraction: 0.8;
    --preview-shift: 18%;

    --scene-unit: calc(var(--current-slide-fraction) * 628px / 100);
    --scene-perspective: calc(var(--scene-unit) * 199);
    --scene-depth: calc(var(--scene-unit) * 10.75);

    @supports (container-type: size) {
      --scene-unit: calc(var(--current-slide-fraction) * 1cqh);
    }
  }

  /*
   * so overflow wins on both axes regardless of source order.
   * Stylis cannot parse a tag-qualified &, so the class is doubled instead.
   */
  &&[data-mode="overflow"] {
    --current-slide-fraction: 1;
  }
`;

export const CarouselViewport = styled.div`
  position: relative;

  width: 100%;
  height: 100%;

  container-type: size;
`;

export const CarouselSlides = styled.div`
  position: absolute;
  inset: 0;
  perspective: var(--scene-perspective);
`;

export const CarouselSlide = styled.div`
  position: absolute;
  inset: 0 var(--current-slide-inset);
  overflow: hidden;
  transition: transform ${theme.transition.slow};
  border-radius: ${theme.radius.lg};

  &.Carousel--current {
    border-radius: ${theme.radius.xl};
    transform: translate3d(0, 0, 0);
    z-index: 2;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  &.Carousel--next {
    transition: transform ${theme.transition.medium};
    transform: translateX(var(--preview-shift)) translateZ(var(--scene-depth))
      scale(var(--preview-scale)) rotateY(-32deg);
    z-index: 1;
  }

  &.Carousel--prev {
    transition: transform ${theme.transition.medium};
    transform: translateX(calc(-1 * var(--preview-shift)))
      translateZ(var(--scene-depth)) scale(var(--preview-scale)) rotateY(32deg);
    z-index: 1;
  }

  [data-direction="vertical"] & {
    inset: var(--current-slide-inset) 0;
  }

  [data-direction="vertical"] &.Carousel--next {
    transform: translateY(var(--preview-shift)) translateZ(var(--scene-depth))
      scale(var(--preview-scale)) rotateX(32deg);
  }

  [data-direction="vertical"] &.Carousel--prev {
    transform: translateY(calc(-1 * var(--preview-shift)))
      translateZ(var(--scene-depth)) scale(var(--preview-scale)) rotateX(-32deg);
  }
`;

export const CarouselImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

export const CarouselCaption = styled.div`
  position: absolute;
  z-index: 1;
  left: ${theme.space[6]};
  top: ${theme.space[6]};
  max-width: 80%;
  border-radius: ${theme.radius.lg};
  color: ${theme.color.fg};
  padding: 0;
  background: ${theme.carousel.caption.bg};
  backdrop-filter: blur(50px);
`;

export const CarouselControls = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  gap: ${theme.space[2]};
  /* Offset by the slide inset so the controls hug the current slide's
     corner — which is the viewport corner in overflow mode (inset 0). */

  bottom: ${theme.space[6]};
  right: calc(var(--current-slide-inset) + ${theme.space[6]});

  [data-direction="vertical"] & {
    bottom: calc(var(--current-slide-inset) + ${theme.space[6]});
    right: ${theme.space[6]};
  }
`;

export const CarouselControl = styled(UnstyledButton)`
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

export const CarouselDots = styled.div`
  position: absolute;
  z-index: 3;
  display: flex;
  gap: ${theme.space[2]};
  left: 50%;
  transform: translateX(-50%);

  bottom: ${theme.space[6]};

  [data-direction="vertical"] & {
    bottom: calc(var(--current-slide-inset) + ${theme.space[6]});
  }
`;

/*
 * The pill is a visual cue only — the button is the tap target and must meet
 * WCAG 2.5.8's 24px minimum, upgraded to 44px where the pointer is a finger.
 */
export const CarouselDot = styled(UnstyledButton)`
  display: grid;
  place-items: center;
  min-width: 24px;
  min-height: 24px;

  @media (pointer: coarse) {
    min-width: 44px;
    min-height: 44px;
  }

  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
  }
`;

export const CarouselDotVisual = styled.span`
  width: ${theme.carousel.dot.width};
  height: ${theme.carousel.dot.height};
  border-radius: ${theme.radius.full};
  background: ${theme.carousel.dot.bg};

  [aria-disabled="true"] > & {
    background: ${theme.carousel.dot.activeBg};
  }
`;
