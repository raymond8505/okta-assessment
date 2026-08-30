import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { styled } from "styled-components";

import { theme } from "./theme";
import { breakpoints } from "./breakpoints";

/**
 * Living reference for the token set. Every swatch reads the same custom
 * property the app does, so switching the toolbar theme repaints this page —
 * which makes it a usable check that a token is defined in both palettes.
 */
const meta = {
  title: "Design/Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COLOR_KEYS = [
  "bg",
  "surface",
  "surface-raised",
  "fg",
  "fg-muted",
  "border",
  "accent",
  "accent-hover",
  "accent-fg",
  "focus",
] as const;

const SPACE_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const SectionElement = styled.section`
  margin-bottom: ${theme.space[7]};
`;

const SectionHeading = styled.h2`
  font-size: ${theme["font-size"]["500" as keyof (typeof theme)["font-size"]]};
  margin-bottom: ${theme.space[4]};
`;

const TokenGrid = styled.div`
  display: grid;
  gap: ${theme.space[3]};
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space[4]};
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${theme.radius.md};
  background: ${({ $color }) => $color};
  border: 1px solid ${theme.color.border};
  flex: 0 0 auto;
`;

const SpaceSwatch = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: 1.5rem;
  background: ${theme.color.accent};
  border-radius: ${theme.radius.sm};
  flex: 0 0 auto;
`;

const TypeSample = styled.div<{ $fontSize: string }>`
  font-size: ${({ $fontSize }) => $fontSize};
  margin-bottom: ${theme.space[2]};
  line-height: 1;
`;

const BreakpointsIntro = styled.p`
  color: ${theme.color["fg-muted"]};
  margin-bottom: ${theme.space[4]};
`;

const BreakpointsList = styled.div`
  display: grid;
  gap: ${theme.space[2]};
`;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SectionElement>
      <SectionHeading>{title}</SectionHeading>
      {children}
    </SectionElement>
  );
}

export const Colors: Story = {
  render: () => (
    <Section title="Colour">
      <TokenGrid>
        {COLOR_KEYS.map((key) => (
          <TokenRow key={key}>
            <ColorSwatch $color={theme.color[key]} />
            <div>
              <div>{key}</div>
              <div>{theme.vars.color[key]}</div>
            </div>
          </TokenRow>
        ))}
      </TokenGrid>
    </Section>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Section title="Space">
      <TokenGrid>
        {SPACE_KEYS.map((key) => (
          <TokenRow key={key}>
            <SpaceSwatch $width={theme.space[key]} />
            <span>{theme.vars.space[key]}</span>
          </TokenRow>
        ))}
      </TokenGrid>
    </Section>
  ),
};

export const Typography: Story = {
  render: () => (
    <Section title="Type scale">
      <TokenGrid>
        {Object.keys(theme["font-size"]).map((key) => {
          const fontSizeKey = key as keyof (typeof theme)["font-size"];
          return (
            <div key={key}>
              <span>{theme.vars["font-size"][fontSizeKey]}</span>
              <TypeSample $fontSize={theme["font-size"][fontSizeKey]}>
                The quick brown fox
              </TypeSample>
            </div>
          );
        })}
      </TokenGrid>
    </Section>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <Section title="Breakpoints">
      <BreakpointsIntro>
        The one token family kept in TypeScript rather than as custom properties
        — <code>@media (min-width: var(--x))</code> is invalid CSS. Duplicated
        literally in grid.css.
      </BreakpointsIntro>
      <BreakpointsList>
        {Object.entries(breakpoints).map(([name, value]) => (
          <div key={name}>
            {name} — {value}
          </div>
        ))}
      </BreakpointsList>
    </Section>
  ),
};
