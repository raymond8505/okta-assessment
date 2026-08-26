"use client";

import { useSyncExternalStore } from "react";

import {
  getServerSnapshot,
  getSnapshot,
  setTheme,
  subscribe,
} from "./themeStore";

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
    <button
      type="button"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      Toggle theme
    </button>
  );
}
