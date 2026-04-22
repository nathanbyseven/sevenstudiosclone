# Seven Studios — Client Portal
### Setup & Deployment Guide

---

## Overview

This is a **Next.js 14 App Router** application that adds a secure client portal (`/login`, `/client/*`) to the Seven Studios website. The existing static `index.html` site is preserved as a public page — the portal runs as additional routes within the same deployment.

**Stack:** Next.js 14 · Supabase (Auth + Postgres + Storage) · Tailwind CSS · TypeScript · Vercel

---

## Step 1 — Migrate the Repo to Next.js

Your current repo (`thesevenstudios-main`) contains only `index.html` and `vercel.json`. You need to convert it to a Next.js project.

```bash
# Clone your repo
git clone https://github.com/nathanbyseven/thesevenstudios.git
cd thesevenstudios

# Copy ALL portal files from this delivery into the repo root:
# - app/
# - components/
# - lib/
# - scripts/
# - supabase/
# - styles/
# - package.json
# - tsconfig.json
# - tailwind.config.ts
# - postcss.config.js
# - next.config.js
# - middleware.ts
# - vercel.json      ← REPLACE the existing one
# - .gitignore
# - .env.example
```

### Preserve the existing site as a Next.js page

Move your `index.html` content into Next.js. The simplest approach:

```bash
mkdir -p public
# Copy font files so Next.js can serve them
cp -r public/fonts public/fonts   # already in place if you had them
```

Create `app/page.tsx` to serve the existing homepage:

```tsx
// app/page.tsx
// Option A: redirect to the static HTML (keep index.html in /public)
export default function Home() {
  return null // handled by next.config.js rewrites, or
}
```

Or, for zero disruption, add this to `next.config.js`:

```js
// next.config.js  — add to existing exports
async rewrites() {
  return [
    {
      source: '/',
      destination: '/index.html', // serve from /public
    },
  ]
},
```

Then move `index.html` into `public/index.html`. The portal routes `/login` and `/client` will be handled by Next.js; `/` will serve the static file.

---

## Step 2 — Supabase Setup

### 2a. Run the Schema SQL

