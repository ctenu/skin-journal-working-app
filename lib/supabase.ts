import { createClient } from '@supabase/supabase-js'

// Admin client for server-side API routes — uses secret key, bypasses RLS.
// When auth is added, swap API routes to use createServerClient from @supabase/ssr
// so RLS policies filter rows by user_id automatically.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )
}
