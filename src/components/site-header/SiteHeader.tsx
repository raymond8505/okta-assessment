import { styled } from "styled-components";
import { Container } from "@/components/grid";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import { theme } from "@/styles/theme";
import { OktaLogoIcon } from "../icons/OktaLogoIcon";

const SiteHeaderElement = styled.header`
  background: ${theme.color.bg};
  padding: ${theme.space[4]} 0;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.06);
`;

export function SiteHeader({
  ...props
}: React.ComponentProps<typeof SiteHeaderElement>) {
  return (
    <SiteHeaderElement {...props}>
      <Container
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <OktaLogoIcon size={36} />
        <ThemeToggle />
      </Container>
    </SiteHeaderElement>
  );
}
