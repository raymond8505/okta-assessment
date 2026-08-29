import { styled } from "styled-components";
import { theme } from "@/styles/theme";

export const H2 = styled.h2`
  font-weight: normal;
  font-size: ${theme["font-size"]["h2"]};
  line-height: ${theme["line-height"]["h2"]};
  letter-spacing: ${theme["letter-spacing"]["tight"]};
`;
