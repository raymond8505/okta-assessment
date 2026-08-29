import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumbs } from "./Breadcrumbs";
const meta = {
  title: "components/Breadcrumbs",
  component: Breadcrumbs,
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ["Home", { href: "#", label: "Products" }, "Shoes"],
  },
};
