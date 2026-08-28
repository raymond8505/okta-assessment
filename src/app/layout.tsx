import type { Metadata } from "next";
import type { ReactNode } from "react";

import "modern-normalize/modern-normalize.css";
import "@/styles/grid.css";

import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { Container } from "@/components/grid";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";

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
          <header>
            <Container
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>logo</span>
              <ThemeToggle />
            </Container>
          </header>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
