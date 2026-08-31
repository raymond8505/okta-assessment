import { act, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { carouselItemsFixture } from "@/fixtures/carousel-items.fixture";
import { Carousel } from "./Carousel";
import type { CarouselProps } from "./Carousel";

const LABEL = "Programming quotes";

function renderCarousel(props: Partial<CarouselProps> = {}) {
  return render(
    <Carousel
      items={carouselItemsFixture}
      label={LABEL}
      {...props}
      height="70vh"
    />,
  );
}

// The prev/next previews are aria-hidden, which both excludes them from role
// queries and empties their computed accessible name — so slides are matched
// on the aria-label attribute instead.
function getSlide(n: number) {
  const slide = screen
    .getAllByRole("group", { hidden: true })
    .find((el) => el.getAttribute("aria-label") === `${n} of 3`);
  if (!slide) throw new Error(`Slide "${n} of 3" not found`);
  return slide;
}

describe("Carousel", () => {
  it("renders a region with the given label", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: LABEL });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("renders all three slides with positional labels and slide roledescriptions", () => {
    renderCarousel();
    for (const n of [1, 2, 3]) {
      expect(getSlide(n)).toHaveAttribute("aria-roledescription", "slide");
    }
  });

  it("wraps the slides in a polite, non-atomic live region", () => {
    renderCarousel();
    const region = screen.getByRole("region", { name: LABEL });
    const live = region.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live).toHaveAttribute("aria-atomic", "false");
    expect(live).toContainElement(getSlide(1));
  });

  it("starts on slide 1 with slide 2 next and slide 3 previewed as prev (wrap)", () => {
    renderCarousel();
    expect(getSlide(1)).toHaveClass("Carousel--current");
    expect(getSlide(2)).toHaveClass("Carousel--next");
    expect(getSlide(3)).toHaveClass("Carousel--prev");
  });

  it("renders each slide's image with its src and alt", () => {
    renderCarousel();
    const images = screen.getAllByRole("img", { hidden: true });
    expect(images).toHaveLength(3);
    carouselItemsFixture.forEach((item, index) => {
      expect(images[index]).toHaveAttribute("src", item.image.src);
      expect(images[index]).toHaveAttribute("alt", item.image.alt);
    });
  });

  it("exposes only the current slide's image, alongside its caption", async () => {
    const user = userEvent.setup();
    renderCarousel();

    // Default query excludes the aria-hidden prev/next slides' images.
    const visible = screen.getAllByRole("img");
    expect(visible).toHaveLength(1);
    expect(visible[0]).toHaveAccessibleName(carouselItemsFixture[0].image.alt);
    expect(getSlide(1)).toContainElement(visible[0]);
    expect(getSlide(1)).toHaveTextContent("Caption one");

    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(
      screen.getByRole("img", { name: carouselItemsFixture[1].image.alt }),
    ).toBeInTheDocument();
  });

  it("only exposes the current slide to assistive tech", () => {
    renderCarousel();
    expect(getSlide(1)).not.toHaveAttribute("aria-hidden");
    expect(getSlide(2)).toHaveAttribute("aria-hidden", "true");
    expect(getSlide(3)).toHaveAttribute("aria-hidden", "true");
  });

  it("advances with Next and wraps from the last slide to the first", async () => {
    const user = userEvent.setup();
    renderCarousel();
    const nextButton = screen.getByRole("button", { name: "Next slide" });

    await user.click(nextButton);
    expect(getSlide(2)).toHaveClass("Carousel--current");

    await user.click(nextButton);
    expect(getSlide(3)).toHaveClass("Carousel--current");

    await user.click(nextButton);
    expect(getSlide(1)).toHaveClass("Carousel--current");
  });

  it("goes back with Previous and wraps from the first slide to the last", async () => {
    const user = userEvent.setup();
    renderCarousel();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(getSlide(3)).toHaveClass("Carousel--current");
    expect(getSlide(2)).toHaveClass("Carousel--prev");
  });

  it("renders left/right arrows on the controls", () => {
    renderCarousel();
    expect(
      screen
        .getByRole("button", { name: "Previous slide" })
        .querySelector("svg"),
    ).toHaveAttribute("aria-label", "Arrow point left");
    expect(
      screen.getByRole("button", { name: "Next slide" }).querySelector("svg"),
    ).toHaveAttribute("aria-label", "Arrow point right");
  });

  it("keeps focus on the control after activation", async () => {
    const user = userEvent.setup();
    renderCarousel();
    const nextButton = screen.getByRole("button", { name: "Next slide" });

    await user.click(nextButton);
    expect(nextButton).toHaveFocus();
  });

  it("marks the current slide's dot aria-disabled and navigates on dot click", async () => {
    const user = userEvent.setup();
    renderCarousel();
    const dots = screen.getByRole("group", { name: "Choose slide to display" });
    const dotButtons = [1, 2, 3].map((n) =>
      screen.getByRole("button", { name: `Slide ${n}` }),
    );
    expect(dots).toContainElement(dotButtons[0]);
    expect(dotButtons[0]).toHaveAttribute("aria-disabled", "true");

    await user.click(dotButtons[2]);
    expect(getSlide(3)).toHaveClass("Carousel--current");
    expect(dotButtons[2]).toHaveAttribute("aria-disabled", "true");
    expect(dotButtons[0]).not.toHaveAttribute("aria-disabled");
  });

  describe("swipe", () => {
    it("fires next once per leftward gesture, ignoring further movement", () => {
      renderCarousel();
      const region = screen.getByRole("region", { name: LABEL });

      fireEvent.touchStart(region, {
        touches: [{ clientX: 200, clientY: 100 }],
      });
      fireEvent.touchMove(region, {
        touches: [{ clientX: 140, clientY: 100 }],
      });
      expect(getSlide(2)).toHaveClass("Carousel--current");

      // Same gesture keeps moving — must not fire again.
      fireEvent.touchMove(region, { touches: [{ clientX: 60, clientY: 100 }] });
      expect(getSlide(2)).toHaveClass("Carousel--current");
    });

    it("fires prev on a rightward gesture", () => {
      renderCarousel();
      const region = screen.getByRole("region", { name: LABEL });

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(region, {
        touches: [{ clientX: 160, clientY: 100 }],
      });
      expect(getSlide(3)).toHaveClass("Carousel--current");
    });

    it("ignores movement below the swipe threshold", () => {
      renderCarousel();
      const region = screen.getByRole("region", { name: LABEL });

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 100 }],
      });
      fireEvent.touchMove(region, { touches: [{ clientX: 80, clientY: 100 }] });
      expect(getSlide(1)).toHaveClass("Carousel--current");
    });
  });

  describe("overflow mode", () => {
    it("defaults to inset mode on the region", () => {
      renderCarousel();
      expect(screen.getByRole("region", { name: LABEL })).toHaveAttribute(
        "data-mode",
        "inset",
      );
    });

    it("renders the mode on the region for the CSS geometry switch", () => {
      renderCarousel({ mode: "overflow" });
      expect(screen.getByRole("region", { name: LABEL })).toHaveAttribute(
        "data-mode",
        "overflow",
      );
    });

    it("keeps position classes and navigation behaviour in overflow mode", async () => {
      const user = userEvent.setup();
      renderCarousel({ mode: "overflow" });

      await user.click(screen.getByRole("button", { name: "Next slide" }));
      expect(getSlide(2)).toHaveClass("Carousel--current");
      expect(getSlide(3)).toHaveClass("Carousel--next");
      expect(getSlide(1)).toHaveClass("Carousel--prev");
    });

    it("combines with the vertical direction", () => {
      renderCarousel({ direction: "vertical", mode: "overflow" });
      const region = screen.getByRole("region", { name: LABEL });
      expect(region).toHaveAttribute("data-direction", "vertical");
      expect(region).toHaveAttribute("data-mode", "overflow");
    });
  });

  describe("scene-unit legacy fallback", () => {
    type ResizeObserverCallback = (
      entries: { contentRect: { width: number; height: number } }[],
    ) => void;

    // Fires synchronously on observe() with a fixed box, mirroring the real
    // observer's initial delivery.
    class ResizeObserverStub {
      private readonly callback: ResizeObserverCallback;
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }
      observe() {
        this.callback([{ contentRect: { width: 512, height: 384 } }]);
      }
      disconnect() {}
    }

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("feeds the measured width as a px scene unit when container queries are unsupported", () => {
      vi.stubGlobal("CSS", { supports: () => false });
      vi.stubGlobal("ResizeObserver", ResizeObserverStub);
      renderCarousel();
      const region = screen.getByRole("region", { name: LABEL });
      expect(region.style.getPropertyValue("--scene-unit")).toBe(
        "calc(var(--current-slide-fraction) * 512px / 100)",
      );
    });

    it("measures the height instead on the vertical axis", () => {
      vi.stubGlobal("CSS", { supports: () => false });
      vi.stubGlobal("ResizeObserver", ResizeObserverStub);
      renderCarousel({ direction: "vertical" });
      const region = screen.getByRole("region", { name: LABEL });
      expect(region.style.getPropertyValue("--scene-unit")).toBe(
        "calc(var(--current-slide-fraction) * 384px / 100)",
      );
    });

    it("leaves the stylesheet untouched when container queries are supported", () => {
      vi.stubGlobal("CSS", { supports: () => true });
      vi.stubGlobal("ResizeObserver", ResizeObserverStub);
      renderCarousel();
      const region = screen.getByRole("region", { name: LABEL });
      expect(region.style.getPropertyValue("--scene-unit")).toBe("");
    });
  });

  describe("vertical direction", () => {
    it("renders the direction on the region for the CSS axis switch", () => {
      renderCarousel({ direction: "vertical" });
      expect(screen.getByRole("region", { name: LABEL })).toHaveAttribute(
        "data-direction",
        "vertical",
      );
    });

    it("renders up/down arrows on the controls", () => {
      renderCarousel({ direction: "vertical" });
      expect(
        screen
          .getByRole("button", { name: "Previous slide" })
          .querySelector("svg"),
      ).toHaveAttribute("aria-label", "Arrow point up");
      expect(
        screen.getByRole("button", { name: "Next slide" }).querySelector("svg"),
      ).toHaveAttribute("aria-label", "Arrow point down");
    });

    it("responds to vertical swipes and ignores horizontal ones", () => {
      renderCarousel({ direction: "vertical" });
      const region = screen.getByRole("region", { name: LABEL });

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 200 }],
      });
      fireEvent.touchMove(region, { touches: [{ clientX: 20, clientY: 200 }] });
      expect(getSlide(1)).toHaveClass("Carousel--current");

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 200 }],
      });
      fireEvent.touchMove(region, {
        touches: [{ clientX: 100, clientY: 140 }],
      });
      expect(getSlide(2)).toHaveClass("Carousel--current");
    });
  });

  describe("toggleDirectionBelow", () => {
    type ResizeObserverCallback = (
      entries: { contentRect: { width: number; height: number } }[],
    ) => void;

    let fireResize: (width: number) => void;
    let observerCount = 0;

    // Fires synchronously on observe() like the real observer's initial
    // delivery; fireResize replays every observer with a new width.
    function stubResizeObserver(initialWidth: number) {
      let width = initialWidth;
      const callbacks = new Set<ResizeObserverCallback>();
      fireResize = (nextWidth) => {
        width = nextWidth;
        act(() => {
          for (const callback of callbacks) {
            callback([{ contentRect: { width, height: 384 } }]);
          }
        });
      };
      class ResizeObserverStub {
        private readonly callback: ResizeObserverCallback;
        constructor(callback: ResizeObserverCallback) {
          observerCount += 1;
          this.callback = callback;
          callbacks.add(callback);
        }
        observe() {
          this.callback([{ contentRect: { width, height: 384 } }]);
        }
        disconnect() {}
      }
      vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    }

    beforeEach(() => {
      observerCount = 0;
      // Container queries "supported" keeps the scene-unit fallback observer
      // inert, so only the direction observer is constructed.
      vi.stubGlobal("CSS", { supports: () => true });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("flips a horizontal carousel vertical below the threshold", () => {
      stubResizeObserver(320);
      renderCarousel({ toggleDirectionBelow: 390 });
      const region = screen.getByRole("region", { name: LABEL });
      expect(region).toHaveAttribute("data-direction", "vertical");
      expect(
        screen
          .getByRole("button", { name: "Previous slide" })
          .querySelector("svg"),
      ).toHaveAttribute("aria-label", "Arrow point up");
    });

    it("keeps the passed direction at the threshold — below is strict", () => {
      stubResizeObserver(390);
      renderCarousel({ toggleDirectionBelow: 390 });
      expect(screen.getByRole("region", { name: LABEL })).toHaveAttribute(
        "data-direction",
        "horizontal",
      );
    });

    it("switches the swipe axis along with the direction", () => {
      stubResizeObserver(320);
      renderCarousel({ toggleDirectionBelow: 390 });
      const region = screen.getByRole("region", { name: LABEL });

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 200 }],
      });
      fireEvent.touchMove(region, { touches: [{ clientX: 20, clientY: 200 }] });
      expect(getSlide(1)).toHaveClass("Carousel--current");

      fireEvent.touchStart(region, {
        touches: [{ clientX: 100, clientY: 200 }],
      });
      fireEvent.touchMove(region, {
        touches: [{ clientX: 100, clientY: 140 }],
      });
      expect(getSlide(2)).toHaveClass("Carousel--current");
    });

    it("follows resizes across the threshold in both directions", () => {
      stubResizeObserver(512);
      renderCarousel({ toggleDirectionBelow: 390 });
      const region = screen.getByRole("region", { name: LABEL });
      expect(region).toHaveAttribute("data-direction", "horizontal");

      fireResize(320);
      expect(region).toHaveAttribute("data-direction", "vertical");

      fireResize(512);
      expect(region).toHaveAttribute("data-direction", "horizontal");
    });

    it("flips a vertical carousel horizontal below the threshold", () => {
      stubResizeObserver(320);
      renderCarousel({ direction: "vertical", toggleDirectionBelow: 390 });
      expect(screen.getByRole("region", { name: LABEL })).toHaveAttribute(
        "data-direction",
        "horizontal",
      );
    });

    it("observes nothing when the prop is omitted", () => {
      stubResizeObserver(320);
      renderCarousel();
      expect(observerCount).toBe(0);
    });
  });
});
