# Step 1: Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
RUN mkdir -p /app/src/content

RUN npm run build

# Step 2: Production dependencies stage (Pruned & cached)
FROM node:22-alpine AS prod-deps

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Step 3: Minimal production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

# Copy production node_modules and built application server
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src/content ./src/content

# Use non-root node user for container security
RUN chown -R node:node /app
USER node

EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
