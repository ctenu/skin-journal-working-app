# Skin Journal — Project Context for Claude Code

## Project Overview
Converting a single-file HTML app into a full-stack Next.js web app called **Skin Journal** — a daily health tracker where users log diet, stress, sleep, skincare products, environmental exposures, exercise, medications, and skin symptoms.

The app has three tabs: **Log**, **History**, and **Analysis**.

---

## Current State
- Source: a single `index.html` with all UI and logic
- Persistence: `localStorage` (to be replaced)
- Analysis: broken — currently calls OpenAI API directly from the browser (to be moved server-side)

---

## Target Architecture

**Tech Stack:**
- Next.js 14 (App Router)
- Tailwind CSS
- Supabase (Postgres) for database
- OpenAI API (`gpt-4o`) for analysis
- Deployed on Vercel

**Key Requirements:**
1. Preserve the exact existing design and UI functionality from `index.html`
2. Add an API route at `/api/analyze` — takes log entries as input, calls OpenAI server-side, returns analysis
3. Replace `localStorage` with Supabase — one table called `entries` with columns matching the current data structure
4. App must remain deployable on Vercel

---

## Coding Conventions
- Use the App Router (`/app` directory), not Pages Router
- Prefer server components by default; use `"use client"` only where needed
- All API keys must live in environment variables — never hardcoded
- Use Tailwind utility classes for all styling (no separate CSS files unless necessary)

---

## Scaffold Checklist
When starting, Claude should:
- [ ] Scaffold the full Next.js project structure
- [ ] Install all necessary dependencies
- [ ] Create the Supabase `entries` table schema (SQL migration file)
- [ ] Implement `/api/analyze` route with proper error handling
- [ ] Migrate existing UI from `index.html` into the Next.js component structure
- [ ] Create `.env.local.example` listing all required environment variables

---

## Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

---

## Source File
The original `index.html` is located at the project root. Reference it for all UI, layout, field names, and data structures.
