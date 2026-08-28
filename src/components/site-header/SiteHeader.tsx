import { styled } from "styled-components";
import { Container } from "@/components/grid";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";

const SiteHeaderElement = styled.header``;

export function SiteHeader({}) {
  return (
    <SiteHeaderElement>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>logo</span>
        <ThemeToggle />
      </Container>
    </SiteHeaderElement>
  );
}
