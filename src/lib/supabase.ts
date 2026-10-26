import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { AgencyState, AppUser, Task, MeetingItem, TeamMessage, Invoice, ClientAccount } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  lastSyncTime?: string;
}

const STORAGE_KEY_URL = 'vectorstudio_supabase_url';
const STORAGE_KEY_KEY = 'vectorstudio_supabase_anon_key';
const STORAGE_KEY_LAST_SYNC = 'vectorstudio_supabase_last_sync';

// Default / fallback environment variables if set in .env
const ENV_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const ENV_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export const getSupabaseConfig = (): SupabaseConfig => {
  if (typeof window === 'undefined') {
    return { url: ENV_URL, anonKey: ENV_KEY, isConnected: false };
  }
  const url = localStorage.getItem(STORAGE_KEY_URL) || ENV_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_KEY) || ENV_KEY;
  const lastSyncTime = localStorage.getItem(STORAGE_KEY_LAST_SYNC) || undefined;
  const isConnected = Boolean(url && anonKey && url.startsWith('http'));
  return { url, anonKey, isConnected, lastSyncTime };
};

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey, isConnected } = getSupabaseConfig();
  if (!isConnected) return null;

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: true },
      realtime: { params: { eventsPerSecond: 10 } }
    });
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const saveSupabaseConfig = (url: string, anonKey: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
  cachedClient = null;
  getSupabaseClient();
};

export const clearSupabaseConfig = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
    localStorage.removeItem(STORAGE_KEY_LAST_SYNC);
  }
  cachedClient = null;
};

