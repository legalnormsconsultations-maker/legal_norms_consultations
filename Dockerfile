# Syntax: docker/dockerfile:1
# 
# Billion-User Scale Architecture: Stateless Container
# This Dockerfile is optimized for high-density, horizontal scaling on platforms 
# like Kubernetes (EKS/GKE) or AWS ECS. It strictly avoids local filesystem persistence.

FROM node:20-alpine AS base

# Step 1: Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm for deterministic, fast builds
RUN corepack enable pnpm

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# Step 2: Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry is disabled during the build to prevent network hangs
ENV NEXT_TELEMETRY_DISABLED 1

# Production build (Must configure Next.js output to "standalone" in next.config.ts)
RUN pnpm build

# Step 3: Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Run the container as a non-root user to increase container security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets (served by edge/CDN ideally, but fallback here)
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Note: We execute server.js directly. This bypasses the heavy Next.js CLI
# and optimizes memory usage per container instance, allowing maximum density.
CMD ["node", "server.js"]
