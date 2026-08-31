import { styled } from "styled-components";
import { theme } from "@/styles/theme";

export const H1 = styled.h1`
  font-weight: normal;
  font-size: ${theme["font-size"]["h1"]};
  line-height: ${theme["line-height"]["heading"]};
  letter-spacing: ${theme["letter-spacing"]["tight"]};

  @media (max-width: 390px) {
    font-size: ${theme["font-size"]["h2"]};
  }
`;

export const H2 = styled.h2`
  font-weight: normal;
  font-size: ${theme["font-size"]["h2"]};
  line-height: ${theme["line-height"]["heading"]};
  letter-spacing: ${theme["letter-spacing"]["tight"]};
  margin-bottom: ${theme.space[6]};

  @media (max-width: 390px) {
    font-size: ${theme["font-size"]["h3"]};
  }
`;