/**
 * Test connectivity with the configured Supabase project
 */
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL and Anon Key are not configured yet.'
    };
  }

  const start = performance.now();
  try {
    // Ping with a lightweight metadata or health probe
    const { error } = await client.from('agency_users').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // If table does not exist yet, API is still connected!
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('not find')) {
        return {
          success: true,
          message: `Connected to Supabase project (${latencyMs}ms)! Note: Tables need to be created using the SQL script.`,
          latencyMs
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message} (Code: ${error.code})`
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase database (${latencyMs}ms)! All tables active.`,
      latencyMs
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network connection failed: ${err.message || 'Check URL and project status'}`
    };
  }
};

/**
 * Push entire agency state to Supabase tables
 */
export const pushStateToSupabase = async (state: AgencyState): Promise<{
  success: boolean;
  syncedRecords: number;
  message: string;
}> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, syncedRecords: 0, message: 'Supabase is not configured' };
  }

  try {
    let count = 0;

    // 1. Sync Users
    if (state.users?.length) {
      const usersPayload = state.users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        password: u.password || 'admin',
        role: u.role,
        admin_role_title: u.adminRoleTitle,
        client_account: u.clientAccount,
        avatar: u.avatar,
        status: u.status,
        last_login: u.lastLogin,
        profession: u.profession,
        contact_address: u.contactAddress,
        whatsapp_number: u.whatsappNumber,
        permissions: u.permissions || null
      }));
      const { error } = await client.from('agency_users').upsert(usersPayload, { onConflict: 'id' });
      if (!error) count += usersPayload.length;
    }

    // 2. Sync Tasks
    if (state.admin.tasks?.length) {
      const tasksPayload = state.admin.tasks.map(t => ({
        id: t.id,
        title: t.title,
        client: t.client,
        assignee: t.assignee,
        avatar: t.avatar,
        priority: t.priority,
        done: t.done,
        status: t.status || (t.done ? 'done' : 'in_progress'),
        due_date: t.dueDate,
        deadline: t.deadline,
        description: t.description
      }));
      const { error } = await client.from('agency_tasks').upsert(tasksPayload, { onConflict: 'id' });
      if (!error) count += tasksPayload.length;
    }

    // 3. Sync Meetings
    const meetings = state.meetings || state.admin.meetings || [];
    if (meetings.length) {
      const meetingsPayload = meetings.map(m => ({
        id: m.id,
        title: m.title,
        client: m.client,
        date: m.date,
        time: m.time,
        attendees: m.attendees,
        topic: m.topic,
        notification_ahead: m.notificationAhead,
        status: m.status
      }));
      const { error } = await client.from('agency_meetings').upsert(meetingsPayload, { onConflict: 'id' });
      if (!error) count += meetingsPayload.length;
    }

    // 4. Sync Messages
    if (state.teamMessages?.length) {
      const messagesPayload = state.teamMessages.map(msg => ({
        id: msg.id,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        sender_avatar: msg.senderAvatar,
        recipient_id: msg.recipientId,
        content: msg.content,
        timestamp: msg.timestamp,
        read_status: msg.readStatus
      }));
      const { error } = await client.from('agency_messages').upsert(messagesPayload, { onConflict: 'id' });
      if (!error) count += messagesPayload.length;
    }

    // 5. Sync Invoices
    if (state.admin.invoices?.length) {
      const invoicesPayload = state.admin.invoices.map(inv => ({
        id: inv.id,
        num: inv.num,
        client: inv.client,
        desc: inv.desc,
        amount: inv.amount,
        paid_amount: inv.paidAmount || 0,
        status: inv.status,
        payment_method: inv.paymentMethod || 'Wire/Direct',
        payment_date: inv.paymentDate
      }));
      const { error } = await client.from('agency_invoices').upsert(invoicesPayload, { onConflict: 'id' });
      if (!error) count += invoicesPayload.length;
    }

    // 6. Sync Client Accounts
    if (state.admin.clientAccounts?.length) {
      const accountsPayload = state.admin.clientAccounts.map(c => ({
        id: c.id,
        client_name: c.clientName,
        company: c.company,
        contact_name: c.contactName,
        email: c.email,
        username: c.username,
        password: c.password,
        role: c.role,
        status: c.status,
        retainer_tier: c.retainerTier,
        whatsapp_number: c.whatsappNumber,
        project_budget: c.projectBudget || 0,
        paid_amount: c.paidAmount || 0
      }));
      const { error } = await client.from('agency_client_accounts').upsert(accountsPayload, { onConflict: 'id' });
      if (!error) count += accountsPayload.length;
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, timestamp);
    }

    return {
      success: true,
      syncedRecords: count,
      message: `Synchronized ${count} records to Supabase tables at ${timestamp}!`
    };
  } catch (err: any) {
    return {
      success: false,
      syncedRecords: 0,
      message: `Failed to push state to Supabase: ${err.message}`
    };
  }
};

/**
 * Fetch records from Supabase tables to update local state
 */
export const pullStateFromSupabase = async (): Promise<Partial<AgencyState> | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const [usersRes, tasksRes, meetingsRes, messagesRes, invoicesRes, accountsRes] = await Promise.all([
      client.from('agency_users').select('*'),
      client.from('agency_tasks').select('*'),
      client.from('agency_meetings').select('*'),
      client.from('agency_messages').select('*').order('created_at', { ascending: true }),
      client.from('agency_invoices').select('*'),
      client.from('agency_client_accounts').select('*')
    ]);

    const result: Partial<AgencyState> = {
      admin: {} as any
    };

    if (usersRes.data) {
      result.users = usersRes.data.map((row: any): AppUser => ({
        id: row.id,
        name: row.name,
        username: row.username,
        email: row.email,
        password: row.password,
        role: row.role,
        adminRoleTitle: row.admin_role_title,
        clientAccount: row.client_account,
        avatar: row.avatar,
        status: row.status,
        lastLogin: row.last_login,
        profession: row.profession,
        contactAddress: row.contact_address,
        whatsappNumber: row.whatsapp_number,
        permissions: row.permissions
      }));
    }

    if (tasksRes.data) {
      const fetchedTasks: Task[] = tasksRes.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        client: row.client,
        assignee: row.assignee,
        avatar: row.avatar,
        priority: row.priority,
        done: row.done,
        status: row.status,
        dueDate: row.due_date,
        deadline: row.deadline,
        description: row.description
      }));
      result.admin = {
        ...(result.admin as any),
        tasks: fetchedTasks
      };
    }

    if (meetingsRes.data) {
      const fetchedMeetings: MeetingItem[] = meetingsRes.data.map((row: any) => ({
        id: row.id,
        title: row.title,
        client: row.client,
        date: row.date,
        time: row.time,
        attendees: row.attendees || [],
        topic: row.topic,
        notificationAhead: row.notification_ahead || '30m',
        status: row.status || 'scheduled'
      }));
      result.meetings = fetchedMeetings;
    }

    if (messagesRes.data) {
      const fetchedMessages: TeamMessage[] = messagesRes.data.map((row: any) => ({
        id: row.id,
        senderId: row.sender_id,
        senderName: row.sender_name,
        senderAvatar: row.sender_avatar,
        recipientId: row.recipient_id,
        content: row.content,
        timestamp: row.timestamp,
        readStatus: row.read_status || 'delivered'
      }));
      result.teamMessages = fetchedMessages;
    }

    if (invoicesRes.data) {
      const fetchedInvoices: Invoice[] = invoicesRes.data.map((row: any) => ({
        id: row.id,
        num: row.num,
        client: row.client,
        desc: row.desc,
        amount: Number(row.amount),
        paidAmount: Number(row.paid_amount || 0),
        status: row.status,
        paymentMethod: row.payment_method,
        paymentDate: row.payment_date
      }));
      result.admin = {
        ...(result.admin as any),
        invoices: fetchedInvoices
      };
    }

    if (accountsRes.data) {
      const fetchedAccounts: ClientAccount[] = accountsRes.data.map((row: any) => ({
        id: row.id,
        clientName: row.client_name,
        company: row.company,
        contactName: row.contact_name,
        email: row.email,
        username: row.username,
        password: row.password,
        role: row.role,
        status: row.status,
        retainerTier: row.retainer_tier,
        whatsappNumber: row.whatsapp_number,
        projectBudget: Number(row.project_budget || 0),
        paidAmount: Number(row.paid_amount || 0),
        onboardingToken: 'tok_' + row.id,
        magicLinkUrl: (typeof window !== 'undefined' ? `${window.location.origin}/?token=tok_${row.id}` : `/?token=tok_${row.id}`),
        lastLogin: 'Today'
      }));
      result.admin = {
        ...(result.admin as any),
        clientAccounts: fetchedAccounts
      };
    }

    return result;
  } catch (err) {
    console.warn('Failed to pull state from Supabase:', err);
    return null;
  }
};

/**
 * Granular Row-Level Supabase CRUD Mutation Operations
 */

export const insertDbTask = async (t: Task): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      id: t.id,
      title: t.title,
      client: t.client,
      assignee: t.assignee,
      avatar: t.avatar,
      priority: t.priority || 'High',
      done: Boolean(t.done),
      status: t.status || (t.done ? 'done' : 'in_progress'),
      due_date: t.dueDate || t.deadline,
      deadline: t.deadline || t.dueDate,
      description: t.description || ''
    };
    const { error } = await client.from('agency_tasks').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('insertDbTask error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertDbTask network failure:', e);
    return false;
  }
};

export const updateDbTask = async (id: string, updates: Partial<Task>): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.client !== undefined) payload.client = updates.client;
    if (updates.assignee !== undefined) payload.assignee = updates.assignee;
    if (updates.avatar !== undefined) payload.avatar = updates.avatar;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.done !== undefined) payload.done = updates.done;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
    if (updates.deadline !== undefined) payload.deadline = updates.deadline;
    if (updates.description !== undefined) payload.description = updates.description;

    const { error } = await client.from('agency_tasks').update(payload).eq('id', id);
    if (error) {
      console.warn('updateDbTask error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('updateDbTask network failure:', e);
    return false;
  }
};

export const deleteDbTask = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('agency_tasks').delete().eq('id', id);
    return !error;
  } catch (e) {
    return false;
  }
};

export const insertDbInvoice = async (inv: Invoice): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      id: inv.id,
      num: inv.num,
      client: inv.client,
      desc: inv.desc,
      amount: Number(inv.amount || 0),
      paid_amount: Number(inv.paidAmount || 0),
      status: inv.status || 'pending',
      payment_method: inv.paymentMethod || 'Wire/Direct',
      payment_date: inv.paymentDate || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    const { error } = await client.from('agency_invoices').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('insertDbInvoice error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertDbInvoice network failure:', e);
    return false;
  }
};

export const updateDbInvoice = async (id: string, updates: Partial<Invoice>): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.num !== undefined) payload.num = updates.num;
    if (updates.client !== undefined) payload.client = updates.client;
    if (updates.desc !== undefined) payload.desc = updates.desc;
    if (updates.amount !== undefined) payload.amount = Number(updates.amount);
    if (updates.paidAmount !== undefined) payload.paid_amount = Number(updates.paidAmount);
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.paymentMethod !== undefined) payload.payment_method = updates.paymentMethod;
    if (updates.paymentDate !== undefined) payload.payment_date = updates.paymentDate;

    const { error } = await client.from('agency_invoices').update(payload).eq('id', id);
    if (error) {
      console.warn('updateDbInvoice error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('updateDbInvoice network failure:', e);
    return false;
  }
};

export const insertDbMeeting = async (m: MeetingItem): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      id: m.id,
      title: m.title,
      client: m.client,
      date: m.date,
      time: m.time,
      attendees: m.attendees || [],
      topic: m.topic || '',
      notification_ahead: m.notificationAhead || '30m',
      status: m.status || 'scheduled'
    };
    const { error } = await client.from('agency_meetings').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('insertDbMeeting error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertDbMeeting network failure:', e);
    return false;
  }
};

export const deleteDbMeeting = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('agency_meetings').delete().eq('id', id);
    return !error;
  } catch (e) {
    return false;
  }
};

export const insertDbMessage = async (msg: TeamMessage): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      id: msg.id,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_avatar: msg.senderAvatar,
      recipient_id: msg.recipientId,
      content: msg.content,
      timestamp: msg.timestamp,
      read_status: msg.readStatus || 'delivered'
    };
    const { error } = await client.from('agency_messages').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('insertDbMessage error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertDbMessage network failure:', e);
    return false;
  }
};

export const insertDbClientAccount = async (c: ClientAccount): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload = {
      id: c.id,
      client_name: c.clientName,
      company: c.company,
      contact_name: c.contactName,
      email: c.email,
      username: c.username,
      password: c.password,
      role: c.role || 'client',
      status: c.status || 'active',
      retainer_tier: c.retainerTier || 'Scale',
      whatsapp_number: c.whatsappNumber || '',
      project_budget: Number(c.projectBudget || 0),
      paid_amount: Number(c.paidAmount || 0)
    };
    const { error } = await client.from('agency_client_accounts').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('insertDbClientAccount error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('insertDbClientAccount network failure:', e);
    return false;
  }
};

export const updateDbClientAccount = async (id: string, updates: Partial<ClientAccount>): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.clientName !== undefined) payload.client_name = updates.clientName;
    if (updates.company !== undefined) payload.company = updates.company;
    if (updates.contactName !== undefined) payload.contact_name = updates.contactName;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.username !== undefined) payload.username = updates.username;
    if (updates.password !== undefined) payload.password = updates.password;
    if (updates.role !== undefined) payload.role = updates.role;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.retainerTier !== undefined) payload.retainer_tier = updates.retainerTier;
    if (updates.whatsappNumber !== undefined) payload.whatsapp_number = updates.whatsappNumber;
    if (updates.projectBudget !== undefined) payload.project_budget = Number(updates.projectBudget);
    if (updates.paidAmount !== undefined) payload.paid_amount = Number(updates.paidAmount);

    const { error } = await client.from('agency_client_accounts').update(payload).eq('id', id);
    if (error) {
      console.warn('updateDbClientAccount error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('updateDbClientAccount network failure:', e);
    return false;
  }
};

/**
 * SQL Setup DDL for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- VECTORSTUDIO AGENCY OS — SUPABASE POSTGRESQL SCHEMA DDL
-- Run this script in your Supabase SQL Editor to initialize all tables & policies
-- ==============================================================================

-- 1. Users & RBAC Directory Table
CREATE TABLE IF NOT EXISTS public.agency_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  admin_role_title TEXT,
  client_account TEXT,
  avatar TEXT,
  status TEXT DEFAULT 'active',
  last_login TEXT,
  profession TEXT,
  contact_address TEXT,
  whatsapp_number TEXT,
  permissions JSONB,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Tasks & Deadlines Table
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
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Scheduled Meetings & Notifications Table
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
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Real-Time Team Messages Table
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

-- 5. Invoices & Financial Ledger Table
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
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Client Accounts & CRM Table
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
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Realtime broadcasting on tables
ALTER PUBLICATION supabase_realtime ADD TABLE agency_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agency_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE agency_meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE agency_users;

-- Public / Anonymous Access Policies for Development & Demonstration
ALTER TABLE public.agency_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_users" ON public.agency_users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agency_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_tasks" ON public.agency_tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agency_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_meetings" ON public.agency_meetings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agency_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_messages" ON public.agency_messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agency_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_invoices" ON public.agency_invoices FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agency_client_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations for agency_client_accounts" ON public.agency_client_accounts FOR ALL USING (true) WITH CHECK (true);
`;
