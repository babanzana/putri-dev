import { createClient } from "@supabase/supabase-js";

// Supabase client for browser-side usage (anon key only).
// Provide sensible fallbacks so build/prerender doesn't crash when env vars are missing.
const fallbackUrl = "https://mouisdjwiiirvxnyhora.supabase.co";
const fallbackAnonKey =
  "sb_publishable_SAIUJyYGsDK4SQWv3wU4kg_jc_kZrQ3";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
