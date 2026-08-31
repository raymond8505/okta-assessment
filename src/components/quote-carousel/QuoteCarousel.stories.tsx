import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import quotes from "@/data/quotes.json";
import { QuoteCarouselView } from "./QuoteCarouselView";
import { shuffle } from "../../lib/array";

const meta = {
  title: "components/QuoteCarousel",
  component: QuoteCarouselView,
  parameters: {
    docs: {
      description: {
        component:
          "Deterministic presentational half of `QuoteCarousel`. The real " +
          "`QuoteCarousel` Server Component samples three random quotes from " +
          "`quotes.json` on every page request (via `await connection()`) and " +
          "renders this view; stories pin fixture quotes so visual review is " +
          "stable. Direction/mode variants are documented on the base " +
          "Carousel stories.",
      },
    },
  },
  args: {
    quotes: shuffle(quotes, 3) as [
      (typeof quotes)[0],
      (typeof quotes)[0],
      (typeof quotes)[0],
    ],
    height: "90vh",
  },
} satisfies Meta<typeof QuoteCarouselView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
