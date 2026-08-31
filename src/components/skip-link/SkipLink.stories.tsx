import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkipLink } from "./SkipLink";

const meta = {
  title: "components/SkipLink",
  component: SkipLink,
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Focused: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole("link").focus();
  },
};
