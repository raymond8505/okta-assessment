import { styled } from "styled-components";
import { Container } from "@/components/grid";
import { ThemeToggle } from "../theme-toggle/ThemeToggle";
import { theme } from "@/styles/theme";
import { OktaLogoIcon } from "../icons/OktaLogoIcon";
import Link from "next/link";

const SiteHeaderElement = styled.header`
  background: ${theme.color.bg};
  padding: ${theme.space[4]} 0;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.06);
`;

const HeaderContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  color: inherit;
`;

export function SiteHeader({
  ...props
}: React.ComponentProps<typeof SiteHeaderElement>) {
  return (
    <SiteHeaderElement {...props}>
      <HeaderContainer>
        <LogoLink href={"/"}>
          <OktaLogoIcon size={36} />
        </LogoLink>
        <ThemeToggle />
      </HeaderContainer>
    </SiteHeaderElement>
  );
}
