// lib/supabase/public.ts
import { createBrowserClient } from '@supabase/ssr'

export const createPublicClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )