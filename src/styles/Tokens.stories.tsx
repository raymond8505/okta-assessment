import type { Meta, StoryObj } from "@storybook/nextjs-vite";

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
const FONT_SIZE_KEYS = [100, 200, 300, 400, 500, 600, 700] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: theme.space[7] }}>
      <h2
        style={{
          fontSize: theme["font-size"][500],
          marginBottom: theme.space[4],
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

const codeStyle = {
  fontFamily: theme.font.mono,
  fontSize: theme["font-size"][100],
  color: theme.color["fg-muted"],
} as const;

export const Colors: Story = {
  render: () => (
    <Section title="Colour">
      <div style={{ display: "grid", gap: theme.space[3] }}>
        {COLOR_KEYS.map((key) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[4],
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: theme.radius.md,
                background: theme.color[key],
                border: `1px solid ${theme.color.border}`,
                flex: "0 0 auto",
              }}
            />
            <div>
              <div>{key}</div>
              <div style={codeStyle}>{theme.vars.color[key]}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Spacing: Story = {
  render: () => (
    <Section title="Space">
      <div style={{ display: "grid", gap: theme.space[3] }}>
        {SPACE_KEYS.map((key) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[4],
            }}
          >
            <div
              style={{
                width: theme.space[key],
                height: "1.5rem",
                background: theme.color.accent,
                borderRadius: theme.radius.sm,
                flex: "0 0 auto",
              }}
            />
            <span style={codeStyle}>{theme.vars.space[key]}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Typography: Story = {
  render: () => (
    <Section title="Type scale">
      <div style={{ display: "grid", gap: theme.space[3] }}>
        {FONT_SIZE_KEYS.map((key) => (
          <div key={key}>
            <span style={{ fontSize: theme["font-size"][key] }}>
              The quick brown fox
            </span>{" "}
            <span style={codeStyle}>{theme.vars["font-size"][key]}</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Breakpoints: Story = {
  render: () => (
    <Section title="Breakpoints">
      <p
        style={{ color: theme.color["fg-muted"], marginBottom: theme.space[4] }}
      >
        The one token family kept in TypeScript rather than as custom properties
        — <code style={codeStyle}>@media (min-width: var(--x))</code> is invalid
        CSS. Duplicated literally in grid.css.
      </p>
      <div style={{ display: "grid", gap: theme.space[2] }}>
        {Object.entries(breakpoints).map(([name, value]) => (
          <div key={name} style={codeStyle}>
            {name} — {value}
          </div>
        ))}
      </div>
    </Section>
  ),
};
