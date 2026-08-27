import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cx } from "@/lib/cx";

type ContainerProps<T extends ElementType> = {
  /** Element to render. Defaults to `div`. */
  as?: T;
  /** Drop the max-width and run full-bleed. */
  fluid?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Centred, max-width page gutter. Styling lives in grid.css under `.container`.
 *
 * No "use client" — this renders in Server Components.
 */
export function Container<T extends ElementType = "div">({
  as,
  fluid = false,
  className,
  ...rest
}: ContainerProps<T>) {
  const Element = (as ?? "div") as ElementType;
  return (
    <Element
      className={cx("container", fluid && "fluid", className)}
      {...rest}
    />
  );
}
