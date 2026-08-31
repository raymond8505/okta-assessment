import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  accordionFaqFixture,
  accordionLongContentFixture,
} from "@/fixtures/accordion-items.fixture";
import { Accordion } from "./Accordion";

const meta = {
  title: "components/Accordion",
  component: Accordion,
  args: {
    items: accordionFaqFixture,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "40rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InitiallyExpanded: Story = {
  args: { defaultExpandedIndex: 0 },
};

/** Visually identical to Default by design — the heading level is purely semantic. */
export const HeadingLevelTwo: Story = {
  args: { headingLevel: 2 },
};

export const LongContent: Story = {
  args: {
    items: accordionLongContentFixture,
    defaultExpandedIndex: 1,
  },
};
