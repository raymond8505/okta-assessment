"use client";

import { createGlobalStyle } from "styled-components";

import { theme } from "./theme";

/**
 * Applies tokens to the document. This is NOT a reset — `modern-normalize`
 * (imported in the root layout) handles cross-browser normalization and
 * `box-sizing: border-box`. This layer only does what normalize deliberately
 * won't: bind the page to our own tokens.
 */
export const GlobalStyle = createGlobalStyle`
  body {
    min-height: 100dvh;
    margin: 0;
    background: ${theme.color.bg};
    color: ${theme.color.fg};
    font-family: ${theme.font.sans};
    font-size: ${theme["font-size"]["1rem"]};
    line-height: ${theme["line-height"].normal};
  }

  :focus-visible {
    outline: 2px solid ${theme.color.focus};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
