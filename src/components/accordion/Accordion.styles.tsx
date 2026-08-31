import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { UnstyledButton } from "../primitives/buttons";

/*
 * Scaffold styling on generic tokens only. When the visual design lands, its
 * values belong in a kebab-case `theme.accordion` group mirroring
 * `theme.carousel`.
 */

export const AccordionRoot = styled.div`
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const AccordionItemRoot = styled.div`
  &:not(:first-child) {
    border-top: 1px solid ${theme.color.border};
  }
`;

export const AccordionHeading = styled.h3`
  margin: 0;
`;

export const AccordionTrigger = styled(UnstyledButton)`
  /* UnstyledButton's all:unset resets box-sizing to content-box. */
  box-sizing: border-box;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.space[3]} ${theme.space[4]};
  font-weight: ${theme["font-weight"].medium};
  color: ${theme.color.fg};
  transition: background ${theme.transition.fast};

  &:hover,
  &[aria-expanded="true"] {
    background: ${theme.color.surface};
  }

  /* UnstyledButton's all:unset removes the default focus ring. The negative
     offset keeps the ring inside the root's overflow:hidden clip. */
  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
    outline-offset: -2px;
  }
`;

/* No display rule here — the hidden attribute does the collapsing, and any
   styled display would override it. */
export const AccordionPanel = styled.div`
  padding: ${theme.space[3]} ${theme.space[4]};
  color: ${theme.color["fg-muted"]};
`;
