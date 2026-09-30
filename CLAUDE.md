# Skin Journal — Project Context for Claude Code

## Project Overview
**Skin Journal** is a Next.js mobile web app that helps users identify triggers for skin conditions through daily logging and AI-powered correlation analysis. Deployed at [bunbunskinlog.vercel.app](https://bunbunskinlog.vercel.app).

The app has three tabs: **Log**, **History**, and **Analysis**.

---

## Current State
The app is in active beta with a real user. Core features are working:
- Multi-user support via Supabase auth
- Daily logging (diet, stress, sleep, skincare, exposures, symptoms, etc.)
- AI pattern analysis via `/api/analyze` (OpenAI `gpt-4o`, key in `OPENAI_API_KEY`)
- Separate Supabase projects for dev and prod

### Recent Completed Work
- **Auth**: Replaced magic link auth with 6-digit email OTP (`OTP_LENGTH` in `app/login/page.tsx` must match the Supabase setting in both dev and prod). Removed `/app/auth/callback`. Login lives in `app/login/page.tsx`. Login is invite-only (`shouldCreateUser: false`, and sign-ups disabled in the prod Supabase dashboard); add users via Supabase → Authentication → Users.
- **UI Redesign**: Migrated from warm brown earth-tone palette to soft sage/forest green aesthetic. Uses botanical SVG decorations, bottom navigation, and Lucide React icons (replacing emoji labels).
- **Environment separation**: Dev and prod use separate Supabase projects. Vercel environment variables are scoped per environment.

---

## Architecture

**Tech Stack:**
- Next.js 14 (App Router)
- Tailwind CSS + custom CSS variables for theming
- Supabase (Postgres + Auth) for database and authentication
- OpenAI API (`gpt-4o` via `/api/analyze`) for pattern analysis
- Fonts self-hosted via `@fontsource` + `next/font/local` (`next/font/google` breaks Vercel builds)
- Vitest + Testing Library for tests
- Lucide React for icons
- Deployed on Vercel / GitHub

**Key Routes:**
- `app/login/page.tsx` — Email OTP login
- `app/page.tsx` — Main app shell (Log, History, Analysis tabs)
- `app/api/analyze/route.ts` — Server-side OpenAI call (client created per request so builds don't need the key)
- `app/api/entries/route.ts` — Entries CRUD; POST validates input with `lib/validate.ts`
- `lib/format.ts` — Shared date formatting and `formatEntriesForAI()` (used by the analyze route and the copy-logs button)
- Entry `date` is the user's **local** calendar day (`YYYY-MM-DD`). Create it with `toLocalDateString()` and display it with `fmtDate()`/`parseLocalDate()` — never `new Date('YYYY-MM-DD')` or `toISOString()`, which use UTC and shift the day.

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
OPENAI_API_KEY=
Dev and prod use **separate** Supabase projects. Local `.env.local` points to the dev project.

---

## Known Issues / Backlog
- Mobile UX improvements (not yet tracked elsewhere):
  - Symptom chip tap targets too small
  - Save button obscured by keyboard
  - Severity slider → segmented buttons
  - Collapsible form sections
- Seasonal re-engagement: usage is low in summer (expected); plan needed for fall/winter re-engagement when skin issues return.
- Google OAuth: assessed as useful but lower priority.

---

## Testing Approach
- Automated: `npm test` (Vitest) — unit tests for `lib/` plus regression tests for bugs that reached production. When fixing a bug, add a test that fails without the fix. CI (`.github/workflows/ci.yml`) runs lint, tests and build on every push and PR.
- Local: check `.env.local` → `npm install` if needed → `npm run dev` → verify in browser (console + Network tab) → check Supabase Table Editor → `npm test` → `npm run build`
- Don't run `npm run build` in the project folder while `npm run dev` is running — both write to `.next` and the dev server breaks. Stop the dev server first, or use `npx tsc --noEmit` for type checks.
- Multi-user testing: use two separate browsers with two different accounts to avoid session cookie collisions
- The `/api/analyze` route consumes OpenAI API credits (platform.openai.com) — keep a monthly budget limit set there

---

## Usage Context
- Primary user: one beta tester (the developer's friend)
- Skin condition is **seasonal (winter)** — low logging activity in summer is expected and normal, not a UX problem
- Success metric: helping the user generate genuine insight from logged data
- "Product effectiveness experiment mode" is explicitly deferred to a later version