# syntax=docker/dockerfile:1

# ---- Stage 1: dependencies -------------------------------------------------
FROM node:24.16.0-slim AS deps
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# .yarnrc.yml is required here, not optional: it carries `nodeLinker:
# node-modules`, without which Yarn 4 would produce a PnP install and the
# multi-stage COPY below would have no node_modules directory to copy. It also
# carries the supply-chain cooldown, which is why it must be present for the
# --immutable install to behave the same in CI as it does locally.
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# ---- Stage 2: build --------------------------------------------------------
FROM node:24.16.0-slim AS builder
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# build:prod = build-storybook (into public/storybook) THEN next build.
# The order is load-bearing: next build snapshots public/ into the standalone
# output, so Storybook has to be on disk first. Calling the named script rather
# than inlining the two commands keeps the image build and `yarn build:prod`
# locally from drifting apart.
RUN yarn build:prod

# ---- Stage 3: runner -------------------------------------------------------
FROM node:24.16.0-slim AS runner
WORKDIR /app

# curl is installed solely so the deploy workflow's `docker exec ... curl
# --fail` health loop works. The HEALTHCHECK below deliberately uses node
# instead, so the image stays self-checking even without it.
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

# `output: "standalone"` emits a server.js with its own minimal node_modules,
# so nothing is installed in this stage.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3002) + '/', (r) => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
