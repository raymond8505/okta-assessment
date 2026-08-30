import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Row } from "./Row";

describe("Row", () => {
  it("renders a section by default", () => {
    render(<Row data-testid="row" />);
    expect(screen.getByTestId("row").tagName).toBe("SECTION");
  });

  it("renders the configured element instead", () => {
    render(<Row as="div" data-testid="row" />);
    expect(screen.getByTestId("row").tagName).toBe("DIV");
  });

  it("emits only the base class when no modifiers are set", () => {
    render(<Row data-testid="row" />);
    const row = screen.getByTestId("row");
    // $wrap defaults to true, which is .row's own default — so it must NOT add
    // a class. Only the opt-out (nowrap) is expressed as a modifier.
    // styled-components mixes its own generated classes into className, so
    // check the semantic classes individually rather than the full string.
    expect(row).toHaveClass("row");
    expect(row).not.toHaveClass("nowrap", "column");
  });

  it("maps gap, align and justify to class names", () => {
    render(
      <Row $gap={2} $align="center" $justify="between" data-testid="row" />,
    );
    expect(screen.getByTestId("row")).toHaveClass(
      "row",
      "gap-2",
      "align-center",
      "justify-between",
    );
  });

  it("adds nowrap only when wrapping is disabled", () => {
    render(<Row $wrap={false} data-testid="row" />);
    expect(screen.getByTestId("row")).toHaveClass("nowrap");
  });

  it("adds the column class only for column direction", () => {
    const { rerender } = render(<Row $direction="row" data-testid="row" />);
    expect(screen.getByTestId("row")).not.toHaveClass("column");

    rerender(<Row $direction="column" data-testid="row" />);
    expect(screen.getByTestId("row")).toHaveClass("column");
  });

  it("applies distinct styled-components output only when $hasBackground is set", () => {
    const { rerender } = render(<Row data-testid="row" />);
    const withoutBackground = screen.getByTestId("row").className;

    rerender(<Row $hasBackground data-testid="row" />);
    const withBackground = screen.getByTestId("row").className;

    expect(withBackground).not.toBe(withoutBackground);
  });

  it("renders children", () => {
    render(
      <Row data-testid="row">
        <span>content</span>
      </Row>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
