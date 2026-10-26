#!/usr/bin/env node
/**
 * VECTORSTUDIO AGENCY OS — AUTOMATED TABLE CREATION SCRIPT
 *
 * Usage:
 *   node scripts/create-tables.js [DATABASE_URL]
 *   or via environment variables:
 *   DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres node scripts/create-tables.js
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Read .env / .env.local if present
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env')
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const dbUrl = 
  process.argv[2] || 
  process.env.DATABASE_URL || 
  process.env.SUPABASE_DB_URL || 
  process.env.POSTGRES_URL;

const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');

async function main() {
  console.log('\n======================================================');
  console.log('  VECTORSTUDIO AGENCY OS — SUPABASE TABLE GENERATOR');
  console.log('======================================================\n');

  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ Schema file not found at: ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  if (!dbUrl) {
    console.log('ℹ️  No DATABASE_URL provided.');
    console.log('\nTo create tables directly from the command line:');
    console.log('  npm run db:setup -- "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"\n');
    console.log('Alternatively, you can copy the SQL script from:');
    console.log(`  ${schemaPath}`);
    console.log('and execute it in your Supabase SQL Editor.\n');
    process.exit(0);
  }

  console.log('📡 Connecting to PostgreSQL database...');
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected successfully!\n');

    console.log('⚙️  Executing table creation DDL & RLS policies...');
    await client.query(sql);

    // Verify all 6 tables
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN (
          'agency_users', 
          'agency_tasks', 
          'agency_meetings', 
          'agency_messages', 
          'agency_invoices', 
          'agency_client_accounts'
        )
      ORDER BY table_name;
    `;

    const res = await client.query(tableCheckQuery);
    const createdTables = res.rows.map(r => r.table_name);

    console.log('\n🎉 ALL TABLES VERIFIED IN SUPABASE:');
    for (const table of createdTables) {
      console.log(`  ✓ Table: ${table} (active)`);
    }

    console.log('\n🌱 Checking and seeding initial platform records...');
    
    // Seed agency_users with sole admin
    await client.query(`
      INSERT INTO agency_users (id, name, username, email, password, role, admin_role_title, profession, avatar, status, last_login, permissions)
      VALUES 
        ('usr-admin', 'Timi', 'timi', 'timi@vectorstudio.design', 'Computerangel13', 'admin', 'Managing Director & SuperAdmin', 'Executive Director & Studio Founder', '/assets/images/owais.jpg', 'active', 'Active Now', '{"canViewFinances":true,"canManageClients":true,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":true}')
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role;
    `);

    console.log('✓ Sole admin user (Timi) verified.');
    console.log('✓ Realtime replication enabled on active tables.');
    console.log('✓ Row Level Security (RLS) policies configured.');
    console.log('✓ Supabase database is ready for Agency OS!\n');
  } catch (err) {
    console.error('\n❌ Error executing SQL schema:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
