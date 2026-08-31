import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteHeader } from "./SiteHeader";

const meta = {
  title: "components/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The top-of-page band: the Okta logo linking back to `/` and the " +
          "ThemeToggle, aligned to the page gutter by an internal grid " +
          "`Container`. Flip the toolbar theme to see the band repaint and " +
          "the toggle slide.",
      },
    },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
