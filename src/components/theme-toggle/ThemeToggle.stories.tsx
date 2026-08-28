import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ThemeToggle } from "./ThemeToggle";

const meta = {
  title: "components/ThemeToggle",
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
