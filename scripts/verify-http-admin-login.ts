/**
 * POST /api/users/login over HTTP like the admin UI (validates CSRF + Set-Cookie path).
 * Run after the app is listening — used from docker-entrypoint background check.
 */

import { readEnv } from './lib/sanitize-env.js'

async function main() {
  const email = readEnv('SEED_ADMIN_EMAIL')
  const password = readEnv('SEED_ADMIN_PASSWORD')
  const baseUrl = (
    readEnv('PAYLOAD_SERVER_URL') ||
    readEnv('NEXT_PUBLIC_SERVER_URL') ||
    'http://127.0.0.1:3000'
  ).replace(/\/$/, '')

  if (!email || !password) {
    console.error('Missing SEED_ADMIN_* for HTTP login check.')
    process.exit(1)
  }

  // Hit the local server like Coolify's proxy would, but send the public Origin for CSRF.
  const loginUrl = 'http://127.0.0.1:3000/api/users/login'
  console.log(`HTTP admin login check → ${loginUrl} (Origin: ${baseUrl})`)

  const res = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: baseUrl,
      Referer: `${baseUrl}/admin/login`,
    },
    body: JSON.stringify({ email, password }),
  })

  const setCookie = res.headers.get('set-cookie')
  const body = await res.text()

  if (!res.ok) {
    console.error(`HTTP login failed: ${res.status} ${body.slice(0, 200)}`)
    process.exit(1)
  }

  if (!setCookie?.includes('payload-token')) {
    console.error('HTTP login returned 200 but no payload-token Set-Cookie header.')
    console.error(`Set-Cookie: ${setCookie ?? '(none)'}`)
    process.exit(1)
  }

  console.log('HTTP admin login check passed (payload-token cookie set).')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
