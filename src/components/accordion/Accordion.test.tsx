import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { accordionItemsFixture } from "@/fixtures/accordion-items.fixture";
import { Accordion } from "./Accordion";
import type { AccordionProps } from "./Accordion";

function renderAccordion(props: Partial<AccordionProps> = {}) {
  return render(<Accordion items={accordionItemsFixture} {...props} />);
}

function getTrigger(name: string) {
  return screen.getByRole("button", { name });
}

// Collapsed panels are aria-hidden, which removes them from the accessibility
// tree — so they are reached through aria-controls, not a role query.
function getPanelFor(trigger: HTMLElement) {
  const panelId = trigger.getAttribute("aria-controls");
  const panel = panelId && document.getElementById(panelId);
  if (!panel) throw new Error("Trigger has no resolvable aria-controls panel");
  return panel;
}

describe("Accordion", () => {
  it("wraps each trigger in a default level-3 heading whose only child is the button", () => {
    renderAccordion();
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(3);
    for (const heading of headings) {
      expect(heading.children).toHaveLength(1);
      expect(heading.children[0].tagName).toBe("BUTTON");
    }
  });

  it("renders headings at the given headingLevel", () => {
    renderAccordion({ headingLevel: 2 });
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("starts fully collapsed with no perceivable region", () => {
    renderAccordion();
    for (const item of accordionItemsFixture) {
      expect(getTrigger(item.heading as string)).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    }
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("wires each trigger and panel together with unique ids", () => {
    renderAccordion();
    const ids = new Set<string>();
    for (const item of accordionItemsFixture) {
      const trigger = getTrigger(item.heading as string);
      const panel = getPanelFor(trigger);
      expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
      ids.add(trigger.id);
      ids.add(panel.id);
    }
    expect(ids.size).toBe(accordionItemsFixture.length * 2);
  });

  it("expands a panel on click, exposing it as a region labelled by its trigger", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(getTrigger("Section one"));
    expect(getTrigger("Section one")).toHaveAttribute("aria-expanded", "true");
    const region = screen.getByRole("region", { name: "Section one" });
    expect(region).toBeVisible();
    expect(region).toHaveTextContent("Content of section one");
  });

  it("toggles with Enter and Space through the native button", async () => {
    const user = userEvent.setup();
    renderAccordion();
    const trigger = getTrigger("Section one");

    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard(" ");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("collapses the open panel when another header is expanded", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(getTrigger("Section one"));
    await user.click(getTrigger("Section two"));

    expect(getTrigger("Section one")).toHaveAttribute("aria-expanded", "false");
    expect(getTrigger("Section two")).toHaveAttribute("aria-expanded", "true");
    expect(getPanelFor(getTrigger("Section one"))).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(getPanelFor(getTrigger("Section two"))).not.toHaveAttribute(
      "aria-hidden",
    );
  });

  it("collapses to none when the open header is clicked again", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.click(getTrigger("Section one"));
    await user.click(getTrigger("Section one"));

    expect(getTrigger("Section one")).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("keeps collapsed content in the DOM, hidden from assistive tech", () => {
    renderAccordion();
    // Guards the SSR/crawler contract: a refactor to conditional rendering
    // would drop collapsed panels from the server payload. Visual collapse is
    // class-driven CSS that jsdom does not compute, so the testable contract
    // is DOM presence + aria-hidden.
    const panel = getPanelFor(getTrigger("Section two"));
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveTextContent("Content of section two");
    // The hidden attribute would set display:none and break the open/close
    // height animation.
    expect(panel).not.toHaveAttribute("hidden");
  });

  it("expands the defaultExpandedIndex panel on first render", () => {
    renderAccordion({ defaultExpandedIndex: 1 });
    expect(getTrigger("Section two")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("region", { name: "Section two" })).toBeVisible();
  });

  it("derives deterministic element ids from a provided item id", () => {
    render(
      <Accordion
        items={accordionItemsFixture.map((item, index) => ({
          ...item,
          id: `faq-${index}`,
        }))}
      />,
    );
    const trigger = getTrigger("Section one");
    expect(trigger).toHaveAttribute("id", "faq-0-trigger");
    expect(trigger).toHaveAttribute("aria-controls", "faq-0-panel");
    expect(getPanelFor(trigger)).toHaveAttribute("id", "faq-0-panel");
  });

  it("tabs through the triggers in document order with no stops in collapsed panels", async () => {
    const user = userEvent.setup();
    renderAccordion();

    await user.tab();
    expect(getTrigger("Section one")).toHaveFocus();
    await user.tab();
    expect(getTrigger("Section two")).toHaveFocus();
    await user.tab();
    expect(getTrigger("Section three")).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
