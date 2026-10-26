#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env / .env.local
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

if (!dbUrl) {
  console.error('❌ Missing database connection string in DATABASE_URL.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('⚡ Connected to Supabase PostgreSQL...');

    console.log('🧹 Clearing all test data from tables...');
    await client.query(`
      TRUNCATE TABLE public.agency_messages CASCADE;
      TRUNCATE TABLE public.agency_tasks CASCADE;
      TRUNCATE TABLE public.agency_meetings CASCADE;
      TRUNCATE TABLE public.agency_invoices CASCADE;
      TRUNCATE TABLE public.agency_client_accounts CASCADE;
      TRUNCATE TABLE public.agency_users CASCADE;
    `);

    console.log('👤 Inserting single admin user (Timi)...');
    await client.query(`
      INSERT INTO public.agency_users (
        id,
        name,
        username,
        email,
        password,
        role,
        admin_role_title,
        profession,
        avatar,
        status,
        last_login,
        permissions
      ) VALUES (
        'usr-admin',
        'Timi',
        'timi',
        'timi@vectorstudio.design',
        'Computerangel13',
        'admin',
        'Managing Director & SuperAdmin',
        'Executive Director & Studio Founder',
        '/assets/images/owais.jpg',
        'active',
        'Active Now',
        '{"canViewFinances":true,"canManageClients":true,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":true}'
      );
    `);

    console.log('\n📊 Verifying table counts in Supabase:');
    const tables = [
      'agency_users',
      'agency_client_accounts',
      'agency_tasks',
      'agency_meetings',
      'agency_invoices',
      'agency_messages'
    ];

    for (const t of tables) {
      const res = await client.query(`SELECT count(*)::int as count FROM public.${t}`);
      console.log(`  • ${t}: ${res.rows[0].count} rows`);
    }

    const adminUser = await client.query(`SELECT id, name, username, email, role, password FROM public.agency_users`);
    console.log('\n✅ Sole Admin Account in Database:');
    console.table(adminUser.rows);

  } catch (err) {
    console.error('❌ Error during reset:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
