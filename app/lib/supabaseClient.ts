import { createClient } from "@supabase/supabase-js";

// Supabase client for browser-side usage (anon key only).
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);
