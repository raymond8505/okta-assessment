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
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  position: absolute;
  width: 32px;
  height: 32px;
  overflow: hidden;
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
      transform: translateX(-20px);
    }
  }

  .ThemeToggle__icon-viewport {
    height: 20px;
    width: 20px;
    overflow: hidden;

    > div {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      width: 40px;
    }
  }
`;
/**
 * Barebones theme toggle. The only client component in the tree.
 *
 * The visible label is static on purpose. Deriving it from the current theme
 * would make the server render ("light", since the server cannot know the OS
 * preference) differ from what the user should see, producing a flash of the
 * wrong label. Only aria-pressed reflects state, and useSyncExternalStore's
 * getServerSnapshot keeps the hydration render identical to the server's, so
 * there is no hydration warning either.
 *
 * The choice is not persisted — see setTheme.
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
          <SunIcon size={20} />
          <MoonIcon size={20} />
        </div>
      </div>
    </ThemeToggleButton>
  );
}
