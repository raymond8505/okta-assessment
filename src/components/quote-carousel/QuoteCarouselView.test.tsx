import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { quotesFixture } from "@/fixtures/quotes.fixture";
import { DEFAULT_LABEL, QuoteCarouselView } from "./QuoteCarouselView";

describe("QuoteCarouselView", () => {
  it("renders a carousel region with the default label", () => {
    render(<QuoteCarouselView quotes={quotesFixture} height="70vh" />);
    const region = screen.getByRole("region", { name: DEFAULT_LABEL });
    expect(region).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("forwards a custom label to the carousel region", () => {
    render(
      <QuoteCarouselView
        quotes={quotesFixture}
        height="70vh"
        label="Wise words"
      />,
    );
    expect(screen.getByRole("region", { name: "Wise words" })).toBeVisible();
  });

  it("renders each quote as a blockquote caption with its attribution", () => {
    render(<QuoteCarouselView quotes={quotesFixture} height="70vh" />);
    for (const { quote, author } of quotesFixture) {
      const text = screen.getByText(quote);
      expect(text.closest("blockquote")).not.toBeNull();
      expect(screen.getByText(`— ${author}`)).toBeInTheDocument();
    }
  });

  it("renders each quote's image with its alt text", () => {
    render(<QuoteCarouselView quotes={quotesFixture} height="70vh" />);
    const images = screen.getAllByRole("img", { hidden: true });
    expect(images).toHaveLength(3);
    quotesFixture.forEach(({ image }, index) => {
      expect(images[index]).toHaveAttribute("src", image.src);
      expect(images[index]).toHaveAttribute("alt", image.alt);
    });
  });
});
