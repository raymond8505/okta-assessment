import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cx } from "@/lib/cx";

import type { Align, GapScale, Justify } from "./types";

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
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Flex row. Props map to the static class names defined in grid.css:
 * `<Row $gap={2} $align="center">` renders `class="row gap-2 align-center"`.
 *
 * Defaults to `section` because a row usually delimits a meaningful region of
 * the page; pass `as="div"` when it is purely presentational.
 *
 * No "use client" — this renders in Server Components.
 */
export function Row<T extends ElementType = "section">({
  as,
  $gap,
  $align,
  $justify,
  $wrap = true,
  $direction,
  className,
  ...rest
}: RowProps<T>) {
  const Element = (as ?? "section") as ElementType;
  return (
    <Element
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
