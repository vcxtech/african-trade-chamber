#!/bin/sh
set -e

if [ -z "$NEXT_PUBLIC_SERVER_URL" ] && [ -n "$PAYLOAD_SERVER_URL" ]; then
  echo "Warning: NEXT_PUBLIC_SERVER_URL is empty; using PAYLOAD_SERVER_URL for this container run."
  export NEXT_PUBLIC_SERVER_URL="$PAYLOAD_SERVER_URL"
fi

if [ -z "$NEXT_PUBLIC_SERVER_URL" ]; then
  echo "Error: NEXT_PUBLIC_SERVER_URL is not set."
  echo "Add it in Coolify with the same value as your browser URL, enable Available at Buildtime, and redeploy."
  exit 1
fi

if [ "${AUTO_SEED:-false}" = "true" ]; then
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

if [ "${RUN_HTTP_LOGIN_CHECK:-true}" = "true" ] && [ -n "$SEED_ADMIN_EMAIL" ] && [ -n "$SEED_ADMIN_PASSWORD" ]; then
  (
    sleep 3
    node -e "
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      (async () => {
        for (let i = 0; i < 10; i++) {
          try {
            const res = await fetch('http://127.0.0.1:3000/admin/login');
            if (res.ok) return;
          } catch {}
          await wait(2000);
        }
        process.exit(1);
      })();
    " || echo "Warning: app did not become ready for HTTP login check."
    NODE_OPTIONS=--no-deprecation ./node_modules/.bin/tsx --tsconfig tsconfig.seed.json scripts/verify-http-admin-login.ts || {
      echo "Warning: HTTP admin login check failed. Confirm PAYLOAD_SERVER_URL matches your browser URL and PAYLOAD_COOKIE_SECURE=false for HTTP."
    }
  ) &
fi

exec node server.js
