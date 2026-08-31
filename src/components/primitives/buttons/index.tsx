"use client";
import { styled } from "styled-components";
import { theme } from "@/styles/theme";

export const UnstyledButton = styled.button`
  all: unset;
  cursor: pointer;
`;

export const BaseButton = styled(UnstyledButton)`
  display: inline-block;
  padding: 1em 3em;
  border-radius: 6px;
  text-align: center;

  &:focus-visible {
    outline: 2px solid ${theme.color.focus};
    outline-offset: -2px;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: ${theme.color.fg};
  color: ${theme.color.bg};
`;

export const SecondaryButton = styled(BaseButton)`
  border: 1.5px solid currentColor;
`;
