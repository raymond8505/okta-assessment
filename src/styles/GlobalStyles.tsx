"use client";

import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "./GlobalStyle";
import { GridStyle } from "./GridStyle";
import { ThemeOverrides } from "./ThemeOverrides";
import { theme } from "./theme";

import localFont from "next/font/local";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- we're loading the font the Next.js way, but we set the font with a token, so we dont need to use the var, but it _has_ to be a var
const aeonikFont = localFont({
  display: "swap",
  src: [
    {
      path: "../resources/fonts/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../resources/fonts/Aeonik-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

export function GlobalStyles() {
  return (
    <ThemeProvider theme={theme.raw}>
      <theme.GlobalStyle />
      <ThemeOverrides />
      <GlobalStyle />
      <GridStyle />
    </ThemeProvider>
  );
}
