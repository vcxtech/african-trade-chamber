#!/bin/sh
set -e

if [ "${AUTO_SEED:-true}" = "true" ]; then
  if [ -n "$DATABASE_URI" ] && [ -n "$PAYLOAD_SECRET" ]; then
    if [ -z "$SEED_ADMIN_EMAIL" ] || [ -z "$SEED_ADMIN_PASSWORD" ]; then
      echo "Error: AUTO_SEED=true requires SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD."
      echo "Add both in Coolify → Application → Environment Variables, then redeploy."
      exit 1
    fi
    echo "Running database seed (AUTO_SEED=true)..."
    echo "SEED_ADMIN_PASSWORD shell length: ${#SEED_ADMIN_PASSWORD}"
    echo "PAYLOAD_SERVER_URL=${PAYLOAD_SERVER_URL:-<unset>}"
    echo "NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL:-<unset>}"
    # Payload only runs Drizzle schema push in development mode (not production).
    AUTO_SEED="${AUTO_SEED:-true}" NODE_ENV=development PAYLOAD_DB_PUSH=true NODE_OPTIONS=--no-deprecation ./node_modules/.bin/tsx --tsconfig tsconfig.seed.json scripts/seed.ts || {
      echo "Error: database seed failed. See logs above (often missing SEED_ADMIN_* or DATABASE_URI)."
      exit 1
    }
    echo "Verifying admin login in production mode..."
    NODE_ENV=production PAYLOAD_DB_PUSH=false NODE_OPTIONS=--no-deprecation ./node_modules/.bin/tsx --tsconfig tsconfig.seed.json scripts/verify-prod-admin-login.ts || {
      echo "Error: production-mode admin login check failed. Fix SEED_ADMIN_* in Coolify (no surrounding quotes) and redeploy."
      exit 1
    }
  else
    echo "Skipping seed: DATABASE_URI or PAYLOAD_SECRET is not set."
  fi
else
  echo "Skipping seed: AUTO_SEED is not true."
fi

exec node server.js
