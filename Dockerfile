# Step 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests and install all dependencies
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src

# Build the Astro server production bundle
RUN npm run build

# Step 2: Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copy package manifests and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built server bundle from builder stage
COPY --from=builder /app/dist ./dist

# Copy content directory for runtime Markdown reading/writing
COPY --from=builder /app/src/content ./src/content

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
