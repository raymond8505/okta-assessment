import { render, screen } from "@testing-library/react";
import { connection } from "next/server";
import { describe, expect, it, vi } from "vitest";
import quotes from "@/data/quotes.json";
import { quotesFixture } from "@/fixtures/quotes.fixture";
import { sample } from "@/lib/sample";
import { DEFAULT_LABEL } from "./QuoteCarouselView";
import { QuoteCarousel } from "./QuoteCarousel";

vi.mock("next/server", () => ({
  connection: vi.fn(() => Promise.resolve()),
}));

// Factories are hoisted above imports, so the fixture is loaded lazily.
vi.mock("@/lib/sample", async () => {
  const { quotesFixture } = await import("@/fixtures/quotes.fixture");
  return { sample: vi.fn(() => [...quotesFixture]) };
});

describe("QuoteCarousel", () => {
  it("waits for a request before sampling, so quotes vary per request", async () => {
    render(await QuoteCarousel({ height: "70vh" }));
    expect(connection).toHaveBeenCalled();
  });

  it("samples three quotes from the full pool", async () => {
    render(await QuoteCarousel({ height: "70vh" }));
    expect(sample).toHaveBeenCalledWith(quotes, 3);
  });

  it("renders the sampled quotes in a carousel with the default label", async () => {
    render(await QuoteCarousel({ height: "70vh" }));
    expect(
      screen.getByRole("region", { name: DEFAULT_LABEL }),
    ).toBeInTheDocument();
    for (const { quote } of quotesFixture) {
      expect(screen.getByText(quote)).toBeInTheDocument();
    }
  });

  it("forwards props to the view", async () => {
    render(await QuoteCarousel({ height: "70vh", label: "Wise words" }));
    expect(
      screen.getByRole("region", { name: "Wise words" }),
    ).toBeInTheDocument();
  });
});
