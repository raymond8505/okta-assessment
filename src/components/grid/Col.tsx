import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cx } from "@/lib/cx";
import { breakpointOrder } from "@/styles/breakpoints";

import type { SpanProps } from "./types";

type ColProps<T extends ElementType> = {
  /** Element to render. Defaults to `div`. */
  as?: T;
} & SpanProps &
  Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * No "use client" — this renders in Server Components.
 */
export function Col<T extends ElementType = "div">({
  as,
  className,
  ...rest
}: ColProps<T>) {
  const Element = (as ?? "div") as ElementType;

  // Iterate breakpointOrder rather than Object.keys(props) so the emitted class
  // order is always narrowest-first and stable across renders.
  const spanClasses = breakpointOrder.map((bp) => {
    const span = (rest as SpanProps)[`$${bp}`];
    // Each span prop is consumed here; delete so it never reaches the DOM.
    delete (rest as SpanProps)[`$${bp}`];
    return span ? `${bp}-${span}` : undefined;
  });

  return <Element className={cx("col", ...spanClasses, className)} {...rest} />;
}
