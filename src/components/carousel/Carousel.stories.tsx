import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import quotes from "@/data/quotes.json";
import { Carousel } from "./Carousel";
import type { CarouselItem, CarouselItems } from "./Carousel";

type Quote = (typeof quotes)[number];

function QuoteCaption({ quote, author }: Pick<Quote, "quote" | "author">) {
  return (
    <blockquote style={{ padding: "16px" }}>
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
  toItem(quotes[3]),
  toItem(quotes[0]),

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

/**
 * The 3D scene derives its perspective and depth from the slide's container
 * size, so a narrow carousel shows the same projected preview geometry as
 * Default, just smaller — not a flatter or more distorted one.
 */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "420px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Overflow mode: the current slide spans the full container width and the
 * prev/next previews stick out beyond its edges. The component deliberately
 * does not clip itself — the consumer must put `overflow-x: clip` on an
 * ancestor (as the outer decorator wrapper does) or the previews widen the
 * page. The inner wrapper is narrower than the canvas so the overhang stays
 * visible.
 */
export const Overflow: Story = {
  args: { mode: "overflow" },
  decorators: [
    (Story) => (
      <div style={{ overflowX: "clip" }}>
        <div style={{ maxWidth: "70%", marginInline: "auto" }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

/**
 * Vertical travel combined with overflow mode: previews escape above and
 * below the carousel, so the consumer must leave vertical breathing room —
 * or clip, as the decorator does — to keep them off adjacent page content.
 */
export const VerticalOverflow: Story = {
  args: { direction: "vertical", mode: "overflow" },
  decorators: [
    (Story) => (
      <div style={{ overflowY: "clip", paddingBlock: "160px" }}>
        <Story />
      </div>
    ),
  ],
};
