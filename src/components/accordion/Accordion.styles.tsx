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

/*
 * Expand/collapse is animated on height, so the panel cannot use the hidden
 * attribute (display:none is not height-animatable). Collapse is driven off
 * aria-hidden instead: height/padding animate to zero and visibility flips to
 * hidden when the closing transition ends, which also drops any focusable
 * panel content from the tab order.
 */
export const AccordionPanel = styled.div`
  /* Fallback ceiling for browsers without calc-size(). Must exceed any real
     panel height; the gap between the two eats into the perceived duration,
     so keep it as low as content allows. */
  --accordion-panel-max-height: 50rem;

  box-sizing: border-box;
  overflow: hidden;
  padding: ${theme.space[3]} ${theme.space[4]};
  color: ${theme.color["fg-muted"]};
  max-height: var(--accordion-panel-max-height);
  transition:
    max-height ${theme.transition.medium},
    padding-block ${theme.transition.medium},
    visibility ${theme.transition.medium};

  &[aria-hidden="true"] {
    max-height: 0;
    /* Padding renders even at zero height, so it collapses alongside. */
    padding-block: 0;
    visibility: hidden;
  }

  @supports (height: calc-size(auto, size)) {
    max-height: none;
    height: calc-size(auto, size);
    transition:
      height ${theme.transition.medium},
      padding-block ${theme.transition.medium},
      visibility ${theme.transition.medium};

    &[aria-hidden="true"] {
      max-height: none;
      height: 0;
    }
  }
`;
