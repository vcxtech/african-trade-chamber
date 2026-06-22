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
| `NEXT_PUBLIC_SERVER_URL` | **Yes** | `http://your-app.sslip.io` — must match your browser URL exactly. Enable **Available at Buildtime** (admin UI embeds this during Docker build). |
| `PAYLOAD_SERVER_URL` | **Yes** | Same URL as `NEXT_PUBLIC_SERVER_URL` — runtime Payload auth/CSRF |
| `PAYLOAD_COOKIE_SECURE` | **Yes (HTTP)** | `false` when using `http://` (sslip.io without TLS). Set `true` only if the browser URL is `https://` |
| `AUTO_SEED` | Yes | `true` (runs seed on every container start; idempotent) |
| `SEED_ADMIN_EMAIL` | **Yes** | `admin@africantradechamber.org` — required when `AUTO_SEED=true` |
| `SEED_ADMIN_PASSWORD` | **Yes** | strong admin login password — required when `AUTO_SEED=true` |
| `SMTP_HOST` | For form emails | SMTP server hostname — without this, forms save to admin but no email is sent |
| `SMTP_PORT` | For form emails | Usually `587` |
| `SMTP_USER` / `SMTP_PASS` | For form emails | SMTP credentials |
| `SMTP_FROM_ADDRESS` | For form emails | e.g. `noreply@africantradechamber.org` |
| `SMTP_FROM_NAME` | Optional | e.g. `African Trade Chamber` |
| `FORM_DEFAULT_NOTIFY_EMAIL` | Optional | Fallback inbox for form notifications (default: `info@africantradechamber.org`) |

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

**After your first successful deploy**, set `AUTO_SEED=false` in Coolify. This speeds up restarts and avoids re-running seed on every container start. Schema and content are already in Postgres.

### Persistent file storage

CMS uploads and form attachments are stored on disk inside the container:

| Path | Purpose |
|------|---------|
| `/app/media` | Site images (Payload Media collection) |
| `/app/form-attachments` | Membership application uploads |

**Without persistent volumes, uploaded files are lost when the container is redeployed.** In Coolify, add storage mounts for both paths on the application resource.

### Form email notifications

Public forms (contact, membership, SME Council, etc.) save to **Form Submissions** in admin. Staff also receive email when SMTP is configured. Add the `SMTP_*` variables from [`coolify.env.example`](../coolify.env.example). Without SMTP, check the admin panel for new submissions.

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
- **Login page reloads with no dashboard:** Password auth is OK if seed shows `login verified`. Common causes: (1) browser URL does not match env — open the exact URL from `NEXT_PUBLIC_SERVER_URL` (usually `http://your-app.sslip.io/admin`, not `https://`); (2) missing `PAYLOAD_COOKIE_SECURE=false` when using HTTP; (3) redeploy after changing `NEXT_PUBLIC_SERVER_URL` (build-time). Check deploy logs for `HTTP admin login check passed`. In DevTools → Network → login, the request must be **JSON** (`Content-Type: application/json`) — multipart form posts return 400 in production. Response headers should include `Set-Cookie: payload-token`.
- **Images broken:** Migrate media to Payload over time; `/uploads/` files are not in the repo by default
- **Duplicate failed postgres:** Delete the red database resource; keep only `atc-postgres`
