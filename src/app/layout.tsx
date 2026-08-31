import type { Metadata } from "next";
import type { ReactNode } from "react";

import "modern-normalize/modern-normalize.css";
import "@/styles/grid.css";

import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import { SiteFooter } from "@/components/site-footer/SiteFooter";

export const metadata: Metadata = {
  title: "Okta Assessment",
  description: "Okta assessment application.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <SiteHeader />
          {children}
          <SiteFooter />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
