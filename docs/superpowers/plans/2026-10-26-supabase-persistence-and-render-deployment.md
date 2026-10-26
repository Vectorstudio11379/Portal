# Supabase Persistence & Render Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement granular row-level Supabase database persistence and realtime synchronization for VectorStudio Agency OS, resolve code quality/linter errors, configure SPA routing for Render, and prepare the repository for GitHub and Render deployment.

**Architecture:** Extend `src/lib/supabase.ts` with typed row-level CRUD mutation helpers (`agency_tasks`, `agency_invoices`, `agency_meetings`, `agency_messages`, `agency_client_accounts`) and integrate them into `AgencyContext.tsx` alongside optimistic UI state updates and Supabase Realtime channel listeners. Fix React rules-of-hooks violations in `AuthModal.tsx`, add `public/_redirects` for SPA client-side routing on Render, and initialize a secure Git repository.

**Tech Stack:** React 19, TypeScript 6, Vite 8, `@supabase/supabase-js`, Lucide React, Oxlint, Render Static Site.

**Spec:** [docs/superpowers/specs/2026-10-26-supabase-persistence-and-render-deployment-design.md](file:///c:/Users/new/Documents/Project%20Z/docs/superpowers/specs/2026-10-26-supabase-persistence-and-render-deployment-design.md)

## Global Constraints

- Never commit `.env` or plain-text database credentials to Git.
- UI state updates must remain optimistic and instantaneous; database writes must be handled asynchronously without blocking user interactions.
- All Supabase operations must fail gracefully if offline or if network credentials fail.
- `npm run lint` and `npm run build` (`tsc -b && vite build`) must pass with 0 errors.

## Review Focus

1. **Missing or invalid Supabase Anon Key:** The app must load with local state without throwing uncaught exceptions.
2. **Concurrent task or invoice updates:** Granular row mutations must only update targeted records, preventing full-table overwrite conflicts.
3. **SPA direct navigation on Render:** Direct visits to subpaths or page refresh must route to `/index.html` via `_redirects`.
4. **Magic link tokens:** Must use `window.location.origin` dynamically rather than hardcoded `localhost:8080`, and log in the client when visited with `?token=`.
5. **React Rules of Hooks:** No conditional Hook invocations anywhere in the codebase.

---

### Task 1: Supabase Granular Row-Level CRUD & Helper Functions

**Files:**
- Modify: `src/lib/supabase.ts:1-539`

**Interfaces:**
- Produces:
  - `insertDbTask(task: Task): Promise<boolean>`
  - `updateDbTask(id: string, updates: Partial<Task>): Promise<boolean>`
  - `insertDbInvoice(invoice: Invoice): Promise<boolean>`
  - `updateDbInvoice(id: string, updates: Partial<Invoice>): Promise<boolean>`
  - `insertDbMeeting(meeting: MeetingItem): Promise<boolean>`
  - `deleteDbMeeting(id: string): Promise<boolean>`
  - `insertDbMessage(msg: TeamMessage): Promise<boolean>`
  - `insertDbClientAccount(account: ClientAccount): Promise<boolean>`
  - `updateDbClientAccount(id: string, updates: Partial<ClientAccount>): Promise<boolean>`

- [ ] **Step 1: Implement row mutation helper functions in `src/lib/supabase.ts`**
  Add typed helper functions for insert and update operations on `agency_tasks`, `agency_invoices`, `agency_meetings`, `agency_messages`, and `agency_client_accounts`.
- [ ] **Step 2: Update magic link generation to use dynamic `window.location.origin`**
  Replace hardcoded `http://localhost:8080` in `pullStateFromSupabase` with `(typeof window !== 'undefined' ? window.location.origin : '')`.
- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: Builds cleanly without type errors.
- [ ] **Step 4: Commit changes**
  ```bash
  git add src/lib/supabase.ts
  ```

---

### Task 2: Wire Actions and Realtime Listeners in `AgencyContext.tsx`

**Files:**
- Modify: `src/context/AgencyContext.tsx:450-580, 1530-1820`

**Interfaces:**
- Consumes: CRUD functions from `src/lib/supabase.ts`
- Produces: Persistent task additions, invoice updates, payment recordings, meeting scheduling, team messages, and magic-link URL token handling.

- [ ] **Step 1: Connect `addTask` and `toggleTask` to Supabase**
  Call `insertDbTask` and `updateDbTask` in background after optimistic local state update.
- [ ] **Step 2: Connect `addInvoice`, `payInvoice`, and `recordClientPayment` to Supabase**
  Call `insertDbInvoice` and `updateDbInvoice` in background when invoices are created or payment status changes.
- [ ] **Step 3: Connect `scheduleMeeting` and `deleteMeeting` to Supabase**
  Call `insertDbMeeting` and `deleteDbMeeting` in background.
- [ ] **Step 4: Connect `sendRealTimeMessage` to Supabase**
  Call `insertDbMessage` to persist chat messages directly into `agency_messages`.
- [ ] **Step 5: Connect `addClientAccount` and `updateClientAccount` to Supabase**
  Call `insertDbClientAccount` and `updateDbClientAccount` in background.
- [ ] **Step 6: Add URL `?token=` parameter detection on mount**
  In an initialization `useEffect`, check `window.location.search` for `token=tok_...`. If found, match the client account and log in as client.
- [ ] **Step 7: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: Successful compilation.

---

### Task 3: Fix Linter Violations, Hooks Rules & Asset Fallbacks

**Files:**
- Modify: `src/components/modals/AuthModal.tsx:1-25`
- Modify: `src/components/AdminSettings.tsx:60-65, 110-115, 255-260`
- Modify: `index.html:1-18`

- [ ] **Step 1: Fix conditional Hook in `src/components/modals/AuthModal.tsx`**
  Move all `useState` calls to top of component before `if (activeModal !== 'auth') return null;`.
- [ ] **Step 2: Fix date state and unused error variable in `src/components/AdminSettings.tsx`**
  Use lazy initializer callback `useState(() => new Date().toLocaleDateString(...))` and handle or remove unused `err` parameter.
- [ ] **Step 3: Fix favicon reference in `index.html`**
  Change `/vite.svg` to `/favicon.svg`.
- [ ] **Step 4: Run Oxlint to verify zero errors**
  Run: `npm run lint`
  Expected: 0 errors.

---

### Task 4: Render SPA Routing & Project Documentation

**Files:**
- Create: `public/_redirects`
- Modify: `README.md`

- [ ] **Step 1: Create `public/_redirects` for Render static site routing**
  Add redirect rule:
  ```text
  /*    /index.html   200
  ```
- [ ] **Step 2: Update `README.md`**
  Replace Vite starter template with complete documentation:
  - VectorStudio Agency OS overview and features.
  - Demo user accounts & credentials table.
  - Supabase integration setup & schema migrations.
  - Step-by-step instructions for deploying to Render (build command: `npm run build`, publish directory: `dist`, environment variables).
- [ ] **Step 3: Verify production build output**
  Run: `npm run build`
  Expected: `dist/_redirects` and `dist/index.html` created in output directory.

---

### Task 5: Git Repository Initialization & Security Verification

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Verify `.gitignore` ignores `.env` and secrets**
  Check that `.env`, `.env.local`, `.env.*.local` are excluded.
- [ ] **Step 2: Initialize Git repository**
  Run `git init` and check `git status` to ensure `.env` is NOT tracked.
- [ ] **Step 3: Create initial commit on branch `main`**
  Stage files and commit:
  ```bash
  git add .
  git commit -m "feat: VectorStudio Agency OS with Supabase persistence and Render deployment configuration"
  ```
- [ ] **Step 4: Provide instructions to user for GitHub repository push and Render deployment**
