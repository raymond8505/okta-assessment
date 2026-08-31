import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FAQAccordion } from "./FAQAccordion";

const meta = {
  title: "components/FAQAccordion",
  component: FAQAccordion,
  parameters: {
    docs: {
      description: {
        component:
          "`Accordion` fed the site FAQ from `src/data/faq.json`. Behavioural " +
          "and prop variants are documented on the base Accordion stories.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "40rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FAQAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
