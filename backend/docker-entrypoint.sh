#!/bin/sh
set -e

echo "[Entrypoint] Pushing database schema to PostgreSQL..."
npx prisma db push --skip-generate

echo "[Entrypoint] Running database seed..."
node prisma/seed.js || echo "[Entrypoint] Seed already applied or failed gracefully."

echo "[Entrypoint] Starting application..."
exec "$@"
