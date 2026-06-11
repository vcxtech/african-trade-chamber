# Coolify deployment guide

## Prerequisites

- GitHub repository with this project
- Coolify instance with Docker support
- PostgreSQL (Coolify database service named `atc-postgres`)

## 1. Create PostgreSQL

In Coolify, add a **PostgreSQL** resource named `atc-postgres`:

| Field | Example |
|-------|---------|
| Username | `atc` |
| Initial Database | `atc_website` |
| Password | (strong password — save it) |
| Ports Mappings | leave empty (internal only) |
| Make it publicly available | unchecked |

Copy the **Postgres URL (internal)** from the database config page.

## 2. Create application

1. **New Resource** → Application → GitHub → select repo
2. **Build pack:** Dockerfile (root `Dockerfile`)
3. **Port:** `3000`
4. **Health check:** `/` (HTTP 200)

## 3. Environment variables

Add these in the app **Environment Variables** section. See [`coolify.env.example`](../coolify.env.example) for a copy-paste template.

| Key | Required | Example |
|-----|----------|---------|
| `DATABASE_URI` | Yes | `postgresql://atc:PASSWORD@atc-postgres:5432/atc_website` |
| `PAYLOAD_SECRET` | Yes | 32+ char random string |
| `NEXT_PUBLIC_SERVER_URL` | Yes | `http://your-app.sslip.io` (must match the URL in your browser exactly) |
| `PAYLOAD_SERVER_URL` | Recommended | Same as `NEXT_PUBLIC_SERVER_URL` — used at runtime for Payload auth cookies (avoids build-time URL mismatch) |
| `AUTO_SEED` | Yes | `true` (runs seed on every container start; idempotent) |
| `SEED_ADMIN_EMAIL` | **Yes** | `admin@africantradechamber.org` — required when `AUTO_SEED=true` |
| `SEED_ADMIN_PASSWORD` | **Yes** | strong admin login password — required when `AUTO_SEED=true` |

**Never commit real passwords to git.** Set secrets only in Coolify.

**Password tip:** Avoid apostrophes (`'`) and quotes in `SEED_ADMIN_PASSWORD`. Do not wrap the value in quotes in Coolify — enter `AtcAdmin2026Secure` not `"AtcAdmin2026Secure"`. On deploy, seed logs must show `(login verified, password length 18)` for that example — if length is 20, Coolify stored extra quote characters.

**Variable names are case-sensitive.** Use exactly `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (all uppercase). `seed_admin_email` will not work.

## 4. Deploy

1. Push to `main`
2. Coolify builds via Dockerfile
3. On each deploy/start, the container:
   - Runs `npm run seed` logic (creates DB schema + default content + admin user if missing)
   - Starts the Next.js server on port 3000
4. Open `YOUR_URL/admin` and log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

New CMS users are created only by logged-in administrators (Admin → Users). Public self-registration is disabled.

To skip seeding on a deploy, set `AUTO_SEED=false`.

## 5. Staging → production

- Run staging on a subdomain first (e.g. `staging.africantradechamber.org`)
- Verify redirects in `next.config.mjs`
- Point production DNS to Coolify when ready; keep WordPress live until cutover
- Update `NEXT_PUBLIC_SERVER_URL` to production URL and redeploy

## 6. GitHub integration

Coolify webhooks redeploy on push. No extra CI required for basic deploys.

## Troubleshooting

- **Build fails:** Ensure Node 20 in Dockerfile (already set)
- **Admin 500 / `users does not exist`:** Check `DATABASE_URI` points to `atc-postgres` and redeploy (seed runs on start)
- **Seed skipped in logs:** `DATABASE_URI` or `PAYLOAD_SECRET` missing in Coolify env vars
- **Seed fails / tables missing:** Seed runs with `NODE_ENV=development` so Payload can push schema (push is disabled in production). Check Postgres connectivity.
- **`/admin/create-first-user` or "Admin access is restricted":** No admin user in the database. Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in Coolify and redeploy. Check logs for `Created admin user`.
- **Deploy fails at seed:** With `AUTO_SEED=true`, both `SEED_ADMIN_*` variables are required — add them and redeploy.
- **Admin login 401 after deploy:** Check seed logs for `(login verified, password length N)`. If you set `AtcAdmin2026Secure`, N must be **18**. If N is 20, Coolify stored extra characters — delete `SEED_ADMIN_PASSWORD`, re-type the value manually (no paste), save, redeploy.
- **Login page reloads with no dashboard:** Set `PAYLOAD_SERVER_URL` to the exact URL in your browser (same as `NEXT_PUBLIC_SERVER_URL`), e.g. `http://hdvom1zh14kizajj1r3qbfa4.31.97.57.75.sslip.io`, then redeploy.
- **Images broken:** Migrate media to Payload over time; `/uploads/` files are not in the repo by default
- **Duplicate failed postgres:** Delete the red database resource; keep only `atc-postgres`
