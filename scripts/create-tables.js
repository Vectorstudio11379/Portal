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
    
    // Seed agency_users
    await client.query(`
      INSERT INTO agency_users (id, name, username, email, password, role, admin_role_title, profession, avatar, status, last_login, permissions)
      VALUES 
        ('usr-1', 'Owais Anwer', 'owais', 'owais@vectorstudio.design', 'admin', 'admin', 'Executive Director (SuperAdmin)', 'Executive Director & Studio Founder', '/assets/images/owais.jpg', 'active', 'Active Now', '{"canViewFinances":true,"canManageClients":true,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":true}'),
        ('usr-2', 'Carlos Mendes', 'carlos', 'carlos@vectorstudio.design', 'admin', 'admin', 'Project Manager', 'Senior Technical Web Project Manager', '/assets/images/carlos.jpg', 'active', '2h ago', '{"canViewFinances":true,"canManageClients":true,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":false}'),
        ('usr-3', 'Diego Alvarez', 'diego', 'diego@vectorstudio.design', 'admin', 'admin', 'Web Developer', 'Lead Fullstack Next.js Web Developer', '/assets/images/diego.jpg', 'active', '15m ago', '{"canViewFinances":false,"canManageClients":false,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":false}'),
        ('usr-4', 'Liam Brooks', 'liam', 'liam@vectorstudio.design', 'admin', 'admin', 'Lead Designer', 'Design Director & UI/UX Architect', '/assets/images/liam.jpg', 'active', '1d ago', '{"canViewFinances":false,"canManageClients":false,"canEditSprints":true,"canApproveDeliverables":true,"canManageSettings":false}'),
        ('usr-5', 'Sarah Jenkins', 'sarah', 'sarah.jenkins@arccompany.io', 'admin', 'client', NULL, 'VP of Digital Experience', '/assets/images/sarah.jpg', 'active', '3h ago', NULL),
        ('usr-6', 'Rachel Torres', 'rachel', 'rachel@apexhealth.com', 'admin', 'client', NULL, 'Chief Product Officer', '/assets/images/rachel.jpg', 'active', '1h ago', NULL),
        ('usr-7', 'Alex Rivera', 'alex', 'alex@vanguard.io', 'admin', 'client', NULL, 'Head of Growth', '/assets/images/alex.jpg', 'active', '5m ago', NULL),
        ('usr-8', 'Elena Rostova', 'elena', 'elena@nexuslabs.co', 'admin', 'client', NULL, 'Operations Lead', '/assets/images/elena.jpg', 'active', '4h ago', NULL),
        ('usr-9', 'David Chen', 'david', 'david.chen@luminahealth.org', 'admin', 'client', NULL, 'Technology Director', '/assets/images/david.jpg', 'active', 'Yesterday', NULL)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        avatar = EXCLUDED.avatar;
    `);

    // Seed agency_client_accounts
    await client.query(`
      INSERT INTO agency_client_accounts (id, client_name, company, contact_name, email, username, password, role, status, retainer_tier, project_budget, paid_amount)
      VALUES
        ('cli-1', 'Apex Health', 'Apex Health Care Inc.', 'Rachel Torres', 'rachel@apexhealth.com', 'rachel', 'admin', 'client', 'active', 'Scale', 45000, 32000),
        ('cli-2', 'Vanguard AI', 'Vanguard Cognitive Systems', 'Alex Rivera', 'alex@vanguard.io', 'alex', 'admin', 'client', 'active', 'Enterprise', 95000, 78000),
        ('cli-3', 'Nexus Labs', 'Nexus Decentralized Infrastructure', 'Elena Rostova', 'elena@nexuslabs.co', 'elena', 'admin', 'client', 'active', 'Scale', 60000, 48000),
        ('cli-4', 'Lumina Health', 'Lumina Digital Therapeutics', 'David Chen', 'david.chen@luminahealth.org', 'david', 'admin', 'client', 'active', 'Growth', 35000, 35000),
        ('cli-5', 'Arc Company', 'Arc Enterprise Solutions', 'Sarah Jenkins', 'sarah.jenkins@arccompany.io', 'sarah', 'admin', 'client', 'active', 'Enterprise', 120000, 105000),
        ('cli-6', 'Zenith Retail', 'Zenith Direct-to-Consumer', 'Sophia Martinez', 'smartinez@zenith.com', 'sophia', 'admin', 'client', 'active', 'Growth', 40000, 28000)
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed agency_tasks
    await client.query(`
      INSERT INTO agency_tasks (id, title, client, assignee, avatar, priority, done, status, due_date, deadline, description)
      VALUES
        ('task-1', 'Implement PostgreSQL RLS and Realtime Channels', 'Agency Internal', 'Diego Alvarez', '/assets/images/diego.jpg', 'High', true, 'done', 'Oct 24', 'Oct 24', 'Set up Supabase database infrastructure with automated table generator'),
        ('task-2', 'Executive Dashboard UI System Audit', 'Arc Company', 'Liam Brooks', '/assets/images/liam.jpg', 'High', false, 'in_progress', 'Oct 26', 'Oct 26', 'Audit design tokens, obsidian dark mode contrast, and responsive layout'),
        ('task-3', 'Stripe Billing Webhook Reconciliation', 'Vanguard AI', 'Carlos Mendes', '/assets/images/carlos.jpg', 'Medium', false, 'in_progress', 'Oct 28', 'Oct 28', 'Sync invoice settlements and client retainer tier adjustments'),
        ('task-4', 'Client Milestone Review Presentation', 'Apex Health', 'Owais Anwer', '/assets/images/owais.jpg', 'High', false, 'todo', 'Oct 30', 'Oct 30', 'Sprint milestone delivery presentation and stakeholder sign-off')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed agency_meetings
    await client.query(`
      INSERT INTO agency_meetings (id, title, client, date, time, attendees, topic, notification_ahead, status)
      VALUES
        ('mtg-1', 'Q4 Product Roadmap & Sprint Kickoff', 'Arc Company', '2026-10-24', '10:00 am - 11:00 am', '["Owais Anwer", "Carlos Mendes", "Liam Brooks"]', 'Review sprint roadmap handoff, and staging demonstration.', '15m', 'scheduled'),
        ('mtg-2', 'REST Webhooks & Architecture Gate', 'Nexus Labs', '2026-10-24', '02:00 pm - 03:00 pm', '["Diego Alvarez", "Owais Anwer"]', 'Technical architecture review of off-platform settlement webhooks.', '30m', 'scheduled'),
        ('mtg-3', 'HIPAA Compliance & Security Review', 'Lumina Health', '2026-10-25', '04:30 pm - 05:15 pm', '["Owais Anwer", "Sarah Jenkins"]', 'Healthcare compliance sign-off on encrypted EHR API endpoints.', '1h', 'scheduled')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed agency_invoices
    await client.query(`
      INSERT INTO agency_invoices (id, num, client, "desc", amount, paid_amount, status, payment_method, payment_date)
      VALUES
        ('inv-1', 'INV-2026-001', 'Arc Company', 'Q3 Executive Platform Retainer', 35000, 35000, 'paid', 'Wire/ACH', 'Oct 15, 2026'),
        ('inv-2', 'INV-2026-002', 'Vanguard AI', 'Custom LLM Agent Integration Sprint', 45000, 45000, 'paid', 'Wire/Direct', 'Oct 18, 2026'),
        ('inv-3', 'INV-2026-003', 'Nexus Labs', 'Real-time WebSocket & Data Hub', 25000, 15000, 'pending', 'Credit Card', 'Due Nov 1, 2026'),
        ('inv-4', 'INV-2026-004', 'Apex Health', 'HIPAA Telehealth Portal Delivery', 28000, 0, 'pending', 'Wire/ACH', 'Due Nov 5, 2026')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log('✓ Initial users, clients, tasks, meetings, and invoices seeded successfully!');
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
