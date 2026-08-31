import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { quotesFixture } from "@/fixtures/quotes.fixture";
import { QuoteCarouselView } from "./QuoteCarouselView";

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
    quotes: quotesFixture,
    height: "90vh",
  },
} satisfies Meta<typeof QuoteCarouselView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
