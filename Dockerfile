FROM node:current-alpine AS base

FROM base AS deps
WORKDIR /web
COPY package.json package-lock.json ./
RUN npx next telemetry disable
RUN npm ci

FROM base AS builder
WORKDIR /web
COPY --from=deps /web/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /web
COPY --from=builder /web/.next/standalone ./
COPY --from=builder /web/.next/static ./.next/static
COPY --from=builder /web/public ./public
RUN npm prune --omit=dev

ENV PORT=3000

CMD ["node", "server.js"]