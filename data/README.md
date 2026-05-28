# WordPress export data

Place your WordPress export file here:

- **Path:** `data/wp-export.xml` or any `data/*.xml` (newest file is used automatically)
- **Example:** `data/africantradechamber.WordPress.2026-05-26.xml`
- **How:** WordPress Admin → Tools → Export → News (or All content)

Optional explicit path:

```bash
npm run migrate:news -- data/africantradechamber.WordPress.2026-05-26.xml
```

Then run (after `npm run seed` if you use defaults — **run migrations after seed** so insight seed does not overwrite imported posts):

```bash
docker compose up -d postgres
npm run seed
npm run migrate:news -- data/africantradechamber.WordPress.2026-05-26.xml
npm run migrate:insights -- data/africantradechamber.WordPress.2026-05-26.xml
npm run migrate:team -- data/africantradechamber.WordPress.2026-05-26.xml
npm run generate:redirects -- data/africantradechamber.WordPress.2026-05-26.xml
```

Posts appear on http://localhost:3002/news

## Team members (About page)

Export must include **TeamPress** members (`post_type: ex_team`). Use **All content** export.

```bash
npm run migrate:team -- data/africantradechamber.WordPress.2026-05-26.xml
```

Members appear on http://localhost:3002/about

## WordPress uploads (media)

Place the `wp-content/uploads` folder here as `data/uploads/`.

Link it for Next.js static serving (run once from project root):

```powershell
cmd /c mklink /J "public\uploads" "data\uploads"
```

Images are served at `/uploads/...`. Legacy `/wp-content/uploads/...` URLs rewrite to the same path.

## Fellows (2025 cohort page)

```bash
npm run migrate:team -- data/africantradechamber.WordPress.2026-05-26.xml --fellows-only
```

## Insights publications

```bash
npm run migrate:insights -- data/africantradechamber.WordPress.2026-05-26.xml
```

## Legacy URL redirects

Generate redirects from the WordPress export (merged into `next.config.mjs`):

```bash
npm run generate:redirects -- data/africantradechamber.WordPress.2026-05-26.xml
```

