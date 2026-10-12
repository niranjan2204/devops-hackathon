# ----------------------------------------------------
# Stage 1: Build & Compile TypeScript
# ----------------------------------------------------
# Using full node:20 (Debian Bookworm) which has OpenSSL pre-installed out of the box
FROM node:20 AS builder

WORKDIR /app

# Install all dependencies (including devDependencies) for build
COPY package*.json ./
COPY prisma ./prisma/

# Configure npm fetch retry and timeout for flaky network connections during engine downloads
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

RUN npm ci || (echo "Retrying npm ci..." && sleep 5 && npm ci)

# Generate Prisma Client for PostgreSQL
RUN npx prisma generate

# Copy source and config
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript to dist/
RUN npm run build

# ----------------------------------------------------
# Stage 2: Production Runner
# ----------------------------------------------------
FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled files and generated prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
