import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent } from "storybook/test";

import {
  BaseButton,
  PrimaryButton,
  SecondaryButton,
  UnstyledButton,
} from "./index";

const meta = {
  title: "primitives/Buttons",
  component: PrimaryButton,
  args: {
    children: "Button",
    onClick: fn(),
  },
} satisfies Meta<typeof PrimaryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  render: (args) => <SecondaryButton {...args} />,
};

export const Base: Story = {
  render: (args) => <BaseButton {...args} />,
};

export const Unstyled: Story = {
  render: (args) => <UnstyledButton {...args} />,
};
