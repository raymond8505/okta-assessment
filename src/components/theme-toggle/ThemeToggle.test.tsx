import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./ThemeToggle";

/**
 * jsdom has no matchMedia, so every test declares the OS preference explicitly.
 * Returns the listener set so tests can simulate the OS preference changing.
 */
function mockPrefersDark(prefersDark: boolean) {
  const listeners = new Set<() => void>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: prefersDark,
      media: query,
      addEventListener: (_: string, cb: () => void) => listeners.add(cb),
      removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
      onchange: null,
    })),
  );
  return listeners;
}

beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("renders a button with a static label", () => {
    mockPrefersDark(false);
    render(<ThemeToggle />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });

  it("reflects the OS preference when nothing has been toggled", () => {
    mockPrefersDark(true);
    render(<ThemeToggle />);
    // No data-theme attribute is set, so the OS preference is the source of
    // truth — this is also the state after every reload.
    expect(screen.getByRole("button")).toHaveClass("is-dark");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
  });

  it("sets data-theme on the document element when clicked", async () => {
    mockPrefersDark(false);
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(screen.getByRole("button")).toHaveClass("is-dark");
  });

  it("toggles back to light on a second click", async () => {
    mockPrefersDark(false);
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.getByRole("button")).not.toHaveClass("is-dark");
  });

  it("can override a dark OS preference with an explicit light choice", async () => {
    mockPrefersDark(true);
    const user = userEvent.setup();
    render(<ThemeToggle />);

    // Starts dark from the OS, so one click must land on light.
    await user.click(screen.getByRole("button"));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("follows the OS preference changing while mounted", () => {
    const listeners = mockPrefersDark(false);
    render(<ThemeToggle />);
    expect(screen.getByRole("button")).not.toHaveClass("is-dark");

    // Simulate the OS flipping to dark: re-stub matchMedia so the next snapshot
    // read reports dark, then fire the change listener the store registered.
    // act() is required — the store notifies from outside React, so without it
    // the re-render is never flushed and the assertion reads stale output.
    mockPrefersDark(true);
    act(() => {
      for (const listener of listeners) listener();
    });

    expect(screen.getByRole("button")).toHaveClass("is-dark");
  });
});
