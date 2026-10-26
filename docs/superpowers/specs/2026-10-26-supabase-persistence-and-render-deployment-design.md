# Design Specification: Supabase Database Persistence & Render Deployment

- **Project:** VectorStudio Agency OS
- **Date:** 2026-10-26
- **Status:** Proposed (Under Review)

---

## 1. Intent & Purpose

VectorStudio Agency OS is a high-performance executive agency operations platform and transparent client portal built with React 19, TypeScript, and Vite. 

The goal of this initiative is to transition the platform from local mock state to **full Supabase database persistence** using **Approach A (Granular Row-Level CRUD & Realtime Channels)**, eliminate security risks before pushing to GitHub, resolve all code linter errors, and deploy as a production-ready Single Page Application (SPA) on Render.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
1. **Live Row-Level CRUD Operations:** Direct insertion, updating, and querying of `agency_tasks`, `agency_invoices`, `agency_meetings`, `agency_messages`, and `agency_client_accounts` in Supabase.
2. **Realtime Multi-Client Synchronization:** Enable Supabase Realtime (`postgres_changes`) so changes made by an admin (or a client) update live across open sessions without page refresh.
3. **Resilient Offline/Fallback Support:** Retain optimistic local state updates so UI interactions remain instantaneous, falling back gracefully to local state if Supabase credentials are missing or network connectivity drops.
4. **Zero-Secret GitHub Repository:** Prevent sensitive database passwords from being committed to Git by configuring `.gitignore` properly and providing a sanitized `.env.example`.
5. **Full Linter & Type Compliance:** Fix the React rules-of-hooks violation in `AuthModal.tsx` and ensure `npm run lint` and `npm run build` pass with zero errors.
6. **SPA Routing on Render:** Provide static redirect configurations (`_redirects`) so deep links and reloads do not return 404 errors on Render.
7. **Production Documentation:** Provide a comprehensive `README.md` covering architecture, demo credentials, Supabase setup, and Render deployment instructions.

### Non-Goals
- Replacing the lightweight client session switcher with strict Supabase Auth emails (which would prevent instant demo switching between Agency Founder and Client accounts).
- Redesigning existing UI components or modifying design tokens.

### Anti-Goals
- **Never commit secrets:** Never commit `.env` or raw connection strings to GitHub.
- **No blocking spinners on UI:** Database writes must not freeze or delay UI responsiveness; operations must be optimistic.

---

## 3. Approaches Considered & Trade-offs

| Approach | Description | Trade-offs & Evaluation | Status |
| :--- | :--- | :--- | :--- |
| **Approach A: Granular Row-Level CRUD + Realtime Sync** | Each action (`addTask`, `payInvoice`, `sendRealTimeMessage`, etc.) triggers a discrete row mutation in Supabase while maintaining optimistic UI state. Listens to `postgres_changes`. | Requires mapping individual handlers in `AgencyContext.tsx`. Guarantees zero overwrites between concurrent users and delivers true realtime collaboration. | **SELECTED** |
| **Approach B: Debounced State Snapshot Sync** | Periodic bulk push of the entire `state` JSON arrays to Supabase using `pushStateToSupabase`. | Simpler to implement, but prone to race conditions and state overwrites in multi-user environments. | Rejected |
| **Approach C: Strict Supabase Auth & RLS Lockdown** | Enforcing Supabase Auth user sessions and strict `auth.uid()` RLS policies. | High migration friction; breaks one-click demo accounts and magic-link tokens for agency presentations. | Rejected |

---

## 4. Architecture & Implementation Plan

### 4.1. Security & Git Hygiene
- Update `.gitignore` to include `.env`, `.env.local`, `.env.*.local`, and build artifacts.
- Keep `.env.example` committed with placeholder variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `DATABASE_URL`).
- Add user instruction to obtain `VITE_SUPABASE_ANON_KEY` from Supabase Dashboard > Project Settings > API.

### 4.2. Database CRUD & Realtime Layer (`src/lib/supabase.ts`)
- Implement individual async mutation helpers:
  - `insertDbTask(task: Task)`
  - `updateDbTask(id: string, updates: Partial<Task>)`
  - `insertDbInvoice(invoice: Invoice)`
  - `updateDbInvoice(id: string, updates: Partial<Invoice>)`
  - `insertDbMeeting(meeting: MeetingItem)`
  - `deleteDbMeeting(id: string)`
  - `insertDbMessage(msg: TeamMessage)`
  - `insertDbClientAccount(account: ClientAccount)`
  - `updateDbClientAccount(id: string, updates: Partial<ClientAccount>)`
- Ensure all calls handle network errors silently without throwing unhandled promise rejections.

### 4.3. Agency Context Integration (`src/context/AgencyContext.tsx`)
- Update mutation actions (`addTask`, `toggleTask`, `addInvoice`, `payInvoice`, `recordClientPayment`, `scheduleMeeting`, `deleteMeeting`, `sendRealTimeMessage`, `addClientAccount`) to call the Supabase CRUD helpers in the background while updating React state immediately.
- On mount:
  1. Pull initial state from Supabase (`pullStateFromSupabase`).
  2. Subscribe to Supabase Realtime channel (`agency-db-changes`) for `INSERT`, `UPDATE`, and `DELETE` on all 6 tables.
  3. Inspect `window.location.search` for `?token=` to automatically log in clients using magic link tokens.
  4. Ensure magic link URLs use `window.location.origin` rather than hardcoded `http://localhost:8080`.

### 4.4. Code Quality & Linter Compliance
- **Fix `src/components/modals/AuthModal.tsx`:** Move all `useState` calls above the `if (activeModal !== 'auth') return null;` check to obey React's Rules of Hooks.
- **Fix `src/components/AdminSettings.tsx`:** Use a lazy initializer function for date state and fix unused catch parameter.
- **Favicon & Broken Links:** Update `index.html` icon path to `/favicon.svg`.
- **Avatar Fallbacks:** Ensure avatar components gracefully fallback to SVG initials/icons if an image fails to load.

### 4.5. Render Deployment Configuration
- Add `public/_redirects`:
  ```text
  /*    /index.html   200
  ```
- Configure Render Static Site settings:
  - **Build Command:** `npm run build`
  - **Publish Directory:** `dist`
  - **Environment Variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## 5. Verification & Testing Checklist

- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds cleanly producing `/dist`.
- [ ] Task creation adds row to `agency_tasks` in Supabase.
- [ ] Invoice creation and payment updates `agency_invoices` in Supabase.
- [ ] Team messaging inserts row into `agency_messages` and broadcasts to active clients.
- [ ] Browser refresh on sub-routes (`_redirects`) serves `index.html`.
- [ ] `.env` is verified untracked by `git status`.
