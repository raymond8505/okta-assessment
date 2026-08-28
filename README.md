# okta-assessment

Next.js 16 App Router scaffold — styled-components, CSS custom property tokens,
a flex grid, and Storybook. Deployed to <https://okta.raymondselzer.net>.

## Requirements

- Node 24.16.0 (`.nvmrc`)
- Yarn 4.17.0 via Corepack — `corepack enable`

## Getting started

```bash
yarn install
yarn dev            # http://localhost:3000
yarn storybook      # http://localhost:6006
```

## Scripts

| Script                        | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `yarn dev`                    | Next dev server (Turbopack)                      |
| `yarn build`                  | Production build (`output: "standalone"`)        |
| `yarn start`                  | Serve the production build                       |
| `yarn typecheck`              | `tsc --noEmit`                                   |
| `yarn lint`                   | ESLint, zero warnings tolerated                  |
| `yarn test` / `yarn test:run` | Vitest — component tests in jsdom                |
| `yarn storybook`              | Storybook dev server                             |
| `yarn build-storybook`        | Static Storybook into `public/storybook`         |
| `yarn build:prod`             | Storybook then Next — what the Docker image runs |

## Two bundlers, on purpose

**Turbopack** builds the Next application (the default for both `dev` and
`build` in Next 16 — no `--turbopack` flag). **Vite** builds Storybook and runs
Vitest. They never touch the same artifact, and there is no `vite.config` for the
app itself.

## Styling

Tokens are declared with styled-components v6's `createTheme()` and emitted as
kebab-case CSS custom properties (`--sc-color-fg-muted`, `--sc-space-4`). Every
value on the exported `theme` is a `var()` reference rather than a literal, so
there is a single theme object for both palettes: the CSS variable switches and
the JS value never does. Themes therefore cost no React re-render, cannot produce
a hydration mismatch, and still work with JavaScript disabled.

`modern-normalize` provides the reset. `src/styles/grid.css` holds the grid as
static CSS.

### Light and dark

The **OS preference is the default and the only durable source of truth** —
nothing is persisted. `ThemeToggle` sets `data-theme` on `<html>` for the current
page only; reloading drops it and the OS preference takes over again. To make a
choice stick, change it in your operating system.

### Grid

```tsx
<Row $gap={4} $align="center">
  <Col $sm={12} $md={6} $lg={4}>
    …
  </Col>
</Row>
```

Props map directly to class names — that `Col` renders
`class="col sm-12 md-6 lg-4"`. `Row` defaults to `<section>`, `Col` and
`Container` to `<div>`; all accept `as` to change the element.

Column widths are exact rather than approximate:

```
width: calc(N / 12 * (100% + var(--row-gap)) - var(--row-gap))
```

Twelve `$sm={1}` columns sum to `100% - 11×gap`, and flex adds the eleven gaps
back for exactly `100%`.

**Breakpoints are the one token family kept in TypeScript** rather than as custom
properties, and are duplicated literally in `grid.css`. This is deliberate, not
an oversight: `@media (min-width: var(--x))` is invalid CSS — custom properties
are not permitted in media query conditions.

## Testing

Vitest covers component behaviour in jsdom with Testing Library.

Stories are visual documentation; behavioural assertions live in the sibling
`*.test.tsx`. Both sit next to the component they cover.

## Deployment

Docker multi-stage build → Traefik on the VPS, internal port 3002, TLS via
Let's Encrypt. Storybook is built into `public/storybook` and served at
`/storybook`.

**Deploying is a manual action.** Merging to `main` runs the tests and a Docker
build but does not ship; trigger the `Deploy` workflow from the Actions tab. See
`.claude/CLAUDE.md` for the one-line change that enables deploy-on-merge.
