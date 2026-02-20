FROM node:22-alpine AS base
WORKDIR /app

# Only copy package files first for better layer caching
COPY package.json package-lock.json .npmrc ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/engine/package.json ./packages/engine/
COPY packages/web/package.json ./packages/web/

# Install only needed workspaces — alpine has no GCC so pg-native is skipped automatically
RUN npm install --workspace=packages/shared --workspace=packages/engine --workspace=packages/web \
    --omit=optional --legacy-peer-deps

# Copy source files
COPY packages/shared ./packages/shared/
COPY packages/engine ./packages/engine/
COPY packages/web ./packages/web/

# Build Next.js
RUN npm run build:web

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "-w", "packages/web", "run", "start"]
