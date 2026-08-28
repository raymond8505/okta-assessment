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
| `yarn data:quotes`            | Regenerate `src/data/quotes.json` from the CSV   |
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

## Quote data

`src/data/quotes.json` is the committed dataset — 120 entries of
`{ id, author, quote, image }` built from
`prior-art/Quotes Exercise Dataset - quotes.csv` by `yarn data:quotes`. It is
checked in, so the app needs no Unsplash key at runtime; you only need one to
regenerate it.

**Images are chosen by concept, not by quote text.** Passing a whole quote to
Unsplash matches loosely and returns generic stock — the full text of
_"Premature optimization is the root of all evil."_ comes back topped by "an open
book with printed text". So each quote is mapped in `scripts/concepts.json` to a
short visual concept (`tree roots`, `frozen lake`, `minimalist architecture`)
that the search is actually grounded in. **That file is hand-authored**; the JSON
outputs are entirely generated.

Two constraints shape the script:

- **The key is on Unsplash's Demo tier — 50 requests/hour.** 120 quotes cannot
  each have their own request. The concept vocabulary is deliberately small (44
  concepts for 120 quotes), and the script issues one request per _unique_
  concept with `per_page=30`, handing different photos from the same page to
  quotes that share a concept. A full build costs 44 requests. Every quote still
  gets a distinct photo — a global set of used photo ids guarantees no reuse
  across the whole dataset.
- **A query can legitimately return nothing.** Unsplash narrows sharply as terms
  are added (`"frozen lake"` → 2681 results, `"tangled roots dark forest"` → 0),
  so every quote falls back `concept → theme → "abstract texture"`. The script
  reports which quotes fell back so weak concepts can be corrected.

Responses are cached in `.cache/` (gitignored), so re-runs are free and a build
interrupted by the rate limit resumes where it stopped.

`src/data/credits.json` is a sidecar keyed by quote id holding the photographer
name and UTM-tagged profile/photo links. It exists because Unsplash's API
Guidelines require attribution, while `quotes.json` is kept to exactly the four
specified fields. Hotlinking `urls.regular` — with its `ixid` parameter intact —
is the compliant way to display these; the `/photos/:id/download` ping applies
only to actual downloads, which this app does not do.

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
