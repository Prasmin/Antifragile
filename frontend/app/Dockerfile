# =========================================
# Stage 1: Build the Next.js Application
# =========================================

# ARG declares a build-time variable. It can be overridden with:
#   docker build --build-arg NODE_VERSION=22.0.0-alpine3.21 .
# Using Alpine keeps the image small (~50 MB vs ~200 MB for Debian slim).
ARG NODE_VERSION=22.14.0-alpine3.21

# Build-time args for NEXT_PUBLIC_ variables — these must be available
# during `next build` as they are inlined into the client-side JS bundle.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY

# FROM sets the base image for this stage.
# "AS builder" names this stage so Stage 2 can copy from it.
FROM node:${NODE_VERSION} AS builder

# ENV sets an environment variable that persists inside the container.
# PNPM_HOME tells corepack/pnpm where to install its binary shims.
ENV PNPM_HOME="/pnpm"
# PATH is the standard OS search path for executables.
# Prepending PNPM_HOME ensures "pnpm" is found after corepack installs it.
ENV PATH="$PNPM_HOME:$PATH"

# RUN executes a shell command and commits the result as a new image layer.
# corepack is bundled with Node >= 16 and manages pnpm/yarn versions.
RUN corepack enable

# WORKDIR sets (and creates) the current working directory for all subsequent
# RUN / COPY / CMD instructions. Prefer over "RUN mkdir && cd".
WORKDIR /app

# COPY <src> <dest> transfers files from the build context (your host machine)
# into the image. Copying manifests first means Docker can re-use the cached
# "pnpm install" layer as long as these files don't change.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# --mount=type=cache keeps the pnpm content-addressable store between builds,
# so unchanged packages are never re-downloaded.
# --frozen-lockfile refuses to proceed if pnpm-lock.yaml is out of date,
# guaranteeing the exact same dependency tree every build.
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the full source only after installing deps to maximise cache hits.
COPY . .

# Re-declare ARGs after FROM so they are in scope for this build stage.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY

# Run the Next.js production build. Because next.config.ts has
# output: 'standalone', this emits a self-contained server bundle at
# .next/standalone/server.js — no pnpm needed at runtime.
RUN pnpm run build

# =========================================
# Stage 2: Run the Next.js Server
# =========================================

# A fresh FROM discards every build tool, dev dependency, and source file
# from Stage 1. Only the files explicitly COPY'd below make it into the
# final image, making it lean and reducing the attack surface.
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# NODE_ENV=production tells Next.js (and any library that checks it) to
# disable dev-only code paths, enable optimisations, etc.
ENV NODE_ENV=production

# Create the non-root user/group BEFORE copying files so that the
# --chown flag below can reference the names rather than raw UIDs.
# Running as root inside a container is a security risk; if the app is
# ever exploited, an attacker would have root inside the container.
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# COPY --from=<stage> pulls files from a named stage, not from the host.
# --chown=<user>:<group> sets ownership atomically — more efficient than a
# separate RUN chown which would double the layer size.
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

# Switch to the non-root user. All subsequent instructions and the final
# process run as this user.
USER nextjs

# EXPOSE is documentation — it does NOT publish the port. The actual
# port binding happens in "docker run -p 3000:3000" or compose.yaml.
EXPOSE 3000

# These ENV vars are read by Next.js standalone server at startup.
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# HEALTHCHECK tells Docker (and orchestrators like Kubernetes / Compose)
# how to test whether the container is healthy and ready for traffic.
# --start-period gives the app time to boot before checks begin.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

# CMD defines the default process to run when the container starts.
# Use the exec form (JSON array) — it runs the process directly without a
# shell, so signals (SIGTERM for graceful shutdown) reach the process.
# "node server.js" is the standalone entry point emitted by Next.js.
CMD ["node", "server.js"]