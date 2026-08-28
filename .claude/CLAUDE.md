# okta-assessment

Next.js 16 (App Router, Turbopack) + styled-components + Storybook, containerised
and deployed to https://okta.raymondselzer.net behind Traefik on the VPS.

## Docs to consult before writing code

- **styled-components** → https://styled-components.com/llms.txt — read before
  writing or changing any styled-components code. v6 moves fast and most search
  results describe v5-era patterns that no longer apply.
- **Next.js** → `node_modules/next/dist/docs` (present after `yarn install`;
  contains `01-app`, `02-pages`, `03-architecture`, `04-community`, `index.md`).
  These are the agent-oriented docs shipped inside the installed version, so they
  match the exact Next release in the lockfile — prefer them over the web.

## Rendering strategy — Core Web Vitals and SEO are standing constraints

**Default to Server Components. Every `"use client"` needs a justification.**
styled-components v6.3+ renders in RSC without the directive, so needing styles
is not a reason to add one.

Two things currently force a client boundary, both unavoidable:

- `createGlobalStyle` components cannot be instantiated from a Server Component
  (prerender fails with `Cannot read properties of undefined (reading 'color')`),
  so the global style modules are client modules.
- `ThemeToggle` uses `useSyncExternalStore`.

`/` must stay statically prerenderable — `next build` should report `○ Static`.
Do not introduce `cookies()`, `headers()` or other dynamic APIs in the root
layout without a deliberate decision, as they opt the whole route into dynamic
rendering.

## Theming

- Tokens come from `createTheme()` in `src/styles/theme.ts` and are emitted as
  **kebab-case CSS custom properties** (`--sc-color-fg-muted`).
- **Write every token key kebab-case.** Hyphens are inserted between path
  _segments_, not inside a key, so a camelCase key like `fgMuted` would emit
  `--sc-color-fgMuted` and silently break the convention.
- Every leaf of `theme` is a `var()` string, not a value. There is one theme
  object for both palettes — the CSS variable switches, the JS value never does.
- **`theme.GlobalStyle` requires a `ThemeProvider` fed `theme.raw`.** Rendered
  bare it throws; given `theme` it emits circular
  `--sc-color-bg: var(--sc-color-bg, #fff)`. Only `theme.raw` holds literals.
  See `src/styles/GlobalStyles.tsx`.
- Dark mode is resolved in pure CSS. The override must be written
  `:root[data-theme="dark"]` (specificity 0,2,0) and placed _after_ the
  `prefers-color-scheme` block, because `:root:not([data-theme="light"])` is also
  (0,2,0). A bare `[data-theme="dark"]` is (0,1,0) and loses.
- **Theme choice is never persisted.** The OS preference is the default and the
  only durable source; `ThemeToggle` sets `data-theme` for the session only.
  Do not add localStorage, a cookie, or a blocking inline script.

## Grid

`src/styles/grid.css` is static CSS; `Container`/`Row`/`Col` only compute class
names. `<Col $sm={12} $md={6} $lg={4}>` → `class="col sm-12 md-6 lg-4"`.
`Row` defaults to `<section>`, `Col` and `Container` to `<div>`; all take `as`.

Breakpoints are duplicated between `src/styles/breakpoints.ts` and `grid.css`
because `@media (min-width: var(--x))` is invalid CSS. Keep them in sync.

## Toolchain pins — do not "upgrade" these

- **`typescript` is pinned to 6.0.3, never 7.x.** TS 7 is the Go-native rewrite;
  it dropped `lib/typescript.js`, so Next reports "TypeScript is not installed"
  even though tsc works, and typescript-eslint declares `typescript <6.1.0`.
- **`eslint` is pinned to 9.x, never 10.x.** ESLint 10 changed a rule context API
  that `eslint-plugin-react` (via `eslint-config-next`) still calls, producing
  `contextOrFilename.getFilename is not a function`. No fixed release exists yet.
- **`nodeLinker: node-modules`** — Turbopack does not support PnP, and the
  Dockerfile copies `node_modules` between stages.
- **`npmMinimalAgeGate: 10080`** (7-day supply-chain cooldown) applies at
  resolution time only, so `yarn install --immutable` from the lockfile is
  unaffected. If you must add a package inside the window, use
  `npmPreapprovedPackages` rather than removing the gate.

## Storybook

- **Do not add `staticDirs: ["../public"]`.** `build-storybook` outputs into
  `public/storybook`, so it would copy its own output into itself each build.
- **Do not add `viteFinal.base`.** Storybook 10.5 emits relative asset paths in
  both the manager and the preview iframe; subpath hosting works via the
  `/storybook` → `/storybook/index.html` redirect in `next.config.ts` alone.
- Stories import from `@storybook/nextjs-vite`, never `@storybook/react`.
- Stories are visual documentation; behavioural assertions belong in the sibling
  `*.test.tsx`. Tests and stories live next to their component.
- The Storybook MCP server only exists while `yarn storybook` is running. Start
  Storybook first, then reconnect via `/mcp`.

## Deployment

- Internal port **3002** (recipe-viewer on the same VPS uses 3001). No host ports
  are published; Traefik routes over the external `n8n_default` network.
- The Traefik redirect middleware is named `okta-redirect-to-https`, not the
  generic `redirect-to-https`, which recipe-viewer already defines globally.
- **Deploy is manual.** The `deploy` job is gated to `workflow_dispatch`; merging
  to `main` does not ship. See the comment in `.github/workflows/deploy.yml` for
  the one-line change that enables deploy-on-merge.
- Adding an env var means: `.env.example`, the `.env` heredoc in `deploy.yml`,
  and a GitHub secret. `docker-compose.yml` uses `env_file` and needs no change.

## Verification

Run each as its own command and read each exit code — `&&` chains and `| tail`
mask failures.

    yarn typecheck      yarn lint       yarn test:run
    yarn build          yarn storybook  yarn build-storybook
