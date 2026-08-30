import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import quotes from "@/data/quotes.json";
import { Carousel } from "./Carousel";
import type { CarouselItem, CarouselItems } from "./Carousel";

type Quote = (typeof quotes)[number];

function QuoteCaption({ quote, author }: Pick<Quote, "quote" | "author">) {
  return (
    <blockquote>
      <p>{quote}</p>
      <footer>— {author}</footer>
    </blockquote>
  );
}

function toItem(quote: Quote): CarouselItem {
  return {
    image: quote.image,
    caption: <QuoteCaption quote={quote.quote} author={quote.author} />,
  };
}

const items: CarouselItems = [
  toItem(quotes[0]),
  toItem(quotes[1]),
  toItem(quotes[2]),
];

const meta = {
  title: "components/Carousel",
  component: Carousel,
  args: {
    items,
    label: "Programming quotes",
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Prev/next slides peek in from the left and right of the current slide;
 * the picker dots sit bottom-center and the controls bottom-right, aligned
 * with the current slide's edge.
 */
export const Default: Story = {};

/**
 * The same carousel travelling on the vertical axis: prev/next slides peek
 * in from the top and bottom, and swipes are read from vertical movement.
 */
export const Vertical: Story = {
  args: { direction: "vertical" },
};
