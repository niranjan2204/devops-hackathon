# ----------------------------------------------------
# Stage 1: Build & Compile TypeScript
# ----------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install all dependencies (including devDependencies) for build
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

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
FROM node:20-slim AS runner

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
