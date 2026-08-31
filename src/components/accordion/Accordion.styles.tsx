import { styled } from "styled-components";
import { theme } from "@/styles/theme";
import { UnstyledButton } from "../primitives/buttons";

export const AccordionRoot = styled.div`
  border-top: 1px solid ${theme.color.border};
`;

export const AccordionHeading = styled.h3`
  margin: 0;
  border-bottom: 1px solid ${theme.color.border};
`;

export const AccordionTrigger = styled(UnstyledButton)`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space[3]};
  padding: ${theme.space[3]} ${theme.space[4]};
  font-weight: ${theme["font-weight"].medium};
  color: ${theme.color.fg};
  transition: background ${theme.transition.fast};

  &:hover,
  &[aria-expanded="true"] {
    background: ${theme.color.surface};
  }

  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
    outline-offset: -2px;
  }

  .PlusMinusIcon--vertical {
    transition: transform ${theme.transition.medium};
  }

  /* The vertical bar rotates onto the horizontal one, morphing the plus into
     a minus in sync with the panel transition. */
  &[aria-expanded="true"] .PlusMinusIcon--vertical {
    transform: rotate(90deg);
  }
`;

export const AccordionPanel = styled.div`
  /* Fallback ceiling for browsers without calc-size(). */
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
