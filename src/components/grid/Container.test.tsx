import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./Container";

describe("Container", () => {
  it("renders a div by default", () => {
    render(<Container data-testid="container" />);
    expect(screen.getByTestId("container").tagName).toBe("DIV");
  });

  it("renders the configured element instead", () => {
    render(<Container as="main" data-testid="container" />);
    expect(screen.getByTestId("container").tagName).toBe("MAIN");
  });

  it("adds the fluid class only when opted in", () => {
    const { rerender } = render(<Container data-testid="container" />);
    expect(screen.getByTestId("container").className).toBe("container");

    rerender(<Container fluid data-testid="container" />);
    expect(screen.getByTestId("container")).toHaveClass("container", "fluid");
  });

  it("does not leak the fluid prop onto the DOM element", () => {
    render(<Container fluid data-testid="container" />);
    expect(screen.getByTestId("container").getAttribute("fluid")).toBeNull();
  });
});
