#!/bin/sh
set -e

if [ "${AUTO_SEED:-true}" = "true" ]; then
  if [ -n "$DATABASE_URI" ] && [ -n "$PAYLOAD_SECRET" ]; then
    echo "Running database seed (AUTO_SEED=true)..."
    # Payload only runs Drizzle schema push in development mode (not production).
    NODE_ENV=development PAYLOAD_DB_PUSH=true NODE_OPTIONS=--no-deprecation ./node_modules/.bin/tsx --tsconfig tsconfig.seed.json scripts/seed.ts || {
      echo "Error: database seed failed. Check DATABASE_URI and logs above."
      exit 1
    }
  else
    echo "Skipping seed: DATABASE_URI or PAYLOAD_SECRET is not set."
  fi
else
  echo "Skipping seed: AUTO_SEED is not true."
fi

exec node server.js
