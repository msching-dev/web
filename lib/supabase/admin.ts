import { createClient } from '@supabase/supabase-js'

// Server-only：繞過 RLS，用於綠界 callback 等沒有 user session 的場景
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)
