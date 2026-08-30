import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { styled } from "styled-components";

import { Col } from "./Col";
import { Row } from "./Row";

/**
 * Visual documentation of the grid. Behavioural assertions about the emitted
 * class names live in the sibling *.test.tsx files, not in play() blocks.
 */
const meta = {
  title: "Layout/Grid",
  component: Row,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Row>;

export default meta;
type Story = StoryObj<typeof meta>;

const CellElement = styled.div`
  background: var(--sc-color-surface);
  border: 1px solid var(--sc-color-border);
  border-radius: var(--sc-radius-md);
  padding: var(--sc-space-3);
  font-family: var(--sc-font-mono);
  font-size: var(--sc-font-size-200);
`;

/** Marks out a column so the spans are visible. */
function Cell({ children }: { children: React.ReactNode }) {
  return <CellElement>{children}</CellElement>;
}

/** With no span props every column takes an equal share of the row. */
export const EqualColumns: Story = {
  args: {},
  render: () => (
    <Row>
      <Col>
        <Cell>auto</Cell>
      </Col>
      <Col>
        <Cell>auto</Cell>
      </Col>
      <Col>
        <Cell>auto</Cell>
      </Col>
    </Row>
  ),
};

/** Twelve single-column spans tile the row exactly, gaps included. */
export const TwelveColumns: Story = {
  args: {},
  render: () => (
    <Row>
      {Array.from({ length: 12 }, (_, i) => (
        <Col key={i} $sm={1}>
          <Cell>1</Cell>
        </Col>
      ))}
    </Row>
  ),
};

/**
 * The documented responsive case: full width on small screens, halves at md,
 * thirds at lg. Resize the preview to see it reflow.
 */
export const Responsive: Story = {
  args: {},
  render: () => (
    <Row>
      <Col $sm={12} $md={6} $lg={4}>
        <Cell>sm-12 md-6 lg-4</Cell>
      </Col>
      <Col $sm={12} $md={6} $lg={4}>
        <Cell>sm-12 md-6 lg-4</Cell>
      </Col>
      <Col $sm={12} $md={12} $lg={4}>
        <Cell>sm-12 md-12 lg-4</Cell>
      </Col>
    </Row>
  ),
};

const GapsRow = styled(Row)`
  margin-bottom: var(--sc-space-5);
`;

/** Gap indexes the space token scale. */
export const Gaps: Story = {
  args: {},
  render: () => (
    <>
      {([1, 4, 6] as const).map((gap) => (
        <GapsRow key={gap} $gap={gap}>
          <Col $sm={4}>
            <Cell>gap-{gap}</Cell>
          </Col>
          <Col $sm={4}>
            <Cell>gap-{gap}</Cell>
          </Col>
          <Col $sm={4}>
            <Cell>gap-{gap}</Cell>
          </Col>
        </GapsRow>
      ))}
    </>
  ),
};

/** Alignment and justification modifiers. */
export const Alignment: Story = {
  args: {},
  render: () => (
    <Row $align="center" $justify="between">
      <Col $sm={3}>
        <Cell>short</Cell>
      </Col>
      <Col $sm={3}>
        <Cell>
          taller
          <br />
          content
          <br />
          block
        </Cell>
      </Col>
      <Col $sm={3}>
        <Cell>short</Cell>
      </Col>
    </Row>
  ),
};
