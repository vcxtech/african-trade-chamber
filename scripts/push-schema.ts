/**
 * Apply Payload schema changes non-interactively (defaults = create, not rename).
 * Run once before migrate:team-taxonomies when dev prompts block automation.
 *
 * Usage: npm run push:schema
 */

import './load-env.js'
import { requireEnv } from './load-env.js'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function main() {
  requireEnv('DATABASE_URI')
  requireEnv('PAYLOAD_SECRET')

  await new Promise<void>((resolve, reject) => {
    const child = spawn('npx tsx scripts/push-schema-once.ts', {
      cwd: ROOT,
      shell: true,
      env: {
        ...process.env,
        PAYLOAD_DB_PUSH: 'true',
        NODE_OPTIONS: '--no-deprecation',
      },
      stdio: ['pipe', 'inherit', 'inherit'],
    })

    const timer = setInterval(() => {
      child.stdin.write('\n')
    }, 2000)

    child.on('error', reject)
    child.on('close', (code) => {
      clearInterval(timer)
      if (code === 0) resolve()
      else reject(new Error(`Schema push exited with code ${code}`))
    })

    setTimeout(() => {
      clearInterval(timer)
      try {
        child.stdin.end()
      } catch {
        /* ignore */
      }
    }, 180_000)
  })

  console.log('Schema push finished.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
