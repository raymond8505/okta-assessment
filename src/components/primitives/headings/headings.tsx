import { styled } from "styled-components";
import { theme } from "@/styles/theme";

export const H1 = styled.h1`
  font-weight: normal;
  font-size: ${theme["font-size"]["h1"]};
  line-height: ${theme["line-height"]["h1"]};
  letter-spacing: ${theme["letter-spacing"]["tight"]};
`;
