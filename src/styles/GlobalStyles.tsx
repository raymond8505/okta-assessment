"use client";

import { ThemeProvider } from "styled-components";

import { GlobalStyle } from "./GlobalStyle";
import { ThemeOverrides } from "./ThemeOverrides";
import { theme } from "./theme";

import localFont from "next/font/local";

/* @ts-ignore @typescript-eslint/no-unused-vars we don't need the class name, the font stack is in the tokens */
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
    </ThemeProvider>
  );
}
