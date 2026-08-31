import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteFooter } from "./SiteFooter";

const meta = {
  title: "components/SiteFooter",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The bottom-of-page band with the copyright line. It reads the " +
          "`theme.footer` tokens, which have no dark-palette override — the " +
          "band stays the same dark colour in both themes, so flipping the " +
          "toolbar theme should not change it.",
      },
    },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
