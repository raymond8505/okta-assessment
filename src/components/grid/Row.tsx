import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cx } from "@/lib/cx";

import type { Align, GapScale, Justify } from "./types";

import styled, { css } from "styled-components";

import { theme } from "@/styles/theme";

type RowProps<T extends ElementType> = {
  /** Element to render. Defaults to `section`. */
  as?: T;
  /** Gap between columns, indexing the space scale. Omit for the default (4). */
  $gap?: GapScale;
  $align?: Align;
  $justify?: Justify;
  /** Set false to prevent wrapping. Defaults to true. */
  $wrap?: boolean;
  $direction?: "row" | "column";
  /** Paint the row with the `row-background` token. Defaults to false. */
  $hasBackground?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * section is Row default, Row passes as to override as needed
 */
const StyledRow = styled.section<{ $hasBackground?: boolean }>`
  ${({ $hasBackground }) =>
    $hasBackground &&
    css`
      background: ${theme["row-background"]};
    `}
`;

export function Row<T extends ElementType = "section">({
  as,
  $gap,
  $align,
  $justify,
  $wrap = true,
  $direction,
  $hasBackground,
  className,
  ...rest
}: RowProps<T>) {
  const Element = (as ?? "section") as ElementType;
  return (
    <StyledRow
      as={Element}
      $hasBackground={$hasBackground}
      className={cx(
        "row",
        $gap && `gap-${$gap}`,
        $align && `align-${$align}`,
        $justify && `justify-${$justify}`,
        !$wrap && "nowrap",
        $direction === "column" && "column",
        className,
      )}
      {...rest}
    />
  );
}
