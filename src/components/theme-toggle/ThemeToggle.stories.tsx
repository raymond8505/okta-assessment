import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ThemeToggle } from "./ThemeToggle";

/**
 * Behavioural assertions live in ThemeToggle.test.tsx. This story exists so the
 * button can be inspected visually and run through the a11y addon.
 *
 * Note the toggle sets `data-theme` on the preview iframe's <html> — the same
 * attribute the toolbar theme switcher drives — so clicking it here will also
 * move the toolbar's effective theme out of sync until the story reloads.
 */
const meta = {
  title: "Theme/ThemeToggle",
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
