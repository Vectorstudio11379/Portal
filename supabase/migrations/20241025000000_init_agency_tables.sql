-- ==============================================================================
-- VECTORSTUDIO AGENCY OS — MIGRATION 20241025000000
-- ==============================================================================

-- 1. USERS & TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.agency_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  password TEXT DEFAULT 'admin',
  role TEXT NOT NULL DEFAULT 'client',
  admin_role_title TEXT,
  client_account TEXT,
  avatar TEXT,
  status TEXT DEFAULT 'active',
  last_login TEXT,
  profession TEXT,
  contact_address TEXT,
  whatsapp_number TEXT,
  permissions JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. TASKS & DELIVERABLES TABLE
CREATE TABLE IF NOT EXISTS public.agency_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  assignee TEXT NOT NULL,
  avatar TEXT,
  priority TEXT DEFAULT 'High',
  done BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'todo',
  due_date TEXT,
  deadline TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. CALENDAR MEETINGS & STRATEGY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.agency_meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  attendees JSONB DEFAULT '[]'::jsonb,
  topic TEXT,
  notification_ahead TEXT DEFAULT '30m',
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. REAL-TIME TEAM & CLIENT DIRECT MESSAGES
CREATE TABLE IF NOT EXISTS public.agency_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_avatar TEXT,
  recipient_id TEXT NOT NULL,
  content TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  read_status TEXT DEFAULT 'delivered',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. BILLING INVOICES & FINANCIAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.agency_invoices (
  id TEXT PRIMARY KEY,
  num TEXT NOT NULL,
  client TEXT NOT NULL,
  "desc" TEXT,
  amount NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_date TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. CLIENT ACCOUNTS & CRM TABLE
CREATE TABLE IF NOT EXISTS public.agency_client_accounts (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT,
  role TEXT DEFAULT 'client_owner',
  status TEXT DEFAULT 'active',
  retainer_tier TEXT,
  whatsapp_number TEXT,
  project_budget NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_agency_users_role ON public.agency_users(role);
CREATE INDEX IF NOT EXISTS idx_agency_users_username ON public.agency_users(username);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_client ON public.agency_tasks(client);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_assignee ON public.agency_tasks(assignee);
CREATE INDEX IF NOT EXISTS idx_agency_meetings_date ON public.agency_meetings(date);
CREATE INDEX IF NOT EXISTS idx_agency_messages_recipient ON public.agency_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_agency_messages_sender ON public.agency_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_agency_invoices_client ON public.agency_invoices(client);
CREATE INDEX IF NOT EXISTS idx_agency_clients_username ON public.agency_client_accounts(username);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.agency_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_client_accounts ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE RLS POLICIES FOR FULL PORTAL INTERACTIVITY
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_users') THEN
    CREATE POLICY "Public Access agency_users" ON public.agency_users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_tasks') THEN
    CREATE POLICY "Public Access agency_tasks" ON public.agency_tasks FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_meetings') THEN
    CREATE POLICY "Public Access agency_meetings" ON public.agency_meetings FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_messages') THEN
    CREATE POLICY "Public Access agency_messages" ON public.agency_messages FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_invoices') THEN
    CREATE POLICY "Public Access agency_invoices" ON public.agency_invoices FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access agency_client_accounts') THEN
    CREATE POLICY "Public Access agency_client_accounts" ON public.agency_client_accounts FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ENABLE REALTIME REPLICATION FOR LIVE SYNC
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_messages;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_tasks;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_meetings;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_users;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_invoices;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.agency_client_accounts;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;
