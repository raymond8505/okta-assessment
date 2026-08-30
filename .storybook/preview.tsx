import * as React from "react";

import type { Preview } from "@storybook/nextjs-vite";
import { DecoratorHelpers } from "@storybook/addon-themes";
import { styled, ThemeProvider } from "styled-components";

import "modern-normalize/modern-normalize.css";
import "../src/styles/grid.css";
import { Container } from "../src/components/grid";
import { setTheme } from "../src/components/theme-toggle/themeStore";
import { GlobalStyle } from "../src/styles/GlobalStyle";
import { ThemeOverrides } from "../src/styles/ThemeOverrides";
import { theme } from "../src/styles/theme";

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

const THEMES = { light: "light", dark: "dark" };
initializeThemeState(Object.keys(THEMES), "light");

const PreviewSurface = styled.div`
  background: ${theme.color.bg};
  color: ${theme.color.fg};
  padding: ${theme.space[4]};
  min-height: 100vh;
`;

/**
 * Every story is wrapped in the same chrome the app uses: the global style
 * blocks, a themed surface, and a grid Container so layout components sit in a
 * realistic gutter.
 *
 * The wrapper reads its colours from the same custom properties as the app, so
 * flipping the toolbar theme repaints it with no extra wiring.
 */
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    // Storybook's own backgrounds addon would fight `body { background:
    // var(--sc-color-bg) }` and make the toolbar theme switch look broken.
    backgrounds: { disable: true },
    nextjs: { appDirectory: true },
  },

  decorators: [
    (Story) => (
      // theme.raw, not theme — theme.GlobalStyle resolves values from context,
      // and every leaf of `theme` is already a var() reference, so passing it
      // would emit circular declarations. See src/styles/GlobalStyles.tsx.
      <ThemeProvider theme={theme.raw}>
        <theme.GlobalStyle />
        <ThemeOverrides />
        <GlobalStyle />
        <PreviewSurface>
          <Container>
            <Story />
          </Container>
        </PreviewSurface>
      </ThemeProvider>
    ),

    // Drives the same store the app's ThemeToggle reads (setTheme, not a raw
    // setAttribute), so the toolbar switch is visible in the toggle's own
    // rendered state (icon slide, aria-pressed), not just the background.
    (Story, context) => {
      const selected = pluckThemeFromContext(context) || "light";
      React.useEffect(() => {
        setTheme(selected === "dark" ? "dark" : "light");
      }, [selected]);
      return <Story />;
    },
  ],
};

export default preview;
