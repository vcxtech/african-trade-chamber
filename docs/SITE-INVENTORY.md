# ATC Site Inventory (WordPress → Next.js)

Generated from legacy HTML in `../word/` and known live routes. Update as URLs are verified on production.

## Route mapping

| Planned Next route | Legacy WP URL (typical) | Reference HTML in `word/` | Content type |
|-------------------|-------------------------|---------------------------|--------------|
| `/` | `/` | `hero-section.html`, `header before nathan'n nonsense.html`, `check (2).html` (popup) | Homepage + hero slider |
| `/about` | `/about-us/` | — | Page (CMS) |
| `/what-we-do` | `/what-we-do/` | `what-we-do.html` | Page |
| `/membership` | `/membership/` | `checks.html`, `atc-membership-1.html` | Page + categories |
| `/membership/apply` | `/membership-registration/` | — | Form / external v1 |
| `/fellowship` | `/fellowship/` | `fellowship.html` | Page |
| `/fellowship/2025` | `/future-trade-leaders-fellowship-community-2025/` | `fellowship-cohort-2025.html`, `future-trade-leaders-fellowship-2025.html` | Cohort |
| `/fellowship/2026` | TBD | `fellowship-cohort-2026.html` | Cohort |
| `/fellowship/apply` | `/2026-future-trade-leaders-fellowship-application-form/` | `future-trade-leaders-fellowship-application-2026.html` | Form |
| `/careers` | `/careers-opportunities/` | `atc-careers.html` | Jobs listing |
| `/careers/[slug]` | `/careers/...` | `job-director-*.html` (7 roles) | Job detail |
| `/news` | `/chamber-news.html` or news archive | `chamber-news.html`, `newsroom.html` | News archive |
| `/news/[slug]` | `/news/...` | — | News article |
| `/news/member` | `/member-news.html` | `member-news.html` | News category |
| `/news/press` | `/press-releases.html` | `press-releases.html` | News category |
| `/events` | `/events/` | `atc-events.html`, `calendar-of-events.html` | Events |
| `/insights` | `/insights/` | `atc-insights.html` | Page |
| `/get-involved` | `/get-involved/` | `atc-get-involved.html` | Page |
| `/partnerships` | `/partnerships/` | `atc-partnership.html` | Page |
| `/donate` | `/donate/` | `atc-donate.html` | Page + form |
| `/volunteer` | `/volunteer/` | `atc-volunteer-form.html` | Form |
| `/trade-missions` | `/trade-missions-investment-events/` | `trade-missions-investment.html` | Page |
| `/councils/[slug]` | Various council pages | `women Entrepreneurs council.html`, `Research and policy council.html`, etc. | Council |

## WordPress plugin → app feature

| Legacy | New implementation |
|--------|-------------------|
| `atc-news-posts` CPT | Payload `news` collection |
| Theme menus / footer | Payload `site-settings` global |
| Page builder HTML wrappers | Payload `pages` + React sections |
| Media `wp-content/uploads` | Payload `media` + migration script |

## Job slugs (from reference files)

- `director-memberships`
- `director-partnerships`
- `director-programs-sector-platforms`
- `director-events-strategic-convenings`
- `director-trade-investment-facilitation`
- `director-policy-strategic-intelligence`
- `director-communications-institutional-engagement`

## Priority build order

1. Homepage (hero + popup)
2. Membership
3. News list + article
4. Fellowship
5. Careers
6. Remaining pages
