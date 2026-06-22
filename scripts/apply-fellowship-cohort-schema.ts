/**
 * Apply fellowship cohort page schema via SQL (no interactive Drizzle prompts).
 *
 * Usage: npm run apply:fellowship-schema
 */

import './load-env.js'
import pg from 'pg'
import { requireEnv } from './load-env.js'

const { Client } = pg

async function columnExists(client: pg.Client, table: string, column: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [table, column],
  )
  return result.rowCount !== null && result.rowCount > 0
}

async function tableExists(client: pg.Client, table: string): Promise<boolean> {
  const result = await client.query(
    `SELECT 1 FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = $1`,
    [table],
  )
  return result.rowCount !== null && result.rowCount > 0
}

async function applySchema(client: pg.Client) {
  await client.query(`
    DO $$ BEGIN
      CREATE TYPE enum_fellowship_page_cohorts_cohort_year AS ENUM ('2025', '2026');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  if (!(await columnExists(client, 'fellowship_page_cohorts', 'cohort_year'))) {
    await client.query(`
      ALTER TABLE fellowship_page_cohorts
        ADD COLUMN cohort_year enum_fellowship_page_cohorts_cohort_year;
    `)
  }

  const cohortColumns: Array<[string, string]> = [
    ['page_hero_title', 'varchar'],
    ['page_hero_subtitle', 'varchar'],
    ['page_hero_image_alt', 'varchar'],
    ['page_hero_image_url', 'varchar'],
    ['seo_title', 'varchar'],
    ['seo_description', 'varchar'],
    ['fellow_testimonials_title', 'varchar'],
    ['fellow_testimonials_intro', 'varchar'],
    ['resource_testimonials_title', 'varchar'],
    ['resource_testimonials_intro', 'varchar'],
  ]

  for (const [name, type] of cohortColumns) {
    if (!(await columnExists(client, 'fellowship_page_cohorts', name))) {
      await client.query(`ALTER TABLE fellowship_page_cohorts ADD COLUMN ${name} ${type};`)
    }
  }

  if (!(await columnExists(client, 'fellowship_page_cohorts', 'page_hero_image_id'))) {
    await client.query(`
      ALTER TABLE fellowship_page_cohorts
        ADD COLUMN page_hero_image_id integer REFERENCES media(id) ON DELETE SET NULL;
      CREATE INDEX IF NOT EXISTS fellowship_page_cohorts_page_hero_image_id_idx
        ON fellowship_page_cohorts(page_hero_image_id);
    `)
  }

  if (!(await columnExists(client, 'fellowship_page_cohorts', 'show_testimonials'))) {
    await client.query(`
      ALTER TABLE fellowship_page_cohorts
        ADD COLUMN show_testimonials boolean DEFAULT true;
    `)
  }

  if (!(await tableExists(client, 'fellowship_page_cohorts_fellow_testimonials'))) {
    await client.query(`
      CREATE TABLE fellowship_page_cohorts_fellow_testimonials (
        _order integer NOT NULL,
        _parent_id varchar NOT NULL,
        id varchar PRIMARY KEY,
        quote varchar NOT NULL,
        name varchar NOT NULL,
        subtitle varchar NOT NULL,
        initials varchar NOT NULL
      );
      CREATE INDEX fellowship_page_cohorts_fellow_testimonials_order_idx
        ON fellowship_page_cohorts_fellow_testimonials (_order);
      CREATE INDEX fellowship_page_cohorts_fellow_testimonials_parent_id_idx
        ON fellowship_page_cohorts_fellow_testimonials (_parent_id);
    `)
  }

  if (!(await tableExists(client, 'fellowship_page_cohorts_resource_testimonials'))) {
    await client.query(`
      CREATE TABLE fellowship_page_cohorts_resource_testimonials (
        _order integer NOT NULL,
        _parent_id varchar NOT NULL,
        id varchar PRIMARY KEY,
        quote varchar NOT NULL,
        name varchar NOT NULL,
        role varchar NOT NULL,
        organization varchar
      );
      CREATE INDEX fellowship_page_cohorts_resource_testimonials_order_idx
        ON fellowship_page_cohorts_resource_testimonials (_order);
      CREATE INDEX fellowship_page_cohorts_resource_testimonials_parent_id_idx
        ON fellowship_page_cohorts_resource_testimonials (_parent_id);
    `)
  }

  await client.query(`
    UPDATE fellowship_page_cohorts
    SET cohort_year = '2025'
    WHERE cohort_year IS NULL
      AND (explore_url LIKE '%/2025%' OR year_label LIKE '%2025%');

    UPDATE fellowship_page_cohorts
    SET cohort_year = '2026'
    WHERE cohort_year IS NULL
      AND (explore_url LIKE '%/2026%' OR year_label LIKE '%2026%');
  `)
}

async function main() {
  requireEnv('DATABASE_URI')
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  try {
    await applySchema(client)
    console.log('Fellowship cohort schema applied.')
  } finally {
    await client.end()
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
