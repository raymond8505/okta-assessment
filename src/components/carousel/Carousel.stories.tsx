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
    height: "90vh",
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const lightItem = toItem(quotes[105]);

export const LightSlide: Story = {
  args: {
    items: [lightItem, items[1], items[2]],
  },
};

const darkItem = toItem(quotes[72]);

export const DarkSlide: Story = {
  args: {
    items: [darkItem, items[1], items[2]],
  },
};

export const Vertical: Story = {
  args: { direction: "vertical" },
};

/**
 * Resize the canvas to see the toggle: while the carousel root is narrower
 * than 390px the direction flips to vertical (arrows and swipe axis included),
 * and back to horizontal above it.
 */
export const ResponsiveDirection: Story = {
  args: { toggleDirectionBelow: 390 },
};

const verboseItem = { ...items[0] };
verboseItem.caption = (
  <div style={{ padding: "16px", fontSize: "1.2em" }}>
    {`One trick is to tell stories that don't go anywhere. Like the time I caught
    the ferry to Shelbyville? I needed a new heel for m'shoe. So I decided to go
    to Morganville, which is what they called Shelbyville in those days. So I
    tied an onion to my belt, which was the style at the time. Now, to take the
    ferry cost a nickel, and in those days, nickels had pictures of bumblebees
    on 'em. "Gimme five bees for a quarter," you'd say. Now where were we? Oh,
    yeah. The important thing was that I had an onion on my belt, which was the
    style at the time. They didn't have any white onions, because of the war.
    The only thing you could get was those big yellow ones...`}
  </div>
);
export const VerboseCaption: Story = {
  args: { items: [verboseItem, items[1], items[2]] },
};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "50vw" }}>
        <Story />
      </div>
    ),
  ],
};

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
