"use client";

export type Theme = "light" | "dark";

export const DARK_QUERY = "(prefers-color-scheme: dark)";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

/**
 * Subscribes to both sources that can change the effective theme: the OS
 * preference, and this page's own toggle.
 */
export function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    query.removeEventListener("change", onStoreChange);
  };
}

/**
 * The theme actually in effect. Returns a primitive, so React's identity check
 * on the snapshot is satisfied and there is no re-render loop.
 *
 * `data-theme` is only present once the toggle has set it, so the OS preference
 * is the fallback — which is also the state after every reload, since nothing
 * is persisted.
 */
export function getSnapshot(): Theme {
  const attribute = document.documentElement.getAttribute("data-theme");
  if (attribute === "light" || attribute === "dark") return attribute;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * Used for both the server render and the hydration render, which is what keeps
 * server and client output identical and avoids a hydration warning. React
 * re-renders with the real client snapshot immediately afterwards.
 *
 * "light" is arbitrary but harmless: nothing visible is derived from this value
 * (the page colours come from CSS), only the button's aria-pressed state, which
 * settles a tick later with no visual change.
 */
export function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Sets the theme for this page only. Deliberately does NOT persist — a reload
 * drops the attribute and the OS preference takes over again. Users who want a
 * durable choice set it in their OS, and the page follows it by default.
 */
export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  emit();
}
