/**
 * Create form_attachments collection table via SQL (no interactive Drizzle prompts).
 *
 * Usage: npm run apply:form-attachments-schema
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

async function columnExists(client: pg.Client, table: string, column: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column],
  )
  return result.rowCount !== null && result.rowCount > 0
}

async function applySchema(client: pg.Client) {
  if (!(await tableExists(client, 'form_attachments'))) {
    await client.query(`
      CREATE TABLE form_attachments (
        id serial PRIMARY KEY,
        alt varchar,
        updated_at timestamptz(3) NOT NULL DEFAULT now(),
        created_at timestamptz(3) NOT NULL DEFAULT now(),
        url varchar,
        thumbnail_u_r_l varchar,
        filename varchar,
        mime_type varchar,
        filesize numeric,
        width numeric,
        height numeric,
        focal_x numeric,
        focal_y numeric
      );
      CREATE INDEX form_attachments_created_at_idx ON form_attachments(created_at);
      CREATE INDEX form_attachments_updated_at_idx ON form_attachments(updated_at);
    `)
  }

  if (!(await columnExists(client, 'payload_locked_documents_rels', 'form_attachments_id'))) {
    await client.query(`
      ALTER TABLE payload_locked_documents_rels
        ADD COLUMN form_attachments_id integer REFERENCES form_attachments(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_form_attachments_id_idx
        ON payload_locked_documents_rels(form_attachments_id);
    `)
  }
}

async function main() {
  requireEnv('DATABASE_URI')
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  try {
    await applySchema(client)
    console.log('Form attachments schema applied.')
  } finally {
    await client.end()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
