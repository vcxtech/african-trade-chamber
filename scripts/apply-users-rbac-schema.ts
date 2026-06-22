/**
 * Apply users RBAC fields (contentAreas) without interactive Drizzle prompts.
 *
 * Usage: npm run apply:users-rbac-schema
 */

import './load-env.js'
import pg from 'pg'
import { requireEnv } from './load-env.js'

const { Client } = pg

async function tableExists(client: pg.Client, table: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [table],
  )
  return result.rowCount !== null && result.rowCount > 0
}

async function applySchema(client: pg.Client) {
  const migrated = await client.query(`
    UPDATE users SET role = 'editor' WHERE role = 'viewer'
  `)
  console.log(`Migrated ${migrated.rowCount ?? 0} viewer user(s) to editor`)

  if (!(await tableExists(client, 'users_content_areas'))) {
    await client.query(`
      CREATE TABLE users_content_areas (
        id serial PRIMARY KEY,
        parent_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        value varchar,
        "order" integer NOT NULL
      );
      CREATE INDEX users_content_areas_parent_idx ON users_content_areas(parent_id);
      CREATE INDEX users_content_areas_order_idx ON users_content_areas("order");
    `)
    console.log('Created users_content_areas table')
  } else {
    console.log('users_content_areas already exists')
  }
}

async function main() {
  requireEnv('DATABASE_URI')
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  try {
    await applySchema(client)
    console.log('Users RBAC schema applied.')
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
