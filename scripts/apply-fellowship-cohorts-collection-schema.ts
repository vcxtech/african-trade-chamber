/**
 * Create fellowship_cohorts collection tables via SQL (no interactive Drizzle prompts).
 *
 * Usage: npm run apply:fellowship-cohorts-schema
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
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_fellowship_cohorts_cohort_year AS ENUM ('2025', '2026');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  if (!(await tableExists(client, 'fellowship_cohorts'))) {
    await client.query(`
      CREATE TABLE fellowship_cohorts (
        id serial PRIMARY KEY,
        cohort_year enum_fellowship_cohorts_cohort_year NOT NULL,
        year_label varchar NOT NULL,
        title varchar NOT NULL,
        description varchar NOT NULL,
        image_id integer REFERENCES media(id) ON DELETE SET NULL,
        image_alt varchar,
        image_url varchar,
        explore_url varchar,
        explore_external boolean DEFAULT false,
        page_hero_title varchar NOT NULL,
        page_hero_subtitle varchar NOT NULL,
        page_hero_image_id integer REFERENCES media(id) ON DELETE SET NULL,
        page_hero_image_alt varchar,
        page_hero_image_url varchar,
        seo_title varchar NOT NULL,
        seo_description varchar NOT NULL,
        show_testimonials boolean DEFAULT true,
        fellow_testimonials_title varchar,
        fellow_testimonials_intro varchar,
        resource_testimonials_title varchar,
        resource_testimonials_intro varchar,
        updated_at timestamptz(3) NOT NULL DEFAULT now(),
        created_at timestamptz(3) NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX fellowship_cohorts_cohort_year_idx ON fellowship_cohorts(cohort_year);
      CREATE INDEX fellowship_cohorts_created_at_idx ON fellowship_cohorts(created_at);
      CREATE INDEX fellowship_cohorts_updated_at_idx ON fellowship_cohorts(updated_at);
      CREATE INDEX fellowship_cohorts_image_id_idx ON fellowship_cohorts(image_id);
      CREATE INDEX fellowship_cohorts_page_hero_image_id_idx ON fellowship_cohorts(page_hero_image_id);
    `)
  }

  if (!(await tableExists(client, 'fellowship_cohorts_fellow_testimonials'))) {
    await client.query(`
      CREATE TABLE fellowship_cohorts_fellow_testimonials (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES fellowship_cohorts(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        quote varchar NOT NULL,
        name varchar NOT NULL,
        subtitle varchar NOT NULL,
        initials varchar NOT NULL
      );
      CREATE INDEX fellowship_cohorts_fellow_testimonials_order_idx
        ON fellowship_cohorts_fellow_testimonials (_order);
      CREATE INDEX fellowship_cohorts_fellow_testimonials_parent_id_idx
        ON fellowship_cohorts_fellow_testimonials (_parent_id);
    `)
  }

  if (!(await tableExists(client, 'fellowship_cohorts_resource_testimonials'))) {
    await client.query(`
      CREATE TABLE fellowship_cohorts_resource_testimonials (
        _order integer NOT NULL,
        _parent_id integer NOT NULL REFERENCES fellowship_cohorts(id) ON DELETE CASCADE,
        id varchar PRIMARY KEY,
        quote varchar NOT NULL,
        name varchar NOT NULL,
        role varchar NOT NULL,
        organization varchar
      );
      CREATE INDEX fellowship_cohorts_resource_testimonials_order_idx
        ON fellowship_cohorts_resource_testimonials (_order);
      CREATE INDEX fellowship_cohorts_resource_testimonials_parent_id_idx
        ON fellowship_cohorts_resource_testimonials (_parent_id);
    `)
  }

  if (!(await columnExists(client, 'payload_locked_documents_rels', 'fellowship_cohorts_id'))) {
    await client.query(`
      ALTER TABLE payload_locked_documents_rels
        ADD COLUMN fellowship_cohorts_id integer REFERENCES fellowship_cohorts(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_fellowship_cohorts_id_idx
        ON payload_locked_documents_rels(fellowship_cohorts_id);
    `)
  }
}

async function main() {
  requireEnv('DATABASE_URI')
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  try {
    await applySchema(client)
    console.log('Fellowship cohorts collection schema applied.')
  } finally {
    await client.end()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
