import { theme } from "@/styles/theme";
import styled from "styled-components";

const SiteFooterElement = styled.footer`
  background: ${theme.footer.bg};
  color: ${theme.footer.color};
  font-size: ${theme.footer.fontSize};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.5px solid ${theme.footer.border};
`;
export function SiteFooter({
  ...props
}: React.ComponentProps<typeof SiteFooterElement>) {
  return (
    <SiteFooterElement {...props}>
      <span>Copyright © 2026 Acme. All rights reserved.</span>
    </SiteFooterElement>
  );
}
