"use client";

import { useSyncExternalStore } from "react";

import {
  getServerSnapshot,
  getSnapshot,
  setTheme,
  subscribe,
} from "./themeStore";
import { UnstyledButton } from "../primitives/UnstyledButton";
import { SunIcon } from "../icons/SunIcon";
import { MoonIcon } from "../icons/MoonIcon";
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const ThemeToggleButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.radius.sm};
  color: ${theme.color.fg};
  transition: all ${theme.transition.slow};
  cursor: pointer;

  &,
  .ThemeToggle__icon-viewport > div {
    transition: all ${theme.transition.slow};
  }

  background: linear-gradient(313.45deg, #ffffff 1.28%, #e4e0e0 98.72%);

  &.is-dark {
    background: linear-gradient(
      133.15deg,
      rgba(25, 25, 25, 0.8) 3.02%,
      rgba(127, 127, 127, 0.8) 100%
    );

    .ThemeToggle__icon-viewport > div {
      transform: translateX(-16px);
    }
  }

  .ThemeToggle__icon-viewport {
    height: 16px;
    width: 16px;
    overflow: hidden;

    > div {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      width: 32px;
    }
  }
`;
/**
 * Toggles the theme in the store between light and dark.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  return (
    <ThemeToggleButton
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={isDark ? "is-dark" : ""}
    >
      <div className="ThemeToggle__icon-viewport">
        <div>
          <SunIcon aria-hidden />
          <MoonIcon aria-hidden />
        </div>
      </div>
    </ThemeToggleButton>
  );
}
