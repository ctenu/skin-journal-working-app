# Skin Journal — Project Context for Claude Code

## Project Overview
**Skin Journal** is a Next.js mobile web app that helps users identify triggers for skin conditions through daily logging and AI-powered correlation analysis. Deployed at [bunbunskinlog.vercel.app](https://bunbunskinlog.vercel.app).

The app has three tabs: **Log**, **History**, and **Analysis**.

---

## Current State
The app is in active beta with a real user. Core features are working:
- Multi-user support via Supabase auth
- Daily logging (diet, stress, sleep, skincare, exposures, symptoms, etc.)
- AI pattern analysis via `/api/analyze` (Anthropic API, not OpenAI)
- Separate Supabase projects for dev and prod

### Recent Completed Work
- **Auth**: Replaced magic link auth with 6-digit email OTP (`OTP_LENGTH` in `app/login/page.tsx` must match the Supabase setting in both dev and prod). Removed `/app/auth/callback`. Login lives in `app/login/page.tsx`.
- **UI Redesign**: Migrated from warm brown earth-tone palette to soft sage/forest green aesthetic. Uses botanical SVG decorations, bottom navigation, and Lucide React icons (replacing emoji labels).
- **Environment separation**: Dev and prod use separate Supabase projects. Vercel environment variables are scoped per environment.

---

## Architecture

**Tech Stack:**
- Next.js 14 (App Router)
- Tailwind CSS + custom CSS variables for theming
- Supabase (Postgres + Auth) for database and authentication
- Anthropic API (`claude-sonnet` via `/api/analyze`) for pattern analysis
- Lucide React for icons
- Deployed on Vercel / GitHub

**Key Routes:**
- `app/login/page.tsx` — Email OTP login
- `app/page.tsx` — Main app shell (Log, History, Analysis tabs)
- `app/api/analyze/route.ts` — Server-side Anthropic API call

---

## Coding Conventions
- Use the App Router (`/app` directory), not Pages Router
- Prefer server components by default; use `"use client"` only where needed
- All API keys must live in environment variables — never hardcoded
- Use Tailwind utility classes + CSS variables for styling
- Icons: use Lucide React — do not use emoji as UI labels
- Run `npm run build` locally before pushing to catch TypeScript errors pre-Vercel

---

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
ANTHROPIC_API_KEY=
Dev and prod use **separate** Supabase projects. Local `.env.local` points to the dev project.

---

## Known Issues / Backlog
- Mobile UX improvements tracked in `BACKLOG.md`:
  - Symptom chip tap targets too small
  - Save button obscured by keyboard
  - Severity slider → segmented buttons
  - Collapsible form sections
- Seasonal re-engagement: usage is low in summer (expected); plan needed for fall/winter re-engagement when skin issues return.
- Google OAuth: assessed as useful but lower priority.

---

## Testing Approach
- Local: check `.env.local` → `npm install` if needed → `npm run dev` → verify in browser (console + Network tab) → check Supabase Table Editor → `npm run build`
- Multi-user testing: use two separate browsers with two different accounts to avoid session cookie collisions
- The `/api/analyze` route consumes Anthropic API credits from console.anthropic.com (separate from Claude.ai Pro subscription) — keep a spend limit set on the console

---

## Usage Context
- Primary user: one beta tester (the developer's friend)
- Skin condition is **seasonal (winter)** — low logging activity in summer is expected and normal, not a UX problem
- Success metric: helping the user generate genuine insight from logged data
- "Product effectiveness experiment mode" is explicitly deferred to a later version