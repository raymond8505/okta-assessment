import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "./SiteHeader";

// jsdom has no matchMedia, and the ThemeToggle inside the header reads the OS
// preference through it on mount. A static light-mode stub is enough here —
// toggle behaviour itself is covered in ThemeToggle.test.tsx.
vi.stubGlobal(
  "matchMedia",
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  })),
);

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

describe("SiteHeader", () => {
  it("renders a banner landmark", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("links the logo back to the home page", () => {
    render(<SiteHeader />);
    const logoLink = screen.getByRole("link");
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the theme toggle", () => {
    render(<SiteHeader />);
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument();
  });
});
