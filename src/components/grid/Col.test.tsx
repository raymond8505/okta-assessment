import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Col } from "./Col";

describe("Col", () => {
  it("renders a div by default", () => {
    render(<Col data-testid="col" />);
    expect(screen.getByTestId("col").tagName).toBe("DIV");
  });

  it("renders the configured element instead", () => {
    render(<Col as="li" data-testid="col" />);
    expect(screen.getByTestId("col").tagName).toBe("LI");
  });

  it("maps span props to breakpoint class names", () => {
    render(<Col $sm={12} $md={6} $lg={4} data-testid="col" />);
    // The documented contract: $sm={12} $md={6} $lg={4} -> "col sm-12 md-6 lg-4"
    expect(screen.getByTestId("col")).toHaveClass("col", "sm-12", "md-6", "lg-4");
  });

  it("emits span classes narrowest-first regardless of prop order", () => {
    render(<Col $lg={4} $sm={12} $md={6} data-testid="col" />);
    // Order is driven by breakpointOrder, not by how props were written, so the
    // class attribute is stable across renders and diffable in snapshots.
    expect(screen.getByTestId("col").className).toBe("col sm-12 md-6 lg-4");
  });

  it("falls back to the bare .col equal-share class with no spans", () => {
    render(<Col data-testid="col" />);
    expect(screen.getByTestId("col").className).toBe("col");
  });

  it("does not leak $-prefixed span props onto the DOM element", () => {
    render(<Col $sm={12} $md={6} data-testid="col" />);
    const el = screen.getByTestId("col");
    expect(el.getAttribute("$sm")).toBeNull();
    expect(el.getAttribute("$md")).toBeNull();
  });

  it("preserves a caller-supplied className", () => {
    render(<Col $md={6} className="custom" data-testid="col" />);
    expect(screen.getByTestId("col")).toHaveClass("col", "md-6", "custom");
  });
});
