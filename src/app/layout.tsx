import type { Metadata } from "next";
import type { ReactNode } from "react";

// modern-normalize is imported here (not via createGlobalStyle) so Next emits it
// as a real hashed <link> — cached across navigations and applied before first
// paint even if JS never loads.
import "modern-normalize/modern-normalize.css";

import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { GlobalStyles } from "@/styles/GlobalStyles";

export const metadata: Metadata = {
  title: "Okta Assessment",
  description: "Okta assessment application.",
};

/**
 * Server Component. No "use client" — styled-components v6.3+ renders in RSC,
 * and keeping the root layout server-rendered preserves static optimization
 * (and with it the Core Web Vitals and SEO characteristics).
 *
 * <html> carries no `data-theme`: the server genuinely cannot know the visitor's
 * OS preference, and inventing one would force dynamic rendering. The preference
 * resolves in pure CSS instead, so no `suppressHydrationWarning` is needed —
 * nothing mutates the DOM before hydration.
 *
 * Order matters: theme.GlobalStyle declares the custom properties, ThemeOverrides
 * redeclares the dark subset, GlobalStyle then consumes them.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
