/**
 * Apply team taxonomy schema via SQL (no interactive Drizzle prompts), seed data,
 * migrate legacy category/country/cohort values, then finalize columns.
 *
 * Usage: npm run apply:team-schema
 */

import './load-env.js'
import pg from 'pg'
import { requireEnv } from './load-env.js'
import {
  FELLOW_COUNTRY_SEEDS,
  TEAM_CATEGORY_SEEDS,
  countryNameToSlug,
  normalizeCountryKey,
  resolveCountrySeedName,
} from '../src/lib/team-taxonomy-seeds'

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

async function applyPhase1(client: pg.Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS team_member_categories (
      id serial PRIMARY KEY,
      name varchar NOT NULL,
      slug varchar NOT NULL,
      show_on_about boolean DEFAULT false,
      is_fellow boolean DEFAULT false,
      sort_order numeric DEFAULT 0,
      updated_at timestamptz(3) NOT NULL DEFAULT now(),
      created_at timestamptz(3) NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS team_member_categories_slug_idx ON team_member_categories(slug);
    CREATE INDEX IF NOT EXISTS team_member_categories_created_at_idx ON team_member_categories(created_at);
    CREATE INDEX IF NOT EXISTS team_member_categories_updated_at_idx ON team_member_categories(updated_at);

    CREATE TABLE IF NOT EXISTS fellow_countries (
      id serial PRIMARY KEY,
      name varchar NOT NULL,
      slug varchar NOT NULL,
      sort_order numeric DEFAULT 0,
      updated_at timestamptz(3) NOT NULL DEFAULT now(),
      created_at timestamptz(3) NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS fellow_countries_slug_idx ON fellow_countries(slug);
    CREATE INDEX IF NOT EXISTS fellow_countries_created_at_idx ON fellow_countries(created_at);
    CREATE INDEX IF NOT EXISTS fellow_countries_updated_at_idx ON fellow_countries(updated_at);

    DO $$ BEGIN
      CREATE TYPE enum_team_members_cohort_year AS ENUM ('2025', '2026');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `)

  if (!(await columnExists(client, 'team_members', 'category_id'))) {
    await client.query(`
      ALTER TABLE team_members
        ADD COLUMN category_id integer REFERENCES team_member_categories(id) ON DELETE SET NULL;
      CREATE INDEX IF NOT EXISTS team_members_category_id_idx ON team_members(category_id);
    `)
  }

  if (!(await columnExists(client, 'team_members', 'country_id'))) {
    await client.query(`
      ALTER TABLE team_members
        ADD COLUMN country_id integer REFERENCES fellow_countries(id) ON DELETE SET NULL;
      CREATE INDEX IF NOT EXISTS team_members_country_id_idx ON team_members(country_id);
    `)
  }

  if (!(await columnExists(client, 'payload_locked_documents_rels', 'team_member_categories_id'))) {
    await client.query(`
      ALTER TABLE payload_locked_documents_rels
        ADD COLUMN team_member_categories_id integer REFERENCES team_member_categories(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_team_member_categories_id_idx
        ON payload_locked_documents_rels(team_member_categories_id);
    `)
  }

  if (!(await columnExists(client, 'payload_locked_documents_rels', 'fellow_countries_id'))) {
    await client.query(`
      ALTER TABLE payload_locked_documents_rels
        ADD COLUMN fellow_countries_id integer REFERENCES fellow_countries(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_fellow_countries_id_idx
        ON payload_locked_documents_rels(fellow_countries_id);
    `)
  }
}

async function seedTaxonomies(client: pg.Client) {
  for (const row of TEAM_CATEGORY_SEEDS) {
    await client.query(
      `INSERT INTO team_member_categories (name, slug, show_on_about, is_fellow, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         show_on_about = EXCLUDED.show_on_about,
         is_fellow = EXCLUDED.is_fellow,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()`,
      [row.name, row.slug, row.showOnAbout, row.isFellow, row.sortOrder],
    )
  }

  for (const row of FELLOW_COUNTRY_SEEDS) {
    const slug = countryNameToSlug(row.name)
    await client.query(
      `INSERT INTO fellow_countries (name, slug, sort_order)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()`,
      [row.name, slug, row.sortOrder],
    )
  }
}

async function migrateMemberData(client: pg.Client) {
  const hasLegacyCategory = await columnExists(client, 'team_members', 'category')

  if (hasLegacyCategory) {
    const result = await client.query(`
      UPDATE team_members tm
      SET category_id = c.id
      FROM team_member_categories c
      WHERE tm.category_id IS NULL
        AND c.slug = tm.category::text
    `)
    console.log(`Mapped category_id for ${result.rowCount ?? 0} members from legacy enum`)
  }

  const fellows = await client.query<{ id: number; country: string | null }>(
    `SELECT tm.id, tm.country
     FROM team_members tm
     LEFT JOIN team_member_categories c ON c.id = tm.category_id
     WHERE c.is_fellow = true OR tm.category::text = 'fellow'`,
  )

  const countries = await client.query<{ id: number; name: string }>(
    `SELECT id, name FROM fellow_countries`,
  )
  const countryByKey = new Map(
    countries.rows.map((row) => [normalizeCountryKey(row.name), row.id]),
  )

  let countryMapped = 0
  for (const row of fellows.rows) {
    if (!row.country?.trim()) continue
    const seedName = resolveCountrySeedName(row.country)
    const key = normalizeCountryKey(seedName ?? row.country)
    const countryId = countryByKey.get(key)
    if (countryId == null) {
      console.warn(`  Unmatched country for member ${row.id}: "${row.country}"`)
      continue
    }
    await client.query(`UPDATE team_members SET country_id = $1 WHERE id = $2`, [
      countryId,
      row.id,
    ])
    countryMapped++
  }
  console.log(`Mapped country_id for ${countryMapped} fellows`)

  const cohortType = await client.query(
    `SELECT data_type, udt_name FROM information_schema.columns
     WHERE table_name = 'team_members' AND column_name = 'cohort_year'`,
  )
  const cohortDataType = cohortType.rows[0]?.data_type

  if (cohortDataType === 'numeric' || cohortDataType === 'integer') {
    if (!(await columnExists(client, 'team_members', 'cohort_year_enum_tmp'))) {
      await client.query(`
        ALTER TABLE team_members ADD COLUMN cohort_year_enum_tmp enum_team_members_cohort_year;
        UPDATE team_members SET cohort_year_enum_tmp = '2025'
          WHERE cohort_year = 2025 OR cohort_year IS NULL;
        UPDATE team_members SET cohort_year_enum_tmp = '2026'
          WHERE cohort_year = 2026;
      `)
    }
  } else if (cohortDataType === 'USER-DEFINED') {
    // Already enum — normalize null fellows to 2025
    await client.query(`
      UPDATE team_members tm
      SET cohort_year = '2025'
      FROM team_member_categories c
      WHERE tm.category_id = c.id AND c.is_fellow = true AND tm.cohort_year IS NULL
    `)
  }
}

async function applyPhase2(client: pg.Client) {
  const cohortType = await client.query(
    `SELECT data_type FROM information_schema.columns
     WHERE table_name = 'team_members' AND column_name = 'cohort_year'`,
  )
  if (cohortType.rows[0]?.data_type === 'numeric' || cohortType.rows[0]?.data_type === 'integer') {
    if (await columnExists(client, 'team_members', 'cohort_year_enum_tmp')) {
      await client.query(`
        ALTER TABLE team_members DROP COLUMN cohort_year;
        ALTER TABLE team_members RENAME COLUMN cohort_year_enum_tmp TO cohort_year;
      `)
    }
  }

  await client.query(`
    UPDATE team_members SET category_id = (
      SELECT id FROM team_member_categories WHERE slug = 'board' LIMIT 1
    ) WHERE category_id IS NULL;
  `)

  if (await columnExists(client, 'team_members', 'category')) {
    await client.query(`ALTER TABLE team_members DROP COLUMN category`)
  }
  if (await columnExists(client, 'team_members', 'country')) {
    await client.query(`ALTER TABLE team_members DROP COLUMN country`)
  }

  await client.query(`
    ALTER TABLE team_members ALTER COLUMN category_id SET NOT NULL;
  `)

  await client.query(`
    DO $$ BEGIN
      DROP TYPE IF EXISTS enum_team_members_category;
    EXCEPTION WHEN dependent_objects_still_exist THEN NULL;
    END $$;
  `)
}

async function main() {
  const databaseUri = requireEnv('DATABASE_URI')
  const client = new Client({ connectionString: databaseUri })
  await client.connect()

  try {
    console.log('Phase 1: create taxonomy tables and relationship columns…')
    await applyPhase1(client)

    console.log('Seeding categories and countries…')
    await seedTaxonomies(client)

    console.log('Migrating team member relationships…')
    await migrateMemberData(client)

    console.log('Phase 2: finalize schema (drop legacy columns)…')
    await applyPhase2(client)

    const counts = await client.query(`
      SELECT
        (SELECT count(*) FROM team_member_categories) AS categories,
        (SELECT count(*) FROM fellow_countries) AS countries,
        (SELECT count(*) FROM team_members WHERE category_id IS NOT NULL) AS members
    `)
    console.log('Done:', counts.rows[0])
  } finally {
    await client.end()
  }

  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
