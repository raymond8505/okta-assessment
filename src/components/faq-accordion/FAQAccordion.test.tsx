import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import faq from "@/data/faq.json";
import { FAQAccordion } from "./FAQAccordion";

// Assertions iterate the real faq.json rather than pinning literals, so
// editing the FAQ copy never breaks this suite — only shape changes do.
describe("FAQAccordion", () => {
  it("renders every FAQ question as an accordion header", () => {
    render(<FAQAccordion />);
    for (const { question } of faq) {
      expect(
        screen.getByRole("button", { name: question }),
      ).toBeInTheDocument();
    }
  });

  it("derives stable element ids from each entry's id", () => {
    render(<FAQAccordion />);
    for (const { id, question } of faq) {
      const trigger = screen.getByRole("button", { name: question });
      expect(trigger).toHaveAttribute("id", `${id}-trigger`);
      expect(trigger).toHaveAttribute("aria-controls", `${id}-panel`);
    }
  });

  it("keeps every answer in the DOM for crawlers", () => {
    render(<FAQAccordion />);
    for (const { answer } of faq) {
      expect(screen.getByText(answer)).toBeInTheDocument();
    }
  });

  it("forwards accordion props", () => {
    render(<FAQAccordion headingLevel={2} defaultExpandedIndex={0} />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
      faq.length,
    );
    expect(
      screen.getByRole("button", { name: faq[0].question }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
