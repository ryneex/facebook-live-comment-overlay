FROM node:24-alpine AS base

# builder
FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/ ./apps/
COPY packages/ ./packages/

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile


RUN pnpm build

# runner
FROM base AS runner

WORKDIR /app

COPY --from=builder /app/apps/server/dist/ ./

CMD ["node", "index.js"]