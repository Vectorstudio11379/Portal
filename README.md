# VectorStudio Agency OS — Executive Platform & Client Portal

A high-performance, dark-mode agency operating system built with **React 19**, **TypeScript**, **Vite**, and **Supabase**. VectorStudio Agency OS combines executive operations (pipeline CRM, financial ledgers, sprint task boards, timeline roadmaps, calendar meetings, and team chat) with a dedicated, transparent Client Portal for deliverables sign-off and milestone tracking.

---

## ✨ Features

- **Executive Operations Suite:**
  - **Live Dashboard:** Revenue streamgraphs, KPI telemetry, conversion gauges, and sprint pipeline.
  - **Task & Sprint Kanban:** Priority-based task tracking, assignees, deadlines, and direct Supabase synchronization.
  - **Invoices & Financial Ledger:** Track paid, pending, and overdue invoices with support for partial and wire/ACH settlements.
  - **Customers & Leads CRM:** Full client onboarding flow, retainer tiers (Scale, Enterprise, Growth), and magic-link invitation generation.
  - **Interactive Meetings Calendar:** Schedule client reviews and team syncs with customizable ahead-of-time reminders.
  - **Real-Time Team Messaging:** Internal chat channels with instant optimistic updates and Supabase Realtime synchronization.
  - **VectorAI Executive Copilot:** AI assistant (powered by Google Gemini 1.5/flash) accessible via floating button or `Ctrl+K` / `Cmd+K`.

- **Client Portal:**
  - Client-specific dashboard with active project milestones and deliverables approval stream.
  - One-click deliverable sign-offs or change requests with audit logs.
  - Digital assets directory and financial statement viewer.

- **Security & RBAC:**
  - Role-based permissions (Executive SuperAdmin, Project Manager, Lead Developer, UI/UX Designer, Client Owner).
  - Row Level Security (RLS) on all Supabase tables.

---

## 👥 Demo Accounts & Credentials

You can sign in using any of the pre-configured accounts directly from the login page or using the demo switcher:

| Name | Role | Identifier | Default Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Owais Anwer** | Admin | `owais` | `admin123` | Managing Director & SuperAdmin |
| **Carlos Mendes** | Admin | `carlos` | `admin123` | Lead Design Architect |
| **Sarah Jenkins** | Client | `sarah.arc` | `client123` | Arc Company Portal Owner |
| **Elena Rostova** | Client | `elena.nexus` | `client123` | Nexus Labs Portal Owner |
| **David Chen** | Client | `dchen.lumina` | `client123` | Lumina Health Portal Owner |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript 6, Vite 8
- **Icons & Styling:** Lucide React, Custom CSS Design System (Design Tokens, Dark/Light Mode)
- **Database & Realtime:** Supabase (`@supabase/supabase-js`, PostgreSQL, RLS, Realtime replication)
- **Linter & Compiler:** Oxlint, TypeScript Compiler (`tsc`)
- **Deployment:** Render Static Site (with `_redirects` SPA rewrite rules)

---

## 🚀 Getting Started Locally

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd "Project Z"
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
```

### 3. Database Initialization (Supabase)
Run the automated table generator to execute schema migrations and seed initial platform data:
```bash
npm run db:setup
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🌐 Deploying to Render

Deploy VectorStudio Agency OS to **Render** in 3 simple steps:

### Step 1: Push to GitHub
1. Initialize Git and commit your repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of VectorStudio Agency OS"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Link and push your branch:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Static Site on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Static Site**.
3. Select your newly created GitHub repository.
4. Fill in the build settings:
   - **Name:** `agency-os` (or your preferred name)
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`

### Step 3: Add Environment Variables on Render
Under the **Environment Variables** section on Render, add:
- `VITE_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `<your-supabase-anon-key>`

Click **Create Static Site**. Render will build and deploy your application with global CDN caching and automatic SPA sub-route rewrites enabled via `public/_redirects`.

---

## 📄 License
Private & Proprietary — VectorStudio Design & Engineering Operations.
