import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  // Stories live beside their components. No *.mdx glob — there are no MDX docs
  // pages, and an unmatched pattern makes the test runner warn on every run.
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-mcp",
  ],

  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },

  // NO staticDirs. `build-storybook` writes into public/storybook, so listing
  // "../public" here would make Storybook copy its own previous output into
  // itself and nest a further copy on every build. @storybook/nextjs-vite
  // already serves the public directory. If story-only static assets are ever
  // needed, add narrow entries such as
  //   { from: "../public/fonts", to: "/fonts" }
  // rather than the whole directory.
};

export default config;
