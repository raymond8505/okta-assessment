import { theme } from "@/styles/theme";
import styled from "styled-components";

const SiteFooterElement = styled.footer`
  background: ${theme.footer.bg};
  color: ${theme.footer.color};
  font-size: ${theme.footer.fontSize};
  padding: 24px;
  display: flex;
  flex-align: center;
  justify-content: center;
`;
export function SiteFooter({ ...props }) {
  return (
    <SiteFooterElement>
      Copyright © 2026 Acme. All rights reserved.
    </SiteFooterElement>
  );
}
