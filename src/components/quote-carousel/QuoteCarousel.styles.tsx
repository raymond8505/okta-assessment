import { styled } from "styled-components";
import { theme } from "@/styles/theme";

export const QuoteBlockquote = styled.blockquote`
  margin: 0;
  padding: ${theme.space[4]};
  line-height: ${theme["line-height"].normal};

  footer {
    margin-top: ${theme.space[2]};
    color: ${theme.color["fg-muted"]};
  }

  &,
  & * {
    text-wrap: wrap;
  }
`;