1. Go to [supabase.com](https://supabase.com) → your project (`gflyiytagaulfyackemh`)
2. Open **SQL Editor**
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run**

This creates:
- `client_profiles`
- `projects`
- `milestones`
- `meetings`
- `invoices`
- `documents`

With RLS policies on every table so clients can only see their own data.

### 2b. Create the Storage Bucket

1. In Supabase → **Storage** → **New Bucket**
2. Name: `client-documents`
3. Public: **NO** (leave unchecked — private bucket)
4. Click **Create**

Then go to **Storage → Policies** and add these two policies on the `client-documents` bucket:

**Policy 1 — clients download their own files:**
```sql
CREATE POLICY "client-documents: own read"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'client-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 2 — admin upload (service role bypasses this anyway, but good practice):**
```sql
CREATE POLICY "client-documents: admin upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'client-documents');
```

> Files must be uploaded under the path `{client_uuid}/filename.pdf` so the RLS policy above works correctly.

---

## Step 3 — Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gflyiytagaulfyackemh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Jv26w6aUnKoB8HygTMlkPg_W0IL2LF-

# Get from: Dashboard → Project Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_role_key

NEXTAUTH_URL=https://thesevenstudio.co.za
```

**CRITICAL:** Never commit `.env.local`. It is already in `.gitignore`.

---

## Step 4 — Install & Test Locally

```bash
npm install
npm run dev
```

Visit:
- `http://localhost:3000/login` — login page
- `http://localhost:3000/client` — dashboard (will redirect to login if not authenticated)

---

## Step 5 — Create Your First Client

Use the admin script to create a client account:

```bash
# Load your .env.local variables first:
export $(cat .env.local | xargs)

# Run the creation script:
node scripts/create-client.mjs
```

Follow the prompts — enter email, password, name, and company. The script:
1. Creates a Supabase Auth user (no email verification required)
2. Inserts a `client_profiles` row
3. Outputs the login credentials to send to your client

**Alternatively, use the Supabase Dashboard:**
1. Authentication → Users → **Add User**
2. Enter email + password, enable "Auto Confirm User"
3. Copy the UUID
4. Run in SQL Editor:
```sql
INSERT INTO public.client_profiles (id, full_name, company)
VALUES ('PASTE-UUID-HERE', 'Client Name', 'Company Name');
```

---

## Step 6 — Upload Documents for a Client

When uploading files for a client, use the path format:
```
{client_uuid}/{filename}
```

Example via Supabase Dashboard:
1. Storage → client-documents → **Upload file**
2. Upload to folder named with the client's UUID
3. Then insert a row into `documents`:

```sql
INSERT INTO public.documents
  (client_id, name, description, category, storage_path, file_size, mime_type)
VALUES
  ('CLIENT-UUID', 'Brand Guidelines v1.pdf', 'Final brand guidelines', 'report',
   'CLIENT-UUID/brand-guidelines-v1.pdf', 2048000, 'application/pdf');
```

---

## Step 7 — Populate Project Data

Insert projects, milestones, meetings, and invoices via the Supabase Dashboard → **Table Editor**, or via SQL:

```sql
-- Project
INSERT INTO public.projects (client_id, name, description, status, start_date, end_date)
VALUES ('CLIENT-UUID', 'Brand Identity', 'Logo, type system, guidelines', 'active', '2025-01-01', '2025-03-31');

-- Milestones
INSERT INTO public.milestones (project_id, client_id, title, due_date, completed)
VALUES
  ('PROJECT-UUID', 'CLIENT-UUID', 'Discovery', '2025-01-15', true),
  ('PROJECT-UUID', 'CLIENT-UUID', 'Concepts', '2025-02-01', false);

-- Meeting
INSERT INTO public.meetings (client_id, title, meeting_date, duration_min, notes)
VALUES ('CLIENT-UUID', 'Kickoff', now(), 60, 'Covered scope and timeline.');

-- Invoice
INSERT INTO public.invoices (client_id, invoice_number, title, amount, status, issued_date, due_date)
VALUES ('CLIENT-UUID', 'SS-2025-001', 'Deposit', 12500, 'pending', now()::date, (now() + interval '14 days')::date);
```

---

## Step 8 — Deploy to Vercel

### 8a. Push to GitHub

```bash
git add .
git commit -m "feat: add Next.js client portal"
git push origin main
```

### 8b. Add Environment Variables in Vercel

1. Vercel Dashboard → your project → **Settings → Environment Variables**
2. Add all variables from `.env.example` with real values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_URL` = `https://thesevenstudio.co.za`

3. Set scope: **Production** + **Preview**

### 8c. Trigger a Deploy

```bash
# Either push a commit, or in Vercel dashboard:
# Deployments → Redeploy
```

### 8d. Confirm Supabase Auth Redirect URLs

In Supabase → **Authentication → URL Configuration**:
- Site URL: `https://thesevenstudio.co.za`
- Redirect URLs: Add `https://thesevenstudio.co.za/api/auth/callback`

---

## Architecture Summary

```
thesevenstudios/
├── app/
│   ├── layout.tsx              ← Root layout (font, global CSS)
│   ├── globals.css             ← Tailwind + design tokens
│   ├── page.tsx                ← Homepage (existing site)
│   ├── login/
│   │   └── page.tsx            ← Login page (server + client form)
│   ├── client/
│   │   ├── layout.tsx          ← Auth guard + sidebar (server)
│   │   ├── page.tsx            ← Overview dashboard
│   │   ├── timeline/page.tsx   ← Project milestones
│   │   ├── meetings/page.tsx   ← Meeting notes
│   │   ├── invoices/page.tsx   ← Invoice list + totals
│   │   └── documents/page.tsx  ← File downloads
│   └── api/
│       ├── auth/callback/      ← Supabase OAuth callback
│       ├── auth/signout/       ← POST sign-out handler
│       └── documents/download/ ← Signed URL generator
├── components/portal/
│   ├── LoginForm.tsx           ← 'use client' auth form
│   ├── PortalSidebar.tsx       ← Desktop nav
│   ├── PortalTopBar.tsx        ← Mobile nav + breadcrumb
│   ├── MeetingCard.tsx         ← Expandable meeting notes
│   └── DocumentGrid.tsx        ← Secure file download grid
├── lib/supabase/
│   ├── client.ts               ← Browser client
│   ├── server.ts               ← Server client + admin client
│   ├── middleware.ts            ← Session refresh + route guards
│   └── types.ts                ← TypeScript schema types
├── middleware.ts               ← Next.js edge middleware
├── supabase/schema.sql         ← Complete DB schema + RLS
└── scripts/create-client.mjs  ← Admin: create new client users
```

---

## Security Notes

- **No self-signup.** Auth is email+password only, created manually by admin.
- **RLS on every table.** `auth.uid() = client_id` enforced at the database level — no client can ever read another client's data, even if they manipulate requests.
- **Private storage bucket.** Documents are never publicly accessible. Downloads require a fresh signed URL generated server-side, valid for 60 seconds only.
- **Service role key is server-only.** Never imported in Client Components. Only used in `lib/supabase/server.ts` admin client and the Node.js script.
- **Middleware runs on every request.** Unauthenticated users hitting any `/client/*` route are redirected to `/login` at the edge before any page renders.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Login redirects to `/login` in a loop | Check `NEXT_PUBLIC_SUPABASE_URL` and anon key in Vercel env vars |
| "Unauthorised" on document download | Ensure the file storage path starts with `{client_uuid}/` |
| Profile not showing in sidebar | Confirm `client_profiles` row exists with matching UUID |
| 500 on sign-out | Add `NEXTAUTH_URL` to Vercel env vars |
| Fonts not loading | Ensure `/public/fonts/*.otf` files are committed to the repo |

---

*Built for Seven Studios® · thesevenstudio.co.za*
