import type { ComponentPropsWithoutRef } from "react";
import { styled } from "styled-components";
import { theme } from "@/styles/theme";

const SkipLinkAnchor = styled.a`
  position: absolute;
  top: -100%;
  left: ${theme.space[4]};
  z-index: 100;

  padding: ${theme.space[2]} ${theme.space[4]};
  background: ${theme.color.bg};
  color: ${theme.color.fg};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.sm};

  transition: top ${theme.transition.fast};

  &:focus-visible {
    top: ${theme.space[4]};
    outline: 2px solid ${theme.color.focus};
    outline-offset: -2px;
  }
`;

type SkipLinkProps = ComponentPropsWithoutRef<"a">;

export function SkipLink({
  href = "#main-content",
  children = "Skip to content",
  ...rest
}: SkipLinkProps) {
  return (
    <SkipLinkAnchor href={href} {...rest}>
      {children}
    </SkipLinkAnchor>
  );
}
