"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * Collects styled-components CSS generated during SSR and flushes it into
 * <head> before any content that uses it.
 *
 * styled-components v6.3+ renders inside Server Components without a registry,
 * so this exists solely to capture styles from Client Components — which here
 * means the global style blocks and the theme toggle. `children` arrives as a
 * prop from a Server Component, so the RSC payload passes straight through and
 * nothing below this boundary is pulled into the client bundle.
 */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initial state so the sheet is created exactly once per render pass.
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // clearTag() prevents rules already flushed in an earlier streamed chunk
    // from being emitted again in the next one.
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // Both hooks above must run unconditionally — do NOT hoist this early return
  // above them, or hook order diverges between server and client render.
  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
