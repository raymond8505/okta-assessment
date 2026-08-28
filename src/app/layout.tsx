import type { Metadata } from "next";
import type { ReactNode } from "react";

import "modern-normalize/modern-normalize.css";
import "@/styles/grid.css";

import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { SiteHeader } from "@/components/site-header/SiteHeader";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Okta Assessment",
  description: "Okta assessment application.",
};

const aeonikFont = localFont({
  display: "swap",
  src: [
    {
      path: "../resources/fonts/Aeonik-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../resources/fonts/Aeonik-Medium.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <GlobalStyles />
          <SiteHeader />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
